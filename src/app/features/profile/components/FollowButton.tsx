import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/core/auth/hooks/useAuth';
import { useFollowUser, useUnfollowUser } from '../services';
import { Profile } from '../models';

interface FollowButtonProps {
  profile: Profile;
  onToggle?: (profile: Profile) => void;
}

export function FollowButton({ profile, onToggle }: FollowButtonProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const followUser = useFollowUser();
  const unfollowUser = useUnfollowUser();

  const handleClick = async () => {
    if (!isAuthenticated) {
      navigate('/register');
      return;
    }

    setIsSubmitting(true);

    try {
      if (profile.following) {
        const updatedProfile = await unfollowUser.mutateAsync(profile.username);
        onToggle?.(updatedProfile);
      } else {
        const updatedProfile = await followUser.mutateAsync(profile.username);
        onToggle?.(updatedProfile);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const buttonClass = `btn btn-sm ${profile.following ? 'btn-secondary' : 'btn-outline-secondary'} ${isSubmitting ? 'disabled' : ''}`;

  return (
    <button className={buttonClass} onClick={handleClick} disabled={isSubmitting}>
      <i className="ion-plus-round"></i>
      &nbsp;
      {profile.following ? 'Unfollow' : 'Follow'} {profile.username}
    </button>
  );
}

export default FollowButton;
