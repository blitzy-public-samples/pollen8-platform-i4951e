import React, { useState, useEffect } from 'react';
import { useAuth, useNetwork } from 'src/shared/contexts/index.ts';
import PostList from 'src/frontend/components/feed/PostList.tsx';
import Card from 'src/frontend/components/ui/Card.tsx';
import Button from 'src/frontend/components/ui/Button.tsx';
import Dropdown from 'src/frontend/components/ui/Dropdown.tsx';
import Loader from 'src/frontend/components/ui/Loader.tsx';
import Toast from 'src/frontend/components/ui/Toast.tsx';
import { COLORS, INDUSTRIES } from 'src/shared/constants/index.ts';
import classNames from 'classnames';

const NetworkFeed: React.FC = React.memo(() => {
  const { user } = useAuth();
  const { getPosts, createPost, interactWithPost } = useNetwork();
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchPosts();
  }, [selectedIndustry]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const fetchedPosts = await getPosts(selectedIndustry);
      setPosts(fetchedPosts);
    } catch (error) {
      setToastMessage('Failed to fetch posts. Please try again.');
    }
    setIsLoading(false);
  };

  const handleIndustryChange = (industry: string) => {
    setSelectedIndustry(industry);
  };

  const handleCreatePost = async () => {
    try {
      await createPost(newPostContent, selectedIndustry);
      setToastMessage('Post created successfully!');
      setShowCreatePostModal(false);
      setNewPostContent('');
      fetchPosts();
    } catch (error) {
      setToastMessage('Failed to create post. Please try again.');
    }
  };

  const handlePostInteraction = async (postId: string, interactionType: string) => {
    try {
      await interactWithPost(postId, interactionType);
      fetchPosts();
    } catch (error) {
      setToastMessage(`Failed to ${interactionType} post. Please try again.`);
    }
  };

  return (
    <Card className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Network Feed</h1>
      <div className="flex justify-between items-center mb-4">
        <Dropdown
          options={['All', ...INDUSTRIES]}
          selectedOption={selectedIndustry}
          onSelect={handleIndustryChange}
          placeholder="Filter by Industry"
        />
        <Button
          label="Create Post"
          onClick={() => setShowCreatePostModal(true)}
          className="bg-black text-white"
        />
      </div>
      {isLoading ? (
        <Loader />
      ) : (
        <PostList
          posts={posts}
          onInteraction={handlePostInteraction}
        />
      )}
      {showCreatePostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card className="p-4 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-2">Create New Post</h2>
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="w-full h-32 p-2 border border-gray-300 rounded mb-2"
              placeholder="What's on your mind?"
            />
            <div className="flex justify-end">
              <Button
                label="Cancel"
                onClick={() => setShowCreatePostModal(false)}
                className="mr-2"
              />
              <Button
                label="Post"
                onClick={handleCreatePost}
                className="bg-black text-white"
              />
            </div>
          </Card>
        </div>
      )}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage('')}
        />
      )}
    </Card>
  );
});

export default NetworkFeed;