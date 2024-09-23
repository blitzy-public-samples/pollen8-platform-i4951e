import React, { useState, useEffect } from 'react';
import { Post, User } from 'src/shared/types/index.ts';
import { useInfiniteScroll } from 'src/shared/hooks/index.ts';
import { useNetwork } from 'src/shared/contexts/index.ts';
import PostCard from 'src/frontend/components/feed/PostCard.tsx';
import Loader from 'src/frontend/components/ui/Loader.tsx';
import Dropdown from 'src/frontend/components/ui/Dropdown.tsx';
import { COLORS } from 'src/shared/constants/index.ts';
import classNames from 'classnames';

interface PostListProps {
  className?: string;
}

const PostList: React.FC<PostListProps> = React.memo(({ className }) => {
  const [filter, setFilter] = useState('all');
  const { getPosts, likePost, commentOnPost, sharePost } = useNetwork();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchPosts = async (pageNum: number) => {
    setLoading(true);
    try {
      const newPosts = await getPosts(filter, pageNum);
      setPosts(prevPosts => [...prevPosts, ...newPosts]);
      setHasMore(newPosts.length > 0);
      setPage(pageNum);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      // TODO: Implement proper error handling
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPosts([]);
    setPage(1);
    fetchPosts(1);
  }, [filter]);

  const loadMorePosts = () => {
    if (!loading && hasMore) {
      fetchPosts(page + 1);
    }
  };

  const { lastPostElementRef } = useInfiniteScroll(loadMorePosts);

  const handleLike = async (postId: string) => {
    try {
      await likePost(postId);
      // Update the local state to reflect the like
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      );
    } catch (error) {
      console.error('Failed to like post:', error);
      // TODO: Implement proper error handling
    }
  };

  const handleComment = async (postId: string, comment: string) => {
    try {
      await commentOnPost(postId, comment);
      // Update the local state to reflect the new comment
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId ? { ...post, comments: post.comments + 1 } : post
        )
      );
    } catch (error) {
      console.error('Failed to comment on post:', error);
      // TODO: Implement proper error handling
    }
  };

  const handleShare = async (postId: string) => {
    try {
      await sharePost(postId);
      // Update the local state to reflect the share
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId ? { ...post, shares: post.shares + 1 } : post
        )
      );
    } catch (error) {
      console.error('Failed to share post:', error);
      // TODO: Implement proper error handling
    }
  };

  const filterOptions = [
    { value: 'all', label: 'All Posts' },
    { value: 'network', label: 'My Network' },
    { value: 'industry', label: 'My Industry' },
  ];

  return (
    <div className={classNames('space-y-4', className)}>
      <Dropdown
        options={filterOptions}
        value={filter}
        onChange={setFilter}
        className="mb-4"
        aria-label="Filter posts"
      />
      {posts.map((post, index) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={() => handleLike(post.id)}
          onComment={(comment) => handleComment(post.id, comment)}
          onShare={() => handleShare(post.id)}
          ref={index === posts.length - 1 ? lastPostElementRef : null}
        />
      ))}
      {loading && <Loader className="my-4" />}
      {!loading && posts.length === 0 && (
        <p className="text-center text-gray-500">No posts to show.</p>
      )}
      {!hasMore && posts.length > 0 && (
        <p className="text-center text-gray-500">No more posts to load.</p>
      )}
    </div>
  );
});

export default PostList;