import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { marked } from 'marked';
import { useAuth } from '@/app/core/auth/hooks/useAuth';
import { ListErrors } from '@/app/shared/components';
import { Errors } from '@/app/shared/types';
import { Profile } from '@/app/features/profile/models';
import { FollowButton } from '@/app/features/profile/components';
import { Article } from '../../models';
import { useArticle, useDeleteArticle, useComments, useAddComment, useDeleteComment } from '../../services';
import { ArticleMeta, ArticleComment, FavoriteButton } from '../../components';

function ArticleActions({
  article,
  canModify,
  isDeleting,
  onDelete,
  onToggleFavorite,
  onToggleFollowing,
}: {
  article: Article;
  canModify: boolean;
  isDeleting: boolean;
  onDelete: () => void;
  onToggleFavorite: (favorited: boolean) => void;
  onToggleFollowing: (profile: Profile) => void;
}) {
  if (canModify) {
    return (
      <span>
        <Link to={`/editor/${article.slug}`} className="btn btn-sm btn-outline-secondary">
          <i className="ion-edit"></i> Edit Article
        </Link>
        <button
          className={`btn btn-sm btn-outline-danger ${isDeleting ? 'disabled' : ''}`}
          onClick={onDelete}
          disabled={isDeleting}
        >
          <i className="ion-trash-a"></i> Delete Article
        </button>
      </span>
    );
  }

  return (
    <span>
      <FollowButton profile={article.author} onToggle={onToggleFollowing} />
      &nbsp;
      <FavoriteButton article={article} onToggle={onToggleFavorite}>
        {article.favorited ? 'Unfavorite' : 'Favorite'} Article
        <span className="counter">({article.favoritesCount})</span>
      </FavoriteButton>
    </span>
  );
}

export function ArticlePage() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const { user, isAuthenticated } = useAuth();

  const [commentBody, setCommentBody] = useState('');
  const [commentErrors, setCommentErrors] = useState<Errors | null>(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: article, isLoading: articleLoading, isError: articleError } = useArticle(slug || '');
  const { data: comments = [], isLoading: commentsLoading } = useComments(slug || '');
  const deleteArticle = useDeleteArticle();
  const addComment = useAddComment();
  const deleteComment = useDeleteComment();

  const [localArticle, setLocalArticle] = useState<Article | null>(null);
  const displayArticle = localArticle || article;

  const canModify = user?.username === displayArticle?.author.username;

  const handleDeleteArticle = async () => {
    if (!slug) return;
    setIsDeleting(true);
    try {
      await deleteArticle.mutateAsync(slug);
      navigate('/');
    } catch {
      setIsDeleting(false);
    }
  };

  const handleToggleFavorite = (favorited: boolean) => {
    if (!displayArticle) return;
    setLocalArticle({
      ...displayArticle,
      favorited,
      favoritesCount: favorited ? displayArticle.favoritesCount + 1 : displayArticle.favoritesCount - 1,
    });
  };

  const handleToggleFollowing = (profile: Profile) => {
    if (!displayArticle) return;
    setLocalArticle({
      ...displayArticle,
      author: profile,
    });
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug || !commentBody.trim()) return;

    setIsSubmittingComment(true);
    setCommentErrors(null);

    try {
      await addComment.mutateAsync({ slug, body: commentBody });
      setCommentBody('');
    } catch (err) {
      setCommentErrors(err as Errors);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!slug) return;
    await deleteComment.mutateAsync({ slug, commentId });
  };

  if (articleLoading) {
    return <div className="container">Loading article...</div>;
  }

  if (articleError || !displayArticle) {
    return <div className="container">Error loading article.</div>;
  }

  const renderedBody = marked(displayArticle.body);

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{displayArticle.title}</h1>

          <ArticleMeta article={displayArticle}>
            <ArticleActions
              article={displayArticle}
              canModify={canModify}
              isDeleting={isDeleting}
              onDelete={handleDeleteArticle}
              onToggleFavorite={handleToggleFavorite}
              onToggleFollowing={handleToggleFollowing}
            />
          </ArticleMeta>
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <div dangerouslySetInnerHTML={{ __html: renderedBody }} />

            <ul className="tag-list">
              {displayArticle.tagList.map((tag) => (
                <li key={tag} className="tag-default tag-pill tag-outline">
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr />

        <div className="article-actions">
          <ArticleMeta article={displayArticle}>
            <ArticleActions
              article={displayArticle}
              canModify={canModify}
              isDeleting={isDeleting}
              onDelete={handleDeleteArticle}
              onToggleFavorite={handleToggleFavorite}
              onToggleFollowing={handleToggleFollowing}
            />
          </ArticleMeta>
        </div>

        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            {isAuthenticated ? (
              <div>
                <ListErrors errors={commentErrors} />
                <form className="card comment-form" onSubmit={handleAddComment}>
                  <fieldset disabled={isSubmittingComment}>
                    <div className="card-block">
                      <textarea
                        className="form-control"
                        placeholder="Write a comment..."
                        rows={3}
                        value={commentBody}
                        onChange={(e) => setCommentBody(e.target.value)}
                      ></textarea>
                    </div>
                    <div className="card-footer">
                      <img
                        src={user?.image || ''}
                        className="comment-author-img"
                        alt={user?.username}
                      />
                      <button className="btn btn-sm btn-primary" type="submit">
                        Post Comment
                      </button>
                    </div>
                  </fieldset>
                </form>
              </div>
            ) : (
              <div>
                <Link to="/login">Sign in</Link> or <Link to="/register">sign up</Link> to add
                comments on this article.
              </div>
            )}

            {commentsLoading && <div>Loading comments...</div>}

            {!commentsLoading &&
              comments.map((comment) => (
                <ArticleComment
                  key={comment.id}
                  comment={comment}
                  onDelete={() => handleDeleteComment(comment.id)}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticlePage;
