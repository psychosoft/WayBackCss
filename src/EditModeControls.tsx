type EditModeControlsProps = {
  editMode: boolean;
  onEditModeChange: (next: boolean) => void;
  transparentChildren: boolean;
  onTransparentChildrenChange: (next: boolean) => void;
  textAnimation: boolean;
  onTextAnimationChange: (next: boolean) => void;
};

export default function EditModeControls({
  editMode,
  onEditModeChange,
  transparentChildren,
  onTransparentChildrenChange,
  textAnimation,
  onTextAnimationChange,
}: EditModeControlsProps) {
  return (
    <>
      <button
        type="button"
        className={`edit-toggle ${editMode ? "on" : "off"}`}
        onClick={() => onEditModeChange(!editMode)}
      >
        {editMode ? "Disable edit mode" : "Enable edit mode"}
      </button>

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
    </>
  );
}

