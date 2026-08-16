import "./ConfirmModal.css";

/**
 * ConfirmModal
 *
 * Props:
 * - show: boolean
 * - title?: string
 * - message: string
 * - confirmLabel?: string   default "Confirm"
 * - cancelLabel?: string    default "Cancel"
 * - onConfirm: () => void
 * - onCancel: () => void
 */
function ConfirmModal({
  show,
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}) {
  if (!show) return null;

  return (
    <div className="confirm-modal-overlay" onClick={onCancel}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="confirm-modal-title">{title}</h3>
        <p className="confirm-modal-message">{message}</p>

        <div className="confirm-modal-actions">
          <button className="confirm-modal-cancel" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button className="confirm-modal-confirm" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;