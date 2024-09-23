import React, { useState } from 'react';
import { Invite } from 'src/shared/types/index';
import { Button } from 'src/frontend/components/ui/Button';
import { Icon } from 'src/frontend/components/ui/Icon';
import { Toast } from 'src/frontend/components/ui/Toast';
import { COLORS } from 'src/shared/constants/index';
import { formatDate } from 'src/shared/utils/index';
import classNames from 'classnames';

interface InviteRowProps {
  invite: Invite;
  onDelete: (id: string) => void;
  className?: string;
}

export const InviteRow: React.FC<InviteRowProps> = React.memo(({ invite, onDelete, className }) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(invite.linkUrl).then(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    });
  };

  const handleDelete = () => {
    setShowConfirmDialog(true);
  };

  const confirmDelete = () => {
    onDelete(invite.id);
    setShowConfirmDialog(false);
  };

  return (
    <div className={classNames('flex items-center justify-between p-4 border-b border-gray-200', className)}>
      <div className="flex-grow">
        <h3 className="text-lg font-semibold">{invite.linkName}</h3>
        <p className="text-sm text-gray-500">{formatDate(invite.createdAt)}</p>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">{invite.clickCount} clicks</span>
        <Button
          onClick={handleCopyLink}
          variant="secondary"
          size="small"
          aria-label="Copy invite link"
        >
          <Icon name="copy" className="w-4 h-4" />
        </Button>
        <Button
          onClick={() => {/* Implement view details functionality */}}
          variant="secondary"
          size="small"
          aria-label="View invite details"
        >
          <Icon name="eye" className="w-4 h-4" />
        </Button>
        <Button
          onClick={handleDelete}
          variant="secondary"
          size="small"
          aria-label="Delete invite"
        >
          <Icon name="trash" className="w-4 h-4" />
        </Button>
      </div>

      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h4 className="text-lg font-semibold mb-4">Confirm Delete</h4>
            <p className="mb-4">Are you sure you want to delete this invite?</p>
            <div className="flex justify-end space-x-2">
              <Button onClick={() => setShowConfirmDialog(false)} variant="secondary">Cancel</Button>
              <Button onClick={confirmDelete} variant="primary">Delete</Button>
            </div>
          </div>
        </div>
      )}

      {showToast && (
        <Toast message="Invite link copied to clipboard" type="success" />
      )}
    </div>
  );
});

InviteRow.displayName = 'InviteRow';