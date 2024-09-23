import React, { useState } from 'react';
import { Input } from 'src/frontend/components/ui/Input';
import { Button } from 'src/frontend/components/ui/Button';
import { Card } from 'src/frontend/components/ui/Card';
import { Toast } from 'src/frontend/components/ui/Toast';
import { COLORS, MAX_INVITE_LINKS } from 'src/shared/constants/index';
import classNames from 'classnames';

interface LinkCreationInterfaceProps {
  onCreateLink: (linkName: string) => Promise<void>;
  currentLinkCount: number;
  onClose: () => void;
  className?: string;
}

export const LinkCreationInterface: React.FC<LinkCreationInterfaceProps> = React.memo(({
  onCreateLink,
  currentLinkCount,
  onClose,
  className
}) => {
  const [linkName, setLinkName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (linkName.trim() === '') {
      setError('Link name cannot be empty');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await onCreateLink(linkName);
      Toast.success('Invite link created successfully');
      onClose();
    } catch (err) {
      setError('Failed to create invite link. Please try again.');
      Toast.error('Failed to create invite link');
    } finally {
      setIsLoading(false);
    }
  };

  const isMaxLinkReached = currentLinkCount >= MAX_INVITE_LINKS;

  return (
    <Card className={classNames('p-6', className)}>
      <h2 className="text-2xl font-bold mb-4 text-black">Create New Invite Link</h2>
      <p className="mb-4 text-gray-600">
        Current links: {currentLinkCount} / {MAX_INVITE_LINKS}
      </p>
      {isMaxLinkReached ? (
        <p className="text-red-500 mb-4">Maximum number of invite links reached.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Enter link name"
            value={linkName}
            onChange={(e) => setLinkName(e.target.value)}
            className="mb-4"
            aria-label="Link name"
          />
          <div className="flex justify-between">
            <Button
              type="submit"
              disabled={isLoading || isMaxLinkReached}
              className="mr-2"
            >
              {isLoading ? 'Creating...' : 'Create Link'}
            </Button>
            <Button onClick={onClose} variant="secondary">
              Cancel
            </Button>
          </div>
        </form>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </Card>
  );
});

LinkCreationInterface.displayName = 'LinkCreationInterface';