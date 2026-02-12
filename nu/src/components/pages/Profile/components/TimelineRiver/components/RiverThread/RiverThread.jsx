/**
 * RiverThread - Displays replies/comments for a post
 * 
 * Features:
 * - "View X replies" collapsed state
 * - Expandable reply list (shows 3, then "show more")
 * - Edit/delete for reply owner
 * - Inline edit form with expand to modal option
 * - Post-type colored author names
 * 
 * 🔗 CONNECTION: Used by TimelineRiver.jsx for thread display
 */
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { UserIcon, EditIcon, TrashIcon, CheckIcon, CloseIcon, MaximizeIcon } from '@assets/icons';

const RiverThread = ({
  post,
  postType = 'thoughts',
  isExpanded,
  replies = [],
  isLoading,
  showAllReplies,
  currentUserId,
  editingReplyId,
  editingReplyContent,
  formatRelativeTime,
  onToggleThread,
  onShowMore,
  onEditStart,
  onEditChange,
  onEditSave,
  onEditCancel,
  onDelete,
}) => {
  // Color based on post type
  const authorColorClass = `reply-author--${postType}`;
  
  // State for expanded edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingReply, setEditingReply] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!post) return null;

  const replyCount = post.reply_count || 0;

  // Handle expand to modal
  const handleExpandEdit = (reply) => {
    setEditingReply(reply);
    setIsEditModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingReply(null);
    onEditCancel?.();
  };

  // Handle save from modal
  const handleModalSave = async () => {
    if (!editingReplyContent?.trim() || !editingReply) return;
    setIsSaving(true);
    await onEditSave?.(editingReply.id, post.id);
    setIsSaving(false);
    setIsEditModalOpen(false);
    setEditingReply(null);
  };

  // === COLLAPSED STATE: "View X replies" button ===
  if (!isExpanded && replyCount > 0) {
    return (
      <button className="view-thread-btn" onClick={() => onToggleThread?.(post.id)}>
        <span className="thread-line" />
        View {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
      </button>
    );
  }

  // === EXPANDED STATE: Show replies ===
  if (!isExpanded) return null;

  const visibleReplies = showAllReplies ? replies : replies.slice(0, 3);
  const hasMore = replies.length > 3 && !showAllReplies;

  return (
    <div className="thread-view">
      <button className="collapse-thread-btn" onClick={() => onToggleThread?.(post.id)}>
        Hide replies
      </button>

      {isLoading ? (
        <div className="thread-loading">Loading replies...</div>
      ) : (
        <div className="thread-replies">
          {visibleReplies.map((reply) => (
            <div key={reply.id} className="thread-reply">
              <div className="thread-connector">
                <div className="thread-line-vertical" />
              </div>
              <div className="reply-card">
                <div className="reply-header">
                  <div className="reply-avatar">
                    {reply.author?.profile_picture ? (
                      <img 
                        src={reply.author.profile_picture} 
                        alt={reply.author?.username || 'User'} 
                      />
                    ) : (
                      <UserIcon size={14} />
                    )}
                  </div>
                  <span className={`reply-author ${authorColorClass}`}>{reply.author?.username || 'User'}</span>
                  <span className="reply-time">{formatRelativeTime?.(reply.created_at)}</span>

                  {/* Edit/Delete for reply owner */}
                  {currentUserId && reply.author?.id === currentUserId && (
                    <div className="reply-actions">
                      <button
                        className="reply-action-btn"
                        title="Edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditStart?.(reply.id, reply.content, post.id);
                        }}
                      >
                        <EditIcon size={14} />
                      </button>
                      <button
                        className="reply-action-btn reply-action-btn--delete"
                        title="Delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete?.(reply.id, post.id);
                        }}
                      >
                        <TrashIcon size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Reply content - edit mode or display */}
                {editingReplyId === reply.id && !isEditModalOpen ? (
                  <div className="reply-edit-form">
                    <div className="reply-edit-input-wrapper">
                      <textarea
                        className="reply-edit-input"
                        value={editingReplyContent}
                        onChange={(e) => onEditChange?.(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') {
                            onEditCancel?.();
                          }
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            onEditSave?.(reply.id, post.id);
                          }
                        }}
                      />
                      <button 
                        className="expand-edit-btn"
                        onClick={() => handleExpandEdit(reply)}
                        title="Expand editor"
                      >
                        <MaximizeIcon size={12} strokeWidth="2.5" />
                      </button>
                    </div>
                    <div className="reply-edit-actions">
                      <button
                        className="reply-edit-cancel"
                        onClick={onEditCancel}
                        title="Cancel"
                      >
                        <CloseIcon size={16} />
                      </button>
                      <button
                        className="reply-edit-save"
                        onClick={() => onEditSave?.(reply.id, post.id)}
                        disabled={!editingReplyContent?.trim()}
                        title="Save"
                      >
                        <CheckIcon size={20} strokeWidth="2.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="reply-content">{reply.content}</p>
                )}
              </div>
            </div>
          ))}

          {hasMore && (
            <button className="show-more-replies-btn" onClick={() => onShowMore?.(post.id)}>
              Show {replies.length - 3} more replies
            </button>
          )}
        </div>
      )}

      {/* Expanded Edit Modal */}
      {isEditModalOpen && editingReply && createPortal(
        <div className="expanded-composer-overlay" onClick={handleCloseModal}>
          <div className="expanded-composer-modal edit-mode" onClick={(e) => e.stopPropagation()}>
            <div className="expanded-composer-header">
              <h3>
                <EditIcon size={20} />
                Edit Comment
              </h3>
              <button 
                className="close-btn-glow"
                onClick={handleCloseModal}
              >
                <CloseIcon size={24} />
              </button>
            </div>
            <div className="expanded-composer-body">
              <textarea
                className="composer-textarea"
                placeholder="Edit your comment..."
                value={editingReplyContent}
                onChange={(e) => onEditChange?.(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    handleCloseModal();
                  }
                }}
              />
            </div>
            <div className="expanded-composer-footer">
              <button 
                className="submit-btn icon-btn"
                disabled={!editingReplyContent?.trim() || isSaving}
                onClick={handleModalSave}
                title="Save"
              >
                {isSaving ? (
                  <span className="saving-dots">...</span>
                ) : (
                  <CheckIcon size={24} strokeWidth="2.5" />
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default RiverThread;
