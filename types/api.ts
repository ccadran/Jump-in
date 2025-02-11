export interface Challenges {
  id: string;
  created_at: Date;
  name: string;
  description: string;
  cover: string;
  guild: string;
  created_by: string;
}

export interface Guilds {
  id: string;
  created_at: Date;
  name: string;
  description: string;
  cover: string;
  owner_id: string;
}

export interface CompleteChallenges {
  id: string;
  created_at: Date;
  title: string;
  description: string;
  challenge_id: string;
  user_id: string;
}

export interface UserData {
  firstName: string;
  name: string;
  username: string;
  description: string;
  profilePicture: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  userData: UserData;
}
