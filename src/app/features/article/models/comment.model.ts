import { Profile } from '../../profile/models/profile.model';

export interface Comment {
  id: number;
  body: string;
  createdAt: string;
  author: Profile;
}
