import React from "react";
import "../../styles/ConfirmationDialog.css";

/**
 * ConfirmationDialog Component
 * A modal dialog for confirming destructive actions (e.g., deleting data).
 *
 * @param {boolean} isOpen - Whether the dialog is visible
 * @param {function} onClose - Called when the dialog is closed (cancel)
 * @param {function} onConfirm - Called when the user confirms the action
 * @param {string} title - Dialog title
 * @param {string} message - Dialog message/body
 * @param {string} confirmText - Text for the confirm button
 * @param {string} cancelText - Text for the cancel button
 */
const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Xác nhận",
  message = "Bạn có chắc chắn muốn thực hiện hành động này?",
  confirmText = "Xác nhận",
  cancelText = "Hủy",
}) => {
  if (!isOpen) return null;

  return (
    <div className="confirmation-overlay" role="dialog" aria-modal="true">
      <div className="confirmation-dialog">
        <div className="confirmation-dialog__icon" aria-hidden="true">
          ⚠️
        </div>
        <h2 className="confirmation-dialog__title">{title}</h2>
        <p className="confirmation-dialog__message">{message}</p>

        <div className="confirmation-dialog__buttons">
          <button
            className="confirmation-dialog__btn confirmation-dialog__btn--cancel"
            onClick={onClose}
            autoFocus
          >
            {cancelText}
          </button>
          <button
            className="confirmation-dialog__btn confirmation-dialog__btn--confirm"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
