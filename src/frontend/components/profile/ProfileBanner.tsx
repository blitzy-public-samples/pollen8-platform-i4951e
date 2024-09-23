import React from 'react';
import { User } from 'src/shared/types/index';
import { useAuth, useNetwork } from 'src/shared/contexts/index';
import { Card, Button, Icon } from 'src/frontend/components/ui';
import { COLORS } from 'src/shared/constants/index';
import classNames from 'classnames';

interface ProfileBannerProps {
  user: User;
  onEdit: () => void;
  className?: string;
}

export const ProfileBanner: React.FC<ProfileBannerProps> = React.memo(({ user, onEdit, className }) => {
  const { currentUser } = useAuth();
  const { networkValue } = useNetwork();

  const isCurrentUser = currentUser?.id === user.id;

  return (
    <Card className={classNames('p-6', className)}>
      <div className="flex items-center">
        <div className="w-24 h-24 rounded-full overflow-hidden mr-6">
          {user.profilePicture ? (
            <img src={user.profilePicture} alt={`${user.username}'s profile`} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
              <Icon name="user" size={48} color={COLORS.PRIMARY} />
            </div>
          )}
        </div>
        <div className="flex-grow">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-600">@{user.username}</p>
          {user.location && (
            <p className="text-sm text-gray-500 mt-1">
              <Icon name="location" size={16} className="inline-block mr-1" />
              {user.location}
            </p>
          )}
        </div>
        {isCurrentUser && (
          <Button onClick={onEdit} variant="secondary" className="ml-4">
            Edit Profile
          </Button>
        )}
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Network Value</p>
          <p className="text-xl font-bold">{networkValue}</p>
        </div>
        <div className="flex">
          {user.industry && (
            <div className="mr-4">
              <Icon name="industry" size={24} className="mb-1" />
              <p className="text-sm">{user.industry}</p>
            </div>
          )}
          {user.interests && user.interests.length > 0 && (
            <div>
              <Icon name="interests" size={24} className="mb-1" />
              <p className="text-sm">{user.interests.join(', ')}</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
});

ProfileBanner.displayName = 'ProfileBanner';