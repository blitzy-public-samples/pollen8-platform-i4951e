import React, { useState, useEffect } from 'react';
import { useAuth, useNetwork } from 'src/shared/contexts/index.ts';
import ProfileBanner from 'src/frontend/components/profile/ProfileBanner.tsx';
import NetworkGraph from 'src/frontend/components/network/NetworkGraph.tsx';
import ActivityChart from 'src/frontend/components/network/ActivityChart.tsx';
import Button from 'src/frontend/components/ui/Button.tsx';
import Card from 'src/frontend/components/ui/Card.tsx';
import Loader from 'src/frontend/components/ui/Loader.tsx';
import Toast from 'src/frontend/components/ui/Toast.tsx';
import { COLORS } from 'src/shared/constants/index.ts';
import classNames from 'classnames';

const Account: React.FC = React.memo(() => {
  const { user, updateUser, changePassword, deleteAccount } = useAuth();
  const { networkData, activityData, fetchNetworkData, fetchActivityData } = useNetwork();
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchNetworkData(), fetchActivityData()]);
      setLoading(false);
    };
    fetchData();
  }, [fetchNetworkData, fetchActivityData]);

  const handleUpdateProfile = async (updatedData: Partial<typeof user>) => {
    try {
      await updateUser(updatedData);
      setToastMessage('Profile updated successfully');
    } catch (error) {
      setToastMessage('Failed to update profile');
    }
  };

  const handleChangePassword = async (oldPassword: string, newPassword: string) => {
    try {
      await changePassword(oldPassword, newPassword);
      setToastMessage('Password changed successfully');
    } catch (error) {
      setToastMessage('Failed to change password');
    }
  };

  const handleDeleteAccount = async () => {
    if (showDeleteConfirmation) {
      try {
        await deleteAccount();
        // Redirect to home page or login page after successful deletion
      } catch (error) {
        setToastMessage('Failed to delete account');
      }
    } else {
      setShowDeleteConfirmation(true);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileBanner user={user} onEdit={() => {/* Implement edit functionality */}} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
          {/* Implement account settings form */}
          <Button onClick={() => handleUpdateProfile(/* Updated user data */)}>Update Profile</Button>
          <Button onClick={() => handleChangePassword(/* Old and new password */)}>Change Password</Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Privacy Settings</h2>
          {/* Implement privacy settings options */}
        </Card>
      </div>

      <Card className="mt-8 p-6">
        <h2 className="text-2xl font-bold mb-4">Network Visualization</h2>
        <NetworkGraph data={networkData} />
      </Card>

      <Card className="mt-8 p-6">
        <h2 className="text-2xl font-bold mb-4">Activity Overview</h2>
        <ActivityChart data={activityData} />
      </Card>

      <Card className="mt-8 p-6">
        <h2 className="text-2xl font-bold mb-4">Connected Apps and Services</h2>
        {/* Implement connected apps and services section */}
      </Card>

      <div className="mt-8 text-center">
        <Button
          onClick={handleDeleteAccount}
          className={classNames("bg-red-600 text-white", { "opacity-50": !showDeleteConfirmation })}
        >
          {showDeleteConfirmation ? "Confirm Delete Account" : "Delete Account"}
        </Button>
      </div>

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage('')} />
      )}
    </div>
  );
});

export default Account;