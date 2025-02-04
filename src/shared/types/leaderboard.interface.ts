export interface ILeaderboard {
  rankings: IRanking[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IRanking {
  member: IMember;
  message: IMessage;
  reaction: IReaction;
  count: IReaction["count"];
}

export interface IMember {
  id: string;
  username: string;
  avatar?: string | null;
}

export interface IMessage {
  id: string;
  author: IMember;
  content: string;
  reaction: IReaction; // We currently only care about one reaction
  date: Date;
  url: string;
}

export interface IReaction {
  emoji: IEmoji;
  count: number;
}

export interface IEmoji {
  id?: string | null;
  name: string | null;
}
