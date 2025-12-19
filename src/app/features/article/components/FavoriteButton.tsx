import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/core/auth/hooks/useAuth';
import { useFavoriteArticle, useUnfavoriteArticle } from '../services';
import { Article } from '../models';

interface FavoriteButtonProps {
  article: Article;
  onToggle?: (favorited: boolean) => void;
  children?: React.ReactNode;
  className?: string;
}

export function FavoriteButton({ article, onToggle, children, className = '' }: FavoriteButtonProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const favoriteArticle = useFavoriteArticle();
  const unfavoriteArticle = useUnfavoriteArticle();

  const handleClick = async () => {
    if (!isAuthenticated) {
      navigate('/register');
      return;
    }

    setIsSubmitting(true);

    try {
      if (article.favorited) {
        await unfavoriteArticle.mutateAsync(article.slug);
        onToggle?.(false);
      } else {
        await favoriteArticle.mutateAsync(article.slug);
        onToggle?.(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const buttonClass = `btn btn-sm ${article.favorited ? 'btn-primary' : 'btn-outline-primary'} ${isSubmitting ? 'disabled' : ''} ${className}`;

  return (
    <button className={buttonClass} onClick={handleClick} disabled={isSubmitting}>
      <i className="ion-heart"></i> {children}
    </button>
  );
}

export default FavoriteButton;
