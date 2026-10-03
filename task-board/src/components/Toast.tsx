import React, { useEffect, useRef, useState } from 'react';

interface ToastProps {
  message: string;
  canUndo: boolean;
  onUndo: () => void;
  onDismiss?: () => void;
  /** Auto-dismiss delay in ms. Defaults to 4s, or 7s when Undo is offered. */
  duration?: number;
}

const DEFAULT_DURATION = 4000;
const UNDO_DURATION = 7000;

/**
 * Toast Component
 * Bottom notification displaying clear, friendly human feedback with an immediate Undo button.
 * Auto-dismisses after `duration`; the countdown pauses while the toast is hovered or focused
 * so the Undo button never disappears under the user's pointer or keyboard focus.
 */
export function Toast({ message, canUndo, onUndo, onDismiss, duration }: ToastProps) {
  const [isPaused, setIsPaused] = useState(false);
  const totalDuration = duration ?? (canUndo ? UNDO_DURATION : DEFAULT_DURATION);
  const remainingRef = useRef(totalDuration);

  // Always call the latest onDismiss without restarting the timer when the parent re-renders
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  useEffect(() => {
    if (isPaused || !onDismissRef.current) return;
    const startedAt = Date.now();
    const timer = window.setTimeout(() => onDismissRef.current?.(), remainingRef.current);
    return () => {
      window.clearTimeout(timer);
      remainingRef.current = Math.max(0, remainingRef.current - (Date.now() - startedAt));
    };
  }, [isPaused]);

  if (!message) return null;

  const handleBlur = (e: React.FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsPaused(false);
  };

  return (
    <aside
      className="bottom-toast"
      role="status"
      aria-live="polite"
      aria-label="Action feedback"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={handleBlur}
    >
      <div className="toast-content">
        <span className="toast-dot" aria-hidden="true"></span>
        <span className="toast-message">{message}</span>
      </div>

      <div className="toast-actions">
        {canUndo && (
          <button
            type="button"
            className="toast-undo-btn"
            onClick={onUndo}
            title="Undo this action"
            aria-label="Undo last action"
          >
            Undo
          </button>
        )}

        {onDismiss && (
          <button
            type="button"
            className="toast-close-btn"
            onClick={onDismiss}
            title="Dismiss notification"
            aria-label="Dismiss feedback"
          >
            ×
          </button>
        )}
      </div>
    </aside>
  );
}

export default Toast;
