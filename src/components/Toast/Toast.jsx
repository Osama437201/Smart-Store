import { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";
import "./Toast.css";

/**
 * Toast
 *
 * Props:
 * - show: boolean
 * - message: string
 * - actionLabel?: string        e.g. "View Cart"
 * - onAction?: () => void
 * - onClose: () => void
 * - duration?: number           ms before auto-dismiss (default 3500)
 */
function Toast({ show, message, actionLabel, onAction, onClose, duration = 3500 }) {
  useEffect(() => {
    if (!show) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [show, duration, onClose]);

  if (!show) return null;

  return (
    <div className="toast-wrapper" role="status">
      <div className="toast">
        <CheckCircle2 size={18} className="toast-icon" />

        <span className="toast-message">{message}</span>

        {actionLabel && (
          <button className="toast-action" onClick={onAction}>
            {actionLabel}
          </button>
        )}

        <button className="toast-close" onClick={onClose} aria-label="Dismiss">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

export default Toast;