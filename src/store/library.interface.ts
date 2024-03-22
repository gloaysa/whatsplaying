import { MediaPlayer } from "./media-player.type";

export type LibraryState = {
  configuration: {
    librariesToHide: string[];
    plexToken: string;
    intervalBetweenAlbums: number;
  };
  library: LibraryItem[];
  getLibrary: (player: MediaPlayer) => Promise<void>;
};

export interface Library {
  MediaContainer: MediaContainer;
}

interface MediaContainer {
  size: number;
  allowSync: boolean;
  title1: string;
  Directory: Directory[];
}

interface Directory {
  allowSync: boolean;
  art: string;
  composite: string;
  filters: boolean;
  refreshing: boolean;
  thumb: string;
  key: string;
  type: "movie" | "artist" | "show";
  title: string;
  agent: string;
  scanner: string;
  language: string;
  uuid: string;
  updatedAt: number;
  createdAt: number;
  scannedAt: number;
  content: boolean;
  directory: boolean;
  contentChangedAt: number;
  hidden: number;
  Location: Location[];
}

interface Location {
  id: number;
  path: string;
}

export interface LibraryItem {
  size: number;
  totalSize: number;
  offset: number;
  allowSync: boolean;
  art: string;
  identifier: string;
  librarySectionID: number;
  librarySectionTitle: string;
  librarySectionUUID: string;
  mediaTagPrefix: string;
  mediaTagVersion: number;
  nocache: boolean;
  thumb: string;
  title1: string;
  title2: string;
  viewGroup: string;
  viewMode: number;
  Metadata: {
    ratingKey: string;
    key: string;
    parentRatingKey: string;
    guid: string;
    parentGuid: string;
    studio: string;
    type: string;
    title: string;
    parentKey: string;
    parentTitle: string;
    index: number;
    rating: number;
    thumbBlurHash: string;
    year: number;
    thumb: string;
    art: string;
    parentThumb: string;
    originallyAvailableAt: string;
    addedAt: number;
    updatedAt: number;
    loudnessAnalysisVersion: string;
    musicAnalysisVersion: string;
    mediaCount: number;
    mediaCountOptimized: number;
    Genre?: {
      tag: string;
    }[];
  }[];
}
