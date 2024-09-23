import React, { useState } from 'react';
import { Post, User } from 'src/shared/types/index.ts';
import { Card } from 'src/frontend/components/ui/Card.tsx';
import { Button } from 'src/frontend/components/ui/Button.tsx';
import { Icon } from 'src/frontend/components/ui/Icon.tsx';
import { Avatar } from 'src/frontend/components/ui/Avatar.tsx';
import { COLORS } from 'src/shared/constants/index.ts';
import { formatDate, truncateText } from 'src/shared/utils/index.ts';
import classNames from 'classnames';

interface PostCardProps {
  post: Post;
  author: User;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  className?: string;
}

export const PostCard: React.FC<PostCardProps> = React.memo(({
  post,
  author,
  onLike,
  onComment,
  onShare,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const handleLike = () => onLike(post.id);
  const handleComment = () => onComment(post.id);
  const handleShare = () => onShare(post.id);

  const cardClasses = classNames(
    'max-w-2xl mx-auto mb-4',
    className
  );

  const contentClasses = classNames(
    'text-sm mb-2',
    { 'line-clamp-3': !isExpanded }
  );

  return (
    <Card className={cardClasses}>
      <div className="flex items-center mb-2">
        <Avatar src={author.avatarUrl} alt={author.username} className="mr-2" />
        <div>
          <h3 className="font-semibold">{author.username}</h3>
          <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
        </div>
      </div>

      <div className={contentClasses}>
        {post.content}
      </div>

      {post.content.length > 150 && (
        <Button
          variant="text"
          size="small"
          onClick={toggleExpand}
          className="mb-2"
        >
          {isExpanded ? 'Show Less' : 'Read More'}
        </Button>
      )}

      <div className="flex justify-between items-center mt-4">
        <div className="flex space-x-4">
          <Button
            variant="text"
            size="small"
            onClick={handleLike}
            className="flex items-center"
            aria-label="Like post"
          >
            <Icon name="heart" className="mr-1" />
            <span>{post.likes}</span>
          </Button>
          <Button
            variant="text"
            size="small"
            onClick={handleComment}
            className="flex items-center"
            aria-label="Comment on post"
          >
            <Icon name="comment" className="mr-1" />
            <span>{post.comments}</span>
          </Button>
        </div>
        <Button
          variant="text"
          size="small"
          onClick={handleShare}
          className="flex items-center"
          aria-label="Share post"
        >
          <Icon name="share" className="mr-1" />
          <span>Share</span>
        </Button>
      </div>
    </Card>
  );
});

PostCard.displayName = 'PostCard';