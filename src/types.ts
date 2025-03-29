export interface Icon {
  id: number;
}

export interface ClubIdentifier {
  tag: string;
  name: string;
}

export interface Gadget {
  name: {}; 
  id: number;
}

export interface StarPower {
  name: {}; 
  id: number;
}

export interface Gear {
  name: {}; 
  id: number;
  level: number;
}

export interface BrawlerStat {
  gadgets: Gadget[];
  starPowers: StarPower[];
  id: number;
  rank: number;
  trophies: number;
  highestTrophies: number;
  power: number;
  gears: Gear[];
  name: {}; 
}

export interface Player {
  club: ClubIdentifier | {}; 
  '3vs3Victories': number;
  isQualifiedFromChampionshipChallenge: boolean;
  icon: Icon;
  tag: string;
  name: string;
  trophies: number;
  expLevel: number;
  expPoints: number;
  highestTrophies: number;
  soloVictories: number;
  duoVictories: number;
  bestRoboRumbleTime: number;
  bestTimeAsBigBrawler: number;
  brawlers: BrawlerStat[];
  nameColor: string;
}

export interface ClubMember {
  icon: Icon;
  tag: string;
  name: string;
  trophies: number;
  role: 'notMember' | 'member' | 'president' | 'senior' | 'vicePresident' | 'unknown';
  nameColor: string;
}

export interface Club {
  tag: string;
  name: string;
  description: string;
  trophies: number;
  requiredTrophies: number;
  members: ClubMember[];
  type: 'open' | 'inviteOnly' | 'closed' | 'unknown';
  badgeId: number;
}

export interface BrawlerDefinition {
  gadgets: Gadget[];
  name: {}; 
  id: number;
  starPowers: StarPower[];
}

export interface EventDetails {
  mode: string; 
  id: number;
  map: {} | null; 
}

export interface Battle {
  battleTime: string; 
  event: EventDetails;
  battle: {}; 
}

export interface PlayerRanking {
  club: { name: string } | {}; 
  trophies: number;
  icon: Icon;
  tag: string;
  name: string;
  rank: number;
  nameColor: string;
}

export interface ClubRanking {
  tag: string;
  name: string;
  trophies: number;
  rank: number;
  memberCount: number;
  badgeId: number;
}

export interface ScheduledEvent {
  event: {
    mode: string; 
    modifiers?: string[]; 
    id: number;
    map: {} | null; 
  };
  slotId: number;
  startTime: string; 
  endTime: string; 
}

export interface PagingCursors {
  before?: string;
  after?: string;
}

export interface BattleList {
  items: Battle[];
  paging: PagingCursors;
}

export interface ClubMemberList {
  items: ClubMember[];
  paging: PagingCursors;
}

export interface BrawlerList {
  items: BrawlerDefinition[];
  paging: PagingCursors;
}

export interface PlayerRankingList {
  items: PlayerRanking[];
  paging: PagingCursors;
}

export interface ClubRankingList {
  items: ClubRanking[];
  paging: PagingCursors;
}

export interface ScheduledEvents {
    items: ScheduledEvent[]; 
}

export interface ClientError {
  reason: string;
  message: string;
  type: string;
  detail: object;
}

export interface PagingOptions {
  limit?: number;
  after?: string;
  before?: string;
} 