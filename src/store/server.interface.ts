export interface BaseMediaPlayerServer {
  client_identifier: string;
  protocol: string;
  port: number;
  uri: string;
}

/**
 * PlexUser interface
 */
export interface PlexUser {
  id: number;
  uuid: string;
  username: string;
  title: string;
  email: string;
  friendlyName: string;
  locale: string | null;
  confirmed: boolean;
  joinedAt: number;
  emailOnlyAuth: boolean;
  hasPassword: boolean;
  protected: boolean;
  thumb: string;
  authToken: string;
  mailingListStatus: string;
  mailingListActive: boolean;
  scrobbleTypes: string;
  country: string;
  subscription: {
    active: boolean;
    subscribedAt: string;
    status: string;
    paymentService: string;
    plan: string;
    features: string[];
  };
  subscriptionDescription: string;
  restricted: boolean;
  anonymous: string | null;
  home: boolean;
  guest: boolean;
  homeSize: number;
  homeAdmin: boolean;
  maxHomeSize: number;
  rememberExpiresAt: number;
  profile: {
    autoSelectAudio: boolean;
    defaultAudioLanguage: string;
    defaultSubtitleLanguage: string;
    autoSelectSubtitle: number;
    defaultSubtitleAccessibility: number;
    defaultSubtitleForced: number;
    watchedIndicator: number;
  };
  entitlements: string[];
  roles: string[];
  services: {
    identifier: string;
    endpoint: string;
    token: string;
    secret: string | null;
    status: string;
  }[];
  adsConsent: boolean;
  adsConsentSetAt: number;
  adsConsentReminderAt: number;
  experimentalFeatures: boolean;
  twoFactorEnabled: boolean;
  backupCodesCreated: boolean;
}

export interface PlexResource {
  name: string;
  product: string;
  productVersion: string;
  platform: string;
  platformVersion: string;
  device: string;
  clientIdentifier: string;
  createdAt: string;
  lastSeenAt: string;
  provides: "server" | "client;player;pubsub-player";
  ownerId: string | null;
  sourceTitle: string | null;
  publicAddress: string;
  accessToken: string | null;
  owned: boolean;
  home: boolean;
  synced: boolean;
  relay: boolean;
  presence: boolean;
  httpsRequired: boolean;
  publicAddressMatches: boolean;
  dnsRebindingProtection: boolean;
  natLoopbackSupported: boolean;
  connections: {
    protocol: string;
    address: string;
    port: number;
    uri: string;
    local: boolean;
    relay: boolean;
    IPv6: boolean;
  }[];
}

export interface PlexSonosResource {
  title: string;
  machineIdentifier: string;
  deviceClass: string;
  product: string;
  platform: string;
  platformVersion: string;
  protocol: string;
  protocolVersion: string;
  protocolCapabilities: string;
  lanIP: string;
}

/**
 * PlexSession interface
 */
export interface PlexSession {
  addedAt: number;
  art: string;
  duration: number;
  grandparentArt: string;
  grandparentGuid: string;
  grandparentKey: string;
  grandparentRatingKey: string;
  grandparentThumb: string;
  grandparentTitle: string;
  guid: string;
  index: number;
  key: string;
  lastViewedAt: number;
  librarySectionID: string;
  librarySectionKey: string;
  librarySectionTitle: string;
  musicAnalysisVersion: string;
  parentGuid: string;
  parentIndex: number;
  parentKey: string;
  parentRatingKey: string;
  parentStudio: string;
  parentThumb: string;
  parentTitle: string;
  parentYear: number;
  ratingCount: number;
  ratingKey: string;
  sessionKey: string;
  thumb: string;
  title: string;
  type: string;
  updatedAt: number;
  viewCount: number;
  viewOffset: number;
  Media: PlexMedia[];
  User: {
    id: string;
    thumb: string;
    title: string;
  };
  Player: PlexPlayer;
  Session: {
    id: string;
    bandwidth: number;
    location: string;
  };
}

interface PlexPlayer {
  address: string;
  device: string;
  machineIdentifier: string;
  platform: string;
  product: string;
  profile: string;
  remotePublicAddress: string;
  state: string;
  title: string;
  version: string;
}

interface PlexMedia {
  audioChannels: number;
  audioCodec: string;
  bitrate: number;
  container: string;
  duration: number;
  id: string;
  Part: PlexPart[];
}

interface PlexPart {
  container: string;
  duration: number;
  file: string;
  hasThumbnail: string;
  id: string;
  key: string;
  size: number;
  Stream: PlexStream[];
}

interface PlexStream {
  albumGain: string;
  albumPeak: string;
  albumRange: string;
  audioChannelLayout: string;
  bitDepth: number;
  bitrate: number;
  channels: number;
  codec: string;
  displayTitle: string;
  extendedDisplayTitle: string;
  gain: string;
  id: string;
  index: number;
  loudness: string;
  lra: string;
  peak: string;
  samplingRate: number;
  selected: boolean;
  streamType: number;
}
