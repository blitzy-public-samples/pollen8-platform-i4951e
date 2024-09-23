import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth, useNetwork } from 'src/shared/contexts/index.ts';
import ProfileBanner from 'src/frontend/components/profile/ProfileBanner.tsx';
import MetadataGrid from 'src/frontend/components/profile/MetadataGrid.tsx';
import InviteList from 'src/frontend/components/invite/InviteList.tsx';
import NetworkGraph from 'src/frontend/components/network/NetworkGraph.tsx';
import ActivityChart from 'src/frontend/components/network/ActivityChart.tsx';
import Button from 'src/frontend/components/ui/Button.tsx';
import Card from 'src/frontend/components/ui/Card.tsx';
import Loader from 'src/frontend/components/ui/Loader.tsx';
import Toast from 'src/frontend/components/ui/Toast.tsx';
import { COLORS } from 'src/shared/constants/index.ts';
import classNames from 'classnames';

const Profile: React.FC = React.memo(() => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const { getUserProfile, getUserNetworkData } = useNetwork();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [networkData, setNetworkData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const profile = await getUserProfile(userId);
        const network = await getUserNetworkData(userId);
        setProfileData(profile);
        setNetworkData(network);
      } catch (err) {
        setError('Failed to load profile data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId, getUserProfile, getUserNetworkData]);

  const handleEditProfile = () => {
    // Implement profile editing logic here
    console.log('Edit profile clicked');
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Toast message={error} type="error" />;
  }

  const isOwnProfile = currentUser?.id === userId;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <ProfileBanner user={profileData} />
        {isOwnProfile && (
          <Button
            label="Edit Profile"
            onClick={handleEditProfile}
            className="mt-4"
          />
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <h2 className="text-2xl font-bold mb-4">User Information</h2>
          <MetadataGrid user={profileData} />
        </Card>

        <Card>
          <h2 className="text-2xl font-bold mb-4">Network Visualization</h2>
          <NetworkGraph connections={networkData?.connections} />
        </Card>
      </div>

      <Card className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Activity Over Time</h2>
        <ActivityChart activityData={networkData?.activityData} />
      </Card>

      {isOwnProfile && (
        <Card className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Manage Invites</h2>
          <InviteList />
        </Card>
      )}
    </div>
  );
});

export default Profile;

// Human tasks:
// - Add unit tests for the Profile component
// - Implement lazy loading for components to improve initial load time
// - Add support for internationalization (i18n) for all text content
// - Ensure the component is fully responsive on all screen sizes
// - Implement proper error boundaries to handle component errors gracefully
// - Add keyboard navigation support for better accessibility
// - Optimize the component for performance, especially when rendering large networks or activity data
// - Implement a feature to download user data in various formats (e.g., PDF, CSV)
// - Add analytics tracking for key user interactions on the profile page