import { useRef, useState } from "react";

type AxisLock = "both" | "x" | "y";

type FloatingEditPanelProps = {
  onPanelOpenChange?: (open: boolean) => void;
  editMode: boolean;
  onEditModeChange: (next: boolean) => void;
  transparentChildren: boolean;
  onTransparentChildrenChange: (next: boolean) => void;
  textAnimation: boolean;
  onTextAnimationChange: (next: boolean) => void;
  dragDepth: number;
  onDragDepthChange: (next: number) => void;
  snapToGrid: boolean;
  onSnapToGridChange: (next: boolean) => void;
  gridSize: number;
  onGridSizeChange: (next: number) => void;
  axisLock: AxisLock;
  onAxisLockChange: (next: AxisLock) => void;
  onResetLayout: () => void;
  manipulatedNodes: Array<{
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
  }>;
  onReinsertNode: (id: string) => void;
  onPreviewHover?: (id: string) => void;
};

export default function FloatingEditPanel({
  onPanelOpenChange,
  editMode,
  onEditModeChange,
  transparentChildren,
  onTransparentChildrenChange,
  textAnimation,
  onTextAnimationChange,
  dragDepth,
  onDragDepthChange,
  snapToGrid,
  onSnapToGridChange,
  gridSize,
  onGridSizeChange,
  axisLock,
  onAxisLockChange,
  onResetLayout,
  manipulatedNodes,
  onReinsertNode,
  onPreviewHover,
}: FloatingEditPanelProps) {
  const [open, setOpen] = useState(false);
  const [panelOffset, setPanelOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{
    startX: number;
    startY: number;
    baseX: number;
    baseY: number;
  } | null>(null);

  function startPanelDrag(event: React.MouseEvent) {
    if (event.button !== 0) return;
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      baseX: panelOffset.x,
      baseY: panelOffset.y,
    };
    const onMove = (moveEvent: MouseEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const nextX = drag.baseX + (moveEvent.clientX - drag.startX);
      const nextY = drag.baseY + (moveEvent.clientY - drag.startY);
      setPanelOffset({ x: nextX, y: nextY });
    };
    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  function getPreviewDisplaySize(width?: number, height?: number): { width: number; height: number } {
    const sourceWidth = width && width > 0 ? width : 220;
    const sourceHeight = height && height > 0 ? height : 140;
    const maxWidth = 280;
    const maxHeight = 180;
    const scale = Math.min(maxWidth / sourceWidth, maxHeight / sourceHeight, 1);
    return {
      width: Math.max(1, Math.round(sourceWidth * scale)),
      height: Math.max(1, Math.round(sourceHeight * scale)),
    };
  }

  return (
    <aside
      className="floating-edit-panel"
      style={{ transform: `translate(${panelOffset.x}px, ${panelOffset.y}px)` }}
    >
      <button
        type="button"
        className={`floating-edit-fab ${open ? "on" : "off"}`}
        onClick={() =>
          setOpen((prev) => {
            const next = !prev;
            onPanelOpenChange?.(next);
            return next;
          })
        }
        aria-expanded={open}
        aria-controls="floating-edit-tools"
      >
        {open ? "Close Edit Tools" : "Edit Tools"}
      </button>

      {open ? (
        <div id="floating-edit-tools" className="floating-edit-content card">
          <div
            className="floating-edit-drag-handle"
            onMouseDown={startPanelDrag}
            role="button"
            tabIndex={0}
            aria-label="Drag edit panel"
          >
            <h3>Edit Mode Tools</h3>
          </div>

          <label className="option-toggle option-toggle-inline">
            <input
              type="checkbox"
              checked={editMode}
              onChange={(event) => onEditModeChange(event.target.checked)}
            />
            Enable drag mode
          </label>

          <label className="option-toggle">
            Drag stack depth: {dragDepth}
            <input
              type="range"
              min={0}
              max={12}
              value={dragDepth}
              onChange={(event) => onDragDepthChange(Number(event.target.value))}
            />
          </label>

          <label className="option-toggle option-toggle-inline">
            <input
              type="checkbox"
              checked={snapToGrid}
              onChange={(event) => onSnapToGridChange(event.target.checked)}
            />
            Snap to grid
          </label>

          <label className="option-toggle">
            Grid size
            <input
              type="number"
              min={2}
              max={64}
              value={gridSize}
              disabled={!snapToGrid}
              onChange={(event) =>
                onGridSizeChange(Math.max(2, Math.min(64, Number(event.target.value) || 8)))
              }
            />
          </label>

          <label className="option-toggle">
            Axis lock
            <select
              value={axisLock}
              onChange={(event) => onAxisLockChange(event.target.value as AxisLock)}
            >
              <option value="both">Both axes</option>
              <option value="x">X only</option>
              <option value="y">Y only</option>
            </select>
          </label>

          <label className="option-toggle option-toggle-inline">
            <input
              type="checkbox"
              checked={transparentChildren}
              onChange={(event) => onTransparentChildrenChange(event.target.checked)}
            />
            Transparent nested backgrounds
          </label>

          <label className="option-toggle option-toggle-inline">
            <input
              type="checkbox"
              checked={textAnimation}
              onChange={(event) => onTextAnimationChange(event.target.checked)}
            />
            Terminal typing animation
          </label>

          <button type="button" className="panel-action-btn" onClick={onResetLayout}>
            Reset dragged layout
          </button>

          <section className="manipulated-list-section">
            <h4>Manipulated elements</h4>
            {manipulatedNodes.length === 0 ? (
              <p className="manipulated-empty">No hidden/removed elements.</p>
            ) : (
              <ul className="manipulated-list">
                {manipulatedNodes.map((item) => (
                  <li key={item.id} className="manipulated-item">
                    {(() => {
                      const previewSize = getPreviewDisplaySize(item.preview.width, item.preview.height);
                      return (
                        <>
                    <div className="manipulated-item-meta">
                      <h5 className="manipulated-item-title">{item.label}</h5>
                      <p className="manipulated-item-state">
                        {item.state === "removed" ? "Removed" : "Hidden"}
                      </p>
                    </div>
                    <div
                      className="manipulated-hover-zone"
                      onMouseEnter={() => onPreviewHover?.(item.id)}
                    >
                      <div className="manipulated-preview">
                        {item.preview.text &&
                        item.preview.text.trim().toLowerCase() !== item.label.trim().toLowerCase() ? (
                          <span className="manipulated-preview-text">{item.preview.text}</span>
                        ) : null}
                        {item.preview.imageSrc ? (
                          <span
                            className="manipulated-preview-popover"
                            style={{
                              backgroundColor: item.preview.backgroundColor ?? "transparent",
                              width: `${previewSize.width}px`,
                              height: `${previewSize.height}px`,
                            }}
                          >
                            <img
                              src={item.preview.imageSrc}
                              alt={`${item.preview.text} enlarged`}
                              style={{
                                backgroundColor: item.preview.backgroundColor ?? "transparent",
                              }}
                            />
                          </span>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        className="panel-action-btn"
                        onClick={() => onReinsertNode(item.id)}
                      >
                        Reinsert
                      </button>
                    </div>
                        </>
                      );
                    })()}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      ) : null}
    </aside>
  );
}
