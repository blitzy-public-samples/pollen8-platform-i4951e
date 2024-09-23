import React from 'react';
import { User } from 'src/shared/types/index';
import Card from 'src/frontend/components/ui/Card';
import Icon from 'src/frontend/components/ui/Icon';
import { COLORS } from 'src/shared/constants/index';
import classNames from 'classnames';

interface MetadataGridProps {
  user: User;
  className?: string;
}

const MetadataGrid: React.FC<MetadataGridProps> = React.memo(({ user, className }) => {
  const metadataItems = [
    { icon: 'industry', label: 'Industry', value: user.industry },
    { icon: 'interests', label: 'Interests', value: user.interests.join(', ') },
    { icon: 'location', label: 'Location', value: user.location },
    { icon: 'connections', label: 'Connections', value: user.connections.length.toString() },
    { icon: 'joinDate', label: 'Joined', value: new Date(user.createdAt).toLocaleDateString() },
  ];

  return (
    <Card className={classNames('p-4', className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {metadataItems.map((item) => (
          <div key={item.label} className="flex items-center" aria-label={item.label}>
            <Icon
              name={item.icon}
              className="mr-2 text-gray-600"
              size={20}
              color={COLORS.PRIMARY}
            />
            <div>
              <div className="text-sm font-semibold">{item.label}</div>
              <div className="text-base">{item.value || 'N/A'}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
});

MetadataGrid.displayName = 'MetadataGrid';

export default MetadataGrid;