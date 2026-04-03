import React, { useEffect, useRef, useState } from "react";

type EditableDragLayerProps = {
  enabled?: boolean;
  maxDepth?: number;
  snapToGrid?: boolean;
  gridSize?: number;
  axisLock?: "both" | "x" | "y";
  resetSignal?: number;
  restoreSignal?: number;
  restoreTargetId?: string | null;
  onManipulatedNodesChange?: (
    items: Array<{
      id: string;
      state: "hidden" | "removed";
      label: string;
      preview: {
        tag: string;
        text: string;
        imageSrc?: string;
        backgroundColor?: string;
        width?: number;
        height?: number;
        sourceTop?: number;
      };
    }>
  ) => void;
  children: React.ReactNode;
};

type Offset = { x: number; y: number };
type OffsetMap = Record<string, Offset>;
type ZIndexMap = Record<string, number>;
type FlagMap = Record<string, boolean>;
type PreviewImageMap = Record<string, string>;
type PreviewBackgroundMap = Record<string, string>;
type PreviewSizeMap = Record<string, { width: number; height: number }>;
type PreviewTopMap = Record<string, number>;
type PreviewBounds = { width: number; height: number };
type DragState = {
  id: string;
  startX: number;
  startY: number;
  baseX: number;
  baseY: number;
};

