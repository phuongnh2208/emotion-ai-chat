import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useSession } from "../../contexts/SessionContext";
import { deleteChatHistory } from "../../services/chatService";
import ConfirmationDialog from "./ConfirmationDialog";
import "../../styles/UserMenu.css";

/**
 * UserMenu Component
 * Displays user information, logout button, and a "Delete History" button
 * with a confirmation dialog for data deletion (privacy feature).
 */
export default function UserMenu() {
  const { user, logout } = useAuth();
  const { sessionId, resetSession } = useSession();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!user) return null;

  const name = user.username || user.email || "Bạn nhỏ";
  const initials = name.slice(0, 2).toUpperCase();

  /**
   * Handle deleting all chat history
   * Calls the API to delete the user's session data
   */
  const handleDeleteHistory = async () => {
    setIsDeleting(true);
    try {
      if (sessionId) {
        await deleteChatHistory(sessionId);
      }
      // Reset the anonymous session on the frontend
      resetSession();
    } catch (err) {
      console.error("Delete history error:", err);
    } finally {
      setIsDeleting(false);
      setShowConfirmDialog(false);
    }
  };

  return (
    <>
      <div className="user-menu">
        <div className="user-menu__top">
          <div className="user-menu__avatar">
            <span>{initials}</span>
          </div>
          <div className="user-menu__text">
            <span className="user-menu__label">Đã đăng nhập</span>
            <span className="user-menu__name">{name}</span>
          </div>
        </div>

        <button
          type="button"
          className="user-menu__delete"
          onClick={() => setShowConfirmDialog(true)}
          disabled={isDeleting}
          aria-label="Xóa lịch sử trò chuyện"
        >
          {isDeleting ? "Đang xóa..." : "🗑️ Xóa lịch sử"}
        </button>

        <button type="button" className="user-menu__logout" onClick={logout}>
          Đăng xuất
        </button>
      </div>

      {/* Confirmation Dialog for data deletion */}
      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleDeleteHistory}
        title="Xóa lịch sử trò chuyện?"
        message="Hành động này không thể hoàn tác. Tất cả tin nhắn và lịch sử trò chuyện của bạn sẽ bị xóa vĩnh viễn."
        confirmText="Xóa ngay"
        cancelText="Hủy"
      />
    </>
  );
}
