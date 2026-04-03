import React from "react";

type StyleInjectorProps = {
  textColor?: string;
  backgroundColor?: string;
  transparentChildren?: boolean;
  textAnimation?: boolean;
  children: React.ReactNode;
};

export default function StyleInjector({
  textColor = "#101828",
  backgroundColor = "#e4e7ec",
  transparentChildren = false,
  textAnimation = false,
  children,
}: StyleInjectorProps) {
  function injectStyles(
    node: React.ReactNode,
    path: string,
    depth: number
  ): React.ReactNode {
    if (!React.isValidElement(node)) return node;

    const element = node as React.ReactElement<any>;
    const tagName = typeof element.type === "string" ? element.type : "";
    const isDomElement = typeof element.type === "string";
    const incomingStyle = (element.props.style ?? {}) as React.CSSProperties;

    const resolvedBackground =
      transparentChildren && depth > 0 ? "transparent" : backgroundColor;

    const mergedStyle: React.CSSProperties = {
      ...incomingStyle,
      color: textColor,
      backgroundColor: resolvedBackground,
    };

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
        const existingClassName = element.props.className ?? "";
        const mergedClassName = `${existingClassName} terminal-typed${
          headingTags.has(tagName) ? " terminal-heading" : ""
        }`.trim();
        const nextChildren = React.Children.map(
          element.props.children,
          (child, index) => injectStyles(child, `${path}.${index}`, depth + 1)
        );

        return React.cloneElement(element, {
          ...element.props,
          className: mergedClassName,
          style: mergedStyle,
          children: nextChildren,
        });
      }
    }

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

    const domProps: Record<string, unknown> = {
      ...element.props,
      style: mergedStyle,
      children: nextChildren,
    };

    return React.cloneElement(element, domProps);
  }

  return (
    <>
      {React.Children.map(children, (child, index) =>
        injectStyles(child, `root.${index}`, 0)
      )}
    </>
  );
}
