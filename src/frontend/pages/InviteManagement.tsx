import React, { useState, useEffect } from 'react';
import { useAuth } from 'src/shared/contexts/index.ts';
import { useInvites } from 'src/shared/hooks/index.ts';
import { InviteList } from 'src/frontend/components/invite/InviteList.tsx';
import { LinkCreationInterface } from 'src/frontend/components/invite/LinkCreationInterface.tsx';
import { Card } from 'src/frontend/components/ui/Card.tsx';
import { Button } from 'src/frontend/components/ui/Button.tsx';
import { Toast } from 'src/frontend/components/ui/Toast.tsx';
import { Loader } from 'src/frontend/components/ui/Loader.tsx';
import { COLORS, MAX_INVITE_LINKS } from 'src/shared/constants/index.ts';
import classNames from 'classnames';

const InviteManagement: React.FC = React.memo(() => {
  const { user } = useAuth();
  const { invites, loading, error, createInvite, deleteInvite, fetchInvites } = useInvites();
  const [showLinkCreation, setShowLinkCreation] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchInvites();
  }, [fetchInvites]);

  const handleCreateInvite = async (linkName: string) => {
    try {
      await createInvite(linkName);
      setToastMessage('Invite link created successfully');
      setShowLinkCreation(false);
    } catch (err) {
      setToastMessage('Failed to create invite link');
    }
  };

  const handleDeleteInvite = async (inviteId: string) => {
    try {
      await deleteInvite(inviteId);
      setToastMessage('Invite link deleted successfully');
    } catch (err) {
      setToastMessage('Failed to delete invite link');
    }
  };

  const totalClicks = invites.reduce((sum, invite) => sum + invite.clickCount, 0);
  const conversionRate = invites.length > 0 ? (user?.connections?.length || 0) / invites.length * 100 : 0;

  return (
    <Card className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Invite Management</h1>
      
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold">Total Invites</h2>
          <p className="text-2xl">{invites.length}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold">Total Clicks</h2>
          <p className="text-2xl">{totalClicks}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold">Conversion Rate</h2>
          <p className="text-2xl">{conversionRate.toFixed(2)}%</p>
        </div>
      </div>

      <Button
        onClick={() => setShowLinkCreation(true)}
        disabled={invites.length >= MAX_INVITE_LINKS}
        className="mb-4"
      >
        Create New Invite Link
      </Button>

      {showLinkCreation && (
        <LinkCreationInterface
          onCreateLink={handleCreateInvite}
          onClose={() => setShowLinkCreation(false)}
          currentLinkCount={invites.length}
        />
      )}

      {loading ? (
        <Loader />
      ) : (
        <InviteList invites={invites} onDeleteInvite={handleDeleteInvite} />
      )}

      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
          type={toastMessage.includes('successfully') ? 'success' : 'error'}
        />
      )}

      {error && <p className="text-red-500 mt-4">Error: {error}</p>}
    </Card>
  );
});

export default InviteManagement;

// Accessibility attributes
InviteManagement.displayName = 'InviteManagement';