import React, { useEffect, useRef, useState } from "react";

type StyleInjectorProps = {
  textColor?: string;
  backgroundColor?: string;
  editMode?: boolean;
  transparentChildren?: boolean;
  textAnimation?: boolean;
  children: React.ReactNode;
};

type Offset = { x: number; y: number };
type OffsetMap = Record<string, Offset>;
type ZIndexMap = Record<string, number>;
type DragState = {
  id: string;
  startX: number;
  startY: number;
  baseX: number;
  baseY: number;
};

export default function StyleInjector({
  textColor = "#101828",
  backgroundColor = "#e4e7ec",
  editMode = false,
  transparentChildren = false,
  textAnimation = false,
  children,
}: StyleInjectorProps) {
  const [offsets, setOffsets] = useState<OffsetMap>({});
  const [zIndices, setZIndices] = useState<ZIndexMap>({});
  const offsetsRef = useRef<OffsetMap>(offsets);
  const topZRef = useRef(1);
  const dragRef = useRef<DragState | null>(null);

  useEffect(() => {
    offsetsRef.current = offsets;
  }, [offsets]);

  useEffect(() => {
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  function handleMouseMove(event: MouseEvent) {
    const drag = dragRef.current;
    if (!drag) return;

    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    const nextOffset = { x: drag.baseX + deltaX, y: drag.baseY + deltaY };

    setOffsets((prev) => ({
      ...prev,
      [drag.id]: nextOffset,
    }));
  }

  function handleMouseUp() {
    dragRef.current = null;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  }

  function startDrag(id: string, event: React.MouseEvent) {
    if (!editMode || event.button !== 0) return;

    event.preventDefault();
    event.stopPropagation();
    setZIndices((prev) => {
      const next = { ...prev };
      const segments = id.split(".");
      for (let i = 1; i <= segments.length; i += 1) {
        const chainId = segments.slice(0, i).join(".");
        const nextZ = topZRef.current + 1;
        topZRef.current = nextZ;
        next[chainId] = nextZ;
      }
      return next;
    });

    const currentOffset = offsetsRef.current[id] ?? { x: 0, y: 0 };

    dragRef.current = {
      id,
      startX: event.clientX,
      startY: event.clientY,
      baseX: currentOffset.x,
      baseY: currentOffset.y,
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }

  function injectStyles(
    node: React.ReactNode,
    path: string,
    depth: number
  ): React.ReactNode {
    if (!React.isValidElement(node)) return node;

    const element = node as React.ReactElement<any>;
    const tagName = typeof element.type === "string" ? element.type : "";
    const isDomElement = typeof element.type === "string";
    const currentOffset = offsets[path] ?? { x: 0, y: 0 };
    const currentZ = zIndices[path];
    const incomingStyle = (element.props.style ?? {}) as React.CSSProperties;
    const existingTransform = incomingStyle.transform;
    const hasOffset = currentOffset.x !== 0 || currentOffset.y !== 0;
    const translateTransform = `translate(${currentOffset.x}px, ${currentOffset.y}px)`;

    const resolvedBackground =
      transparentChildren && depth > 0 ? "transparent" : backgroundColor;

    const mergedStyle: React.CSSProperties = {
      ...incomingStyle,
      color: textColor,
      backgroundColor: resolvedBackground,
    };

    if (hasOffset) {
      mergedStyle.transform = existingTransform
        ? `${existingTransform} ${translateTransform}`
        : translateTransform;
    }

    if (currentZ !== undefined) {
      mergedStyle.zIndex = currentZ;
    }

    if (
      (editMode || currentZ !== undefined) &&
      (!mergedStyle.position || mergedStyle.position === "static")
    ) {
      mergedStyle.position = "relative";
    }

    const existingClassName = element.props.className ?? "";
    let mergedClassName = existingClassName;

    if (isDomElement && editMode) {
      mergedClassName = `${existingClassName} editable-node`.trim();
    }

    if (textAnimation && tagName) {
      const headingTags = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);
      if (headingTags.has(tagName)) {
        const rawText = React.Children.toArray(element.props.children)
          .map((child) => {
            if (typeof child === "string" || typeof child === "number") {
              return String(child);
            }
            if (React.isValidElement(child)) {
              const nested = child as React.ReactElement<{ children?: React.ReactNode }>;
              return React.Children.toArray(nested.props.children)
                .map((n) =>
                  typeof n === "string" || typeof n === "number" ? String(n) : ""
                )
                .join("");
            }
            return "";
          })
          .join("")
          .replace(/\s+/g, " ")
          .trim();

        const charCount = Math.max(4, Math.min(70, rawText.length || 24));
        const duration = Math.max(4, Math.min(14, charCount * 0.12));
        (mergedStyle as React.CSSProperties & Record<string, string | number>)[
          "--chars"
        ] = charCount;
        (mergedStyle as React.CSSProperties & Record<string, string | number>)[
          "--type-duration"
        ] = `${duration}s`;
        mergedClassName = `${mergedClassName} terminal-typed${
          headingTags.has(tagName) ? " terminal-heading" : ""
        }`.trim();
      }
    }

    const existingOnMouseDown = element.props.onMouseDown as
      | React.MouseEventHandler
      | undefined;

    const nextChildren = React.Children.map(
      element.props.children,
      (child, index) => injectStyles(child, `${path}.${index}`, depth + 1)
    );

    if (!isDomElement) {
      return React.cloneElement(element, {
        ...element.props,
        children: nextChildren,
      });
    }

    return React.cloneElement(element, {
      ...element.props,
      className: mergedClassName,
      "data-editable": editMode ? "true" : undefined,
      onMouseDown: (event: React.MouseEvent) => {
        existingOnMouseDown?.(event);
        if (!event.defaultPrevented) {
          startDrag(path, event);
        }
      },
      style: mergedStyle,
      children: nextChildren,
    });
  }

  return (
    <>
      {React.Children.map(children, (child, index) =>
        injectStyles(child, `root.${index}`, 0)
      )}
    </>
  );
}
