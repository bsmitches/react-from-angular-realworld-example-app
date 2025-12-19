import { Link } from 'react-router-dom';
import { useAuth } from '@/app/core/auth/hooks/useAuth';
import { Comment } from '../models';

interface ArticleCommentProps {
  comment: Comment;
  onDelete?: () => void;
}

export function ArticleComment({ comment, onDelete }: ArticleCommentProps) {
  const { user } = useAuth();
  const canModify = user?.username === comment.author.username;

  const formattedDate = new Date(comment.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="card">
      <div className="card-block">
        <p className="card-text">{comment.body}</p>
      </div>
      <div className="card-footer">
        <Link to={`/profile/${comment.author.username}`} className="comment-author">
          <img src={comment.author.image || ''} className="comment-author-img" alt={comment.author.username} />
        </Link>
        &nbsp;
        <Link to={`/profile/${comment.author.username}`} className="comment-author">
          {comment.author.username}
        </Link>
        <span className="date-posted">{formattedDate}</span>
        {canModify && (
          <span className="mod-options">
            <i className="ion-trash-a" onClick={onDelete} style={{ cursor: 'pointer' }}></i>
          </span>
        )}
      </div>
    </div>
  );
}

export default ArticleComment;
