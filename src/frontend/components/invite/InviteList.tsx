import React, { useState } from 'react';
import { Invite } from 'src/shared/types/index.ts';
import { useInvites } from 'src/shared/hooks/index.ts';
import Card from 'src/frontend/components/ui/Card.tsx';
import Button from 'src/frontend/components/ui/Button.tsx';
import InviteRow from 'src/frontend/components/invite/InviteRow.tsx';
import LinkCreationInterface from 'src/frontend/components/invite/LinkCreationInterface.tsx';
import { COLORS } from 'src/shared/constants/index.ts';
import classNames from 'classnames';

interface InviteListProps {
  className?: string;
}

const InviteList: React.FC<InviteListProps> = React.memo(({ className }) => {
  const { invites, generateInvite, deleteInvite } = useInvites();
  const [showLinkCreation, setShowLinkCreation] = useState(false);

  const handleCreateInvite = () => {
    setShowLinkCreation(true);
  };

  const handleGenerateInvite = async (linkName: string) => {
    await generateInvite(linkName);
    setShowLinkCreation(false);
  };

  const handleDeleteInvite = async (inviteId: string) => {
    await deleteInvite(inviteId);
  };

  return (
    <Card className={classNames('p-4', className)}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Invites ({invites.length})</h2>
        <Button
          onClick={handleCreateInvite}
          label="Create Invite"
          variant="primary"
        />
      </div>

      {showLinkCreation && (
        <LinkCreationInterface
          onCreateLink={handleGenerateInvite}
          currentLinkCount={invites.length}
          onClose={() => setShowLinkCreation(false)}
          className="mb-4"
        />
      )}

      {invites.length > 0 ? (
        <div className="space-y-4">
          {invites.map((invite) => (
            <InviteRow
              key={invite.id}
              invite={invite}
              onDelete={handleDeleteInvite}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No invites created yet.</p>
      )}
    </Card>
  );
});

InviteList.displayName = 'InviteList';

export default InviteList;