import { BaseMediaPlayerServer } from "./server.interface";

export type MediaPlayerState = {
  configuration: {
    devicesOrder: string[];
    plexToken: string;
  };
  error: string[];
  removeError: (index: number) => void;
  mediaPlayers: MediaPlayer[];
  selectedMediaPlayer: MediaPlayer | undefined;
  setSelectMediaPlayer: (player: MediaPlayer) => void;
  getMediaPlayers: () => Promise<void>;
  play: (player: MediaPlayer) => Promise<void>;
  pause: (player: MediaPlayer) => Promise<void>;
  update: (player: MediaPlayer) => Promise<void>;
  nextTrack: (player: MediaPlayer) => Promise<void>;
  previousTrack: (player: MediaPlayer) => Promise<void>;
  setShuffle: (player: MediaPlayer, shuffle: boolean) => Promise<void>;
  setRepeat: (player: MediaPlayer) => Promise<void>;
  muteVolume: (player: MediaPlayer) => Promise<void>;
  setVolumeLevel: (player: MediaPlayer, volume: number) => Promise<void>;
  getLyrics: (player: MediaPlayer) => Promise<Lyrics | undefined>;
  setShowLyrics: (show: boolean) => void;
  showLyrics: boolean;
  // ... other methods
};

export type MediaPlayer = {
  name: string;
  product: string;
  productVersion: string;
  clientIdentifier: string;
  protocol: string;
  address: string;
  port: number;
  uri: string;
  token: string;
  server: BaseMediaPlayerServer;
  state: "playing" | "paused" | "stopped" | "unknown";
  shuffle: "0" | "1";
  repeat: "0" | "1" | "2";
  volume_level: number;
  is_volume_muted: boolean;
  type?: string;
  itemType?: string;
  duration: number;
  time: number;
  ratingKey?: number;
  key?: string;
  containerKey?: string;
  machineIdentifier?: string;
  controllable?: string;
  volume?: number;
  playQueueID?: number;
  playQueueVersion?: number;
  playQueueItemID?: number;
  metadata?: MetadataFlat;
  queue?: Queue;
};

export type MetadataFlat = MetaData<Media<Part<Stream>>>;
export type MetadataWithChildren = MetaData<[Media<[Part<[Stream]>]>]>;

export type MetaData<T> = {
  addedAt: number;
  duration: number;
  attribution?: string;
  grandparentGuid: string;
  grandparentKey: string;
  grandparentRatingKey: string;
  grandparentThumb: string;
  grandparentTitle: string;
  guid: string;
  index: number;
  key: string;
  lastViewedAt: number;
  librarySectionID: number;
  librarySectionKey: string;
  librarySectionTitle: string;
  musicAnalysisVersion: string;
  parentGuid: string;
  parentIndex: number;
  parentKey: string;
  parentRatingKey: string;
  parentThumb: string;
  parentTitle: string;
  parentYear: number;
  playQueueItemID: number;
  ratingCount: number;
  ratingKey: string;
  skipCount: number;
  summary: string;
  thumb: string;
  title: string;
  type: string;
  updatedAt: number;
  viewCount: number;
  Media: T;
};

type Media<T> = {
  audioChannels: number;
  audioCodec: string;
  bitrate: number;
  container: string;
  duration: number;
  id: number;
  Part: T;
};

type Part<T> = {
  container: string;
  duration: number;
  file: string;
  hasThumbnail: string;
  id: number;
  key: string;
  size: number;
  Stream: T;
};

interface Stream {
  id: number;
  key: string;
  streamType: number;
  codec: string;
  format: string;
  provider: string;
  displayTitle: string;
  extendedDisplayTitle: string;
}

export type Queue = {
  identifier: string;
  mediaTagPrefix: string;
  mediaTagVersion: number;
  playQueueID: number;
  playQueuePlaylistID: number;
  playQueuePlaylistTitle: string;
  playQueueSelectedItemID: number;
  playQueueSelectedItemOffset: number;
  playQueueSelectedMetadataItemID: string;
  playQueueShuffled: boolean;
  playQueueTotalCount: number;
  playQueueVersion: number;
  Metadata: [MetadataWithChildren];
};

export type Lyrics = {
  Line: {
    startOffset: number;
    endOffset: number;
    Span: {
      text: string;
      startOffset: number;
      endOffset: number;
    }[];
  }[];
  author: string;
  by: string;
  minLines: number;
  provider: string;
  timed: boolean;
};
