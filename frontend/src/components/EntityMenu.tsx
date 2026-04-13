import { Icon } from "@/components/Icon";
import { useEffect, useRef, useState } from "react";

type EntityMenuProps = {
  onEdit: () => void;
  onDelete: () => void;
  label: string;
};

export function EntityMenu({ onEdit, onDelete, label }: EntityMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDocumentClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocumentClick);
    return () => document.removeEventListener("mousedown", onDocumentClick);
  }, [open]);

  return (
    <div className="entity-menu" ref={rootRef}>
      <button
        type="button"
        className="btn btn-ghost btn-icon"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Menu ${label}`}
        onClick={() => setOpen((value) => !value)}
      >
        <Icon name="more" className="icon" />
      </button>

      {open && (
        <div className="entity-menu__dropdown" role="menu">
          <button
            type="button"
            className="entity-menu__item"
            role="menuitem"
            onClick={() => {
              onEdit();
              setOpen(false);
            }}
          >
            <Icon name="edit" className="icon" />
            <span>Modifier</span>
          </button>
          <button
            type="button"
            className="entity-menu__item entity-menu__item--danger"
            role="menuitem"
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
          >
            <Icon name="trash" className="icon" />
            <span>Supprimer</span>
          </button>
        </div>
      )}
    </div>
  );
}
