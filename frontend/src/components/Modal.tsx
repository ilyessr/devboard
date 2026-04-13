import { useEffect } from "react";
import type { ReactNode } from "react";
import { Icon } from "./Icon";

type ModalProps = {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function Modal({ isOpen, title, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal__header">
          <h2>{title}</h2>
          <button
            type="button"
            className="btn btn-ghost btn-icon modal__close-btn"
            onClick={onClose}
            aria-label="Fermer"
          >
            <Icon name="close" className="icon modal__close-icon" />
          </button>
        </div>
        <div className="modal__content">{children}</div>
      </div>
    </div>
  );
}
