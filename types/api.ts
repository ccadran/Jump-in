export interface Challenge {
  id: string;
  created_at: Date;
  name: string;
  description: string;
  cover: string;
  guild: string;
  created_by: string;
}

export interface Guild {
  id: string;
  created_at: Date;
  name: string;
  description: string;
  cover: string;
  owner_id: string;
}
