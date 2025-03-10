export interface ILeaderboard {
  rankings: IRanking[];
  createdAt: Date | string; // If we get from backend, it'll be in JSON format and therefore a string
  updatedAt: Date | string;
}

export interface IRanking {
  member: IMember;
  message: IMessage;
  reaction: IReaction;
}

export interface IMember {
  id: string;
  username: string;
  displayName: string;
  avatar?: string | null;
}

export interface IMessage {
  id: string;
  author: IMember;
  content: string;
  url: string;
  date: Date;
}

export interface IReaction {
  emoji: IEmoji;
  count: number;
}

export interface IEmoji {
  id?: string | null;
  name: string | null;
}