export default function EditableDragLayer({
  enabled = false,
  maxDepth = 12,
  snapToGrid = false,
  gridSize = 8,
  axisLock = "both",
  resetSignal = 0,
  restoreSignal = 0,
  restoreTargetId = null,
  onManipulatedNodesChange,
  children,
}: EditableDragLayerProps) {
  const [offsets, setOffsets] = useState<OffsetMap>({});
  const [zIndices, setZIndices] = useState<ZIndexMap>({});
  const [hiddenNodes, setHiddenNodes] = useState<FlagMap>({});
  const [removedNodes, setRemovedNodes] = useState<FlagMap>({});
  const [previewImages, setPreviewImages] = useState<PreviewImageMap>({});
  const [previewBackgrounds, setPreviewBackgrounds] = useState<PreviewBackgroundMap>({});
  const [previewSizes, setPreviewSizes] = useState<PreviewSizeMap>({});
  const [previewTops, setPreviewTops] = useState<PreviewTopMap>({});
  const offsetsRef = useRef<OffsetMap>(offsets);
  const topZRef = useRef(1);
  const dragRef = useRef<DragState | null>(null);
  const nodeLabelMapRef = useRef<Record<string, string>>({});
  const nodePreviewMapRef = useRef<Record<string, { tag: string; text: string; imageSrc?: string }>>({});

  useEffect(() => {
    offsetsRef.current = offsets;
  }, [offsets]);

  useEffect(() => {
    setOffsets({});
    setZIndices({});
    setHiddenNodes({});
    setRemovedNodes({});
    setPreviewImages({});
    setPreviewBackgrounds({});
    setPreviewSizes({});
    setPreviewTops({});
    offsetsRef.current = {};
    topZRef.current = 1;
    dragRef.current = null;
  }, [resetSignal]);

  useEffect(() => {
    if (!restoreSignal || !restoreTargetId) return;
    setHiddenNodes((prev) => {
      if (!prev[restoreTargetId]) return prev;
      const next = { ...prev };
      delete next[restoreTargetId];
      return next;
    });
    setRemovedNodes((prev) => {
      if (!prev[restoreTargetId]) return prev;
      const next = { ...prev };
      delete next[restoreTargetId];
      return next;
    });
    setPreviewImages((prev) => {
      if (!prev[restoreTargetId]) return prev;
      const next = { ...prev };
      delete next[restoreTargetId];
      return next;
    });
    setPreviewBackgrounds((prev) => {
      if (!prev[restoreTargetId]) return prev;
      const next = { ...prev };
      delete next[restoreTargetId];
      return next;
    });
    setPreviewSizes((prev) => {
      if (!prev[restoreTargetId]) return prev;
      const next = { ...prev };
      delete next[restoreTargetId];
      return next;
    });
    setPreviewTops((prev) => {
      if (prev[restoreTargetId] === undefined) return prev;
      const next = { ...prev };
      delete next[restoreTargetId];
      return next;
    });
  }, [restoreSignal, restoreTargetId]);

  useEffect(() => {
    if (!onManipulatedNodesChange) return;
    const ids = new Set([...Object.keys(hiddenNodes), ...Object.keys(removedNodes)]);
    const items = Array.from(ids).map((id) => ({
      id,
      state: removedNodes[id] ? ("removed" as const) : ("hidden" as const),
      label: nodeLabelMapRef.current[id] ?? id,
      preview: {
        ...(nodePreviewMapRef.current[id] ?? { tag: "node", text: "" }),
        imageSrc:
          previewImages[id] ??
          nodePreviewMapRef.current[id]?.imageSrc ??
          undefined,
        backgroundColor: previewBackgrounds[id] ?? undefined,
        width: previewSizes[id]?.width,
        height: previewSizes[id]?.height,
        sourceTop: previewTops[id],
      },
    }));
    items.sort((a, b) => a.label.localeCompare(b.label));
    onManipulatedNodesChange(items);
  }, [hiddenNodes, removedNodes, previewImages, previewBackgrounds, previewSizes, previewTops, onManipulatedNodesChange]);

  function extractVisibleText(node: React.ReactNode): string {
    if (typeof node === "string" || typeof node === "number") {
      return String(node).replace(/\s+/g, " ").trim();
    }
    if (!React.isValidElement(node)) return "";
    const children = React.Children.toArray((node as React.ReactElement<any>).props.children);
    for (const child of children) {
      const text = extractVisibleText(child);
      if (text) return text;
    }
    return "";
  }

  function buildNodeLabel(element: React.ReactElement<any>): string {
    const tag =
      typeof element.type === "string"
        ? element.type
        : (element.type as any)?.displayName || (element.type as any)?.name || "component";
    const tagLabel = String(tag).toLowerCase();

    let sub = "";
    if (tagLabel === "img") {
      sub = (element.props.alt ?? element.props.src ?? "").toString().trim();
    } else if (tagLabel === "input") {
      sub = (element.props.placeholder ?? element.props.type ?? "").toString().trim();
    } else {
      sub = extractVisibleText(element.props.children);
    }

    if (sub.length > 34) sub = `${sub.slice(0, 34)}...`;
    return sub || tagLabel;
  }

  function buildNodePreview(element: React.ReactElement<any>): {
    tag: string;
    text: string;
    imageSrc?: string;
  } {
    const tag =
      typeof element.type === "string"
        ? String(element.type).toLowerCase()
        : "component";

    if (tag === "img") {
      const src = String(element.props.src ?? "");
      const alt = String(element.props.alt ?? "").trim();
      return { tag, text: alt || src || "image", imageSrc: src || undefined };
    }

    if (tag === "input") {
      const text = String(
        element.props.placeholder ?? element.props.value ?? element.props.type ?? "input"
      ).trim();
      return { tag, text };
    }

    const text = extractVisibleText(element.props.children).trim();
    return { tag, text: text || tag };
  }

  useEffect(() => {
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  function handleMouseMove(event: MouseEvent) {
    const drag = dragRef.current;
    if (!drag) return;

    const rawDeltaX = event.clientX - drag.startX;
    const rawDeltaY = event.clientY - drag.startY;
    const deltaX = axisLock === "y" ? 0 : rawDeltaX;
    const deltaY = axisLock === "x" ? 0 : rawDeltaY;

    let nextOffset = { x: drag.baseX + deltaX, y: drag.baseY + deltaY };
    if (snapToGrid) {
      nextOffset = {
        x: Math.round(nextOffset.x / gridSize) * gridSize,
        y: Math.round(nextOffset.y / gridSize) * gridSize,
      };
    }

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
    if (!enabled || event.button !== 0) return;

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

  function getPreviewBounds(target: HTMLElement): PreviewBounds {
    const rect = target.getBoundingClientRect();
    const width = Math.max(1, Math.ceil(Math.max(rect.width, target.scrollWidth, target.clientWidth)));
    const height = Math.max(1, Math.ceil(Math.max(rect.height, target.scrollHeight, target.clientHeight)));
    return { width, height };
  }

  async function captureElementPreview(target: HTMLElement, bounds: PreviewBounds): Promise<string | null> {
    const { width, height } = bounds;
    document.body.classList.add("preview-capture-mode");
    try {
      try {
        const { default: domToImage } = await import("dom-to-image-more");
        const dataUrl = await domToImage.toPng(target, {
          bgcolor: "transparent",
          quality: 1,
          width,
          height,
          style: {
            width: `${width}px`,
            height: `${height}px`,
            transform: "none",
          },
        });
        if (dataUrl.startsWith("data:image/")) return dataUrl;
      } catch {
        // Fall through to alternate DOM capture.
      }

      try {
        const { default: html2canvas } = await import("html2canvas");
        const canvas = await html2canvas(target, {
          backgroundColor: null,
          scale: 1,
          width,
          height,
          windowWidth: Math.max(document.documentElement.clientWidth, width),
          windowHeight: Math.max(document.documentElement.clientHeight, height),
          useCORS: true,
          logging: false,
        });
        const dataUrl = canvas.toDataURL("image/png");
        return dataUrl.startsWith("data:image/") ? dataUrl : null;
      } catch {
        return null;
      }
    } finally {
      document.body.classList.remove("preview-capture-mode");
    }
  }

  function isTransparentColor(color: string): boolean {
    const normalized = color.trim().toLowerCase();
    if (!normalized || normalized === "transparent") return true;
    if (normalized.startsWith("rgba(")) {
      const values = normalized
        .replace("rgba(", "")
        .replace(")", "")
        .split(",")
        .map((part) => part.trim());
      const alpha = Number(values[3] ?? "1");
      return Number.isFinite(alpha) && alpha <= 0;
    }
    return false;
  }

  function resolvePreviewBackground(target: HTMLElement): string {
    let node: HTMLElement | null = target;
    while (node) {
      const bg = window.getComputedStyle(node).backgroundColor;
      if (!isTransparentColor(bg)) return bg;
      node = node.parentElement;
    }
    const bodyBg = window.getComputedStyle(document.body).backgroundColor;
    return isTransparentColor(bodyBg) ? "#000000" : bodyBg;
  }

  function handleNodeControlClick(path: string, event: React.MouseEvent<HTMLElement>) {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const previewBounds = getPreviewBounds(target);
    const previewBackground = resolvePreviewBackground(target);
    setPreviewBackgrounds((prev) => ({ ...prev, [path]: previewBackground }));
    setPreviewSizes((prev) => ({ ...prev, [path]: previewBounds }));
    setPreviewTops((prev) => ({ ...prev, [path]: window.scrollY + rect.top }));
    const localX = event.clientX - rect.left;
    const localY = event.clientY - rect.top;

    const iconSize = 16;
    const iconGap = 4;
    const iconTop = 2;
    const iconRightPadding = 2;
    const removeLeft = rect.width - iconRightPadding - iconSize;
    const hideLeft = removeLeft - iconGap - iconSize;
    const verticalMatch = localY >= iconTop && localY <= iconTop + iconSize;

    if (!verticalMatch) return false;
    if (localX >= removeLeft && localX <= removeLeft + iconSize) {
      let didApply = false;
      const applyRemove = () => {
        if (didApply) return;
        didApply = true;
        setRemovedNodes((prev) => ({ ...prev, [path]: true }));
        setHiddenNodes((prev) => {
          if (!prev[path]) return prev;
          const next = { ...prev };
          delete next[path];
          return next;
        });
      };
      const forcedApplyTimeout = window.setTimeout(() => {
        applyRemove();
      }, 260);
      captureElementPreview(target, previewBounds)
        .then((dataUrl) => {
          if (!dataUrl) return;
          setPreviewImages((prev) => ({ ...prev, [path]: dataUrl }));
        })
        .finally(() => {
          window.clearTimeout(forcedApplyTimeout);
          applyRemove();
        });
      return true;
    }
    if (localX >= hideLeft && localX <= hideLeft + iconSize) {
      let didApply = false;
      const applyHide = () => {
        if (didApply) return;
        didApply = true;
        setHiddenNodes((prev) => ({ ...prev, [path]: true }));
        setRemovedNodes((prev) => {
          if (!prev[path]) return prev;
          const next = { ...prev };
          delete next[path];
          return next;
        });
      };
      const forcedApplyTimeout = window.setTimeout(() => {
        applyHide();
      }, 260);
      captureElementPreview(target, previewBounds)
        .then((dataUrl) => {
          if (!dataUrl) return;
          setPreviewImages((prev) => ({ ...prev, [path]: dataUrl }));
        })
        .finally(() => {
          window.clearTimeout(forcedApplyTimeout);
          applyHide();
        });
      return true;
    }

    return false;
  }

  function injectEditableBehavior(
    node: React.ReactNode,
    path: string,
    depth: number
  ): React.ReactNode {
    if (!React.isValidElement(node)) return node;

    const element = node as React.ReactElement<any>;
    const isDomElement = typeof element.type === "string";
    const existingClassName = element.props.className ?? "";
    if (isDomElement) {
      nodeLabelMapRef.current[path] = buildNodeLabel(element);
      nodePreviewMapRef.current[path] = buildNodePreview(element);
    }

    const isMuiSwitchInternal =
      typeof existingClassName === "string" &&
      (existingClassName.includes("MuiSwitch") ||
        existingClassName.includes("PrivateSwitchBase") ||
        existingClassName.includes("MuiTouchRipple-root"));

    const isTransformSensitive =
      typeof existingClassName === "string" &&
      (existingClassName.includes("MuiSwitch-switchBase") ||
        existingClassName.includes("MuiSwitch-thumb") ||
        existingClassName.includes("MuiTouchRipple-root") ||
        existingClassName.includes("PrivateSwitchBase-input"));

    const currentOffset = offsets[path] ?? { x: 0, y: 0 };
    const currentZ = zIndices[path];
    const isHidden = hiddenNodes[path] === true;
    const isRemoved = removedNodes[path] === true;
    const incomingStyle = (element.props.style ?? {}) as React.CSSProperties;
    const existingTransform = incomingStyle.transform;
    const hasOffset = currentOffset.x !== 0 || currentOffset.y !== 0;
    const translateTransform = `translate(${currentOffset.x}px, ${currentOffset.y}px)`;

    const mergedStyle: React.CSSProperties = { ...incomingStyle };

    if (hasOffset && !isTransformSensitive) {
      mergedStyle.transform = existingTransform
        ? `${existingTransform} ${translateTransform}`
        : translateTransform;
    }

    if (currentZ !== undefined) {
      mergedStyle.zIndex = currentZ;
    }

    if ((enabled || currentZ !== undefined) && (!mergedStyle.position || mergedStyle.position === "static")) {
      mergedStyle.position = "relative";
    }

    // While editing / stacking, avoid parent clipping so dragged nodes can escape their parent.
    if ((enabled || currentZ !== undefined) && mergedStyle.overflow === undefined) {
      mergedStyle.overflow = "visible";
    }

    // Hidden mode is styled via CSS (keeps outline + controls visible).
    // We intentionally avoid visibility:hidden here so the user can still see and manage the node shell.

    if (isRemoved) {
      mergedStyle.width = 0;
      mergedStyle.height = 0;
      mergedStyle.minWidth = 0;
      mergedStyle.minHeight = 0;
      mergedStyle.maxWidth = 0;
      mergedStyle.maxHeight = 0;
      mergedStyle.padding = 0;
      mergedStyle.margin = 0;
      mergedStyle.border = 0;
      mergedStyle.overflow = "hidden";
      mergedStyle.opacity = 0;
      mergedStyle.pointerEvents = "none";
      mergedStyle.fontSize = 0;
      mergedStyle.lineHeight = 0;
      mergedStyle.flexBasis = 0;
      mergedStyle.visibility = "hidden";
    }

    const canDragAtDepth = enabled && depth <= maxDepth;
    let mergedClassName = existingClassName;
    if (isDomElement && canDragAtDepth && !isMuiSwitchInternal) {
      mergedClassName = `${existingClassName} editable-node`.trim();
    }

    const existingOnMouseDown = element.props.onMouseDown as
      | React.MouseEventHandler
      | undefined;

    const nextChildren = React.Children.map(
      element.props.children,
      (child, index) => injectEditableBehavior(child, `${path}.${index}`, depth + 1)
    );

    if (!isDomElement) {
      return React.cloneElement(element, {
        ...element.props,
        children: nextChildren,
      });
    }

    const domProps: Record<string, unknown> = {
      ...element.props,
      className: mergedClassName,
      "data-node-id": path,
      "data-editable": canDragAtDepth && !isMuiSwitchInternal ? "true" : undefined,
      "data-node-hidden": isHidden ? "true" : undefined,
      "data-node-removed": isRemoved ? "true" : undefined,
      style: mergedStyle,
      children: nextChildren,
    };

    if (canDragAtDepth && !isTransformSensitive && !isMuiSwitchInternal && !isRemoved) {
      domProps.onMouseDown = (event: React.MouseEvent) => {
        existingOnMouseDown?.(event);
        if (event.defaultPrevented) return;
        if (handleNodeControlClick(path, event as React.MouseEvent<HTMLElement>)) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        if (!event.defaultPrevented) {
          startDrag(path, event);
        }
      };
      domProps.draggable = false;
      domProps.onDragStart = (event: React.DragEvent) => {
        event.preventDefault();
      };
    }

    return React.cloneElement(element, domProps);
  }

  return (
    <>
      {React.Children.map(children, (child, index) =>
        injectEditableBehavior(child, `root.${index}`, 0)
      )}
    </>
  );
}
