import { create } from "zustand";
import { PlexUser } from "./server.interface";
import { Lyrics, MediaPlayer, MediaPlayerState } from "./media-player.type";
import {
  getLyrics,
  sendPlayBackCommand,
  setParameterCommand,
  updateMediaPlayer,
} from "./media_player";
import { getMediaPlayers, getUser } from "./server";
import { getLibrary } from "./library";
import { LibraryState } from "./library.interface";

interface UserStore {
  users: 0;
  user: PlexUser | undefined;
  getUser: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  users: 0,
  user: undefined,
  getUser: async () => {
    const user = await getUser();
    set({ user });
  },
}));

let commandId = 0;

export const useLibraryStore = create<LibraryState>((set, get) => ({
  library: [],
  getLibrary: async (player: MediaPlayer) => {
    const library = await getLibrary(player);
    set({ library });
  },
  // ... other methods
}));
export const useMediaPlayerStore = create<MediaPlayerState>((set, get) => ({
  mediaPlayers: [],
  selectedMediaPlayer: undefined,
  setSelectMediaPlayer: (player: MediaPlayer) => {
    console.log("setSelectMediaPlayer", player?.name);
    set({ selectedMediaPlayer: player });
  },
  getMediaPlayers: async () => {
    const mediaPlayers = await getMediaPlayers();
    set({ mediaPlayers });
    if (!get().selectedMediaPlayer && mediaPlayers.length) {
      set({ selectedMediaPlayer: mediaPlayers[0] });
    }
  },
  play: async (player: MediaPlayer): Promise<void> => {
    await sendPlayBackCommand(player, "play");
    await get().update(player);
  },
  pause: async (player: MediaPlayer): Promise<void> => {
    await sendPlayBackCommand(player, "pause");
    await get().update(player);
  },
  update: async (player: MediaPlayer): Promise<void> => {
    const updated = await updateMediaPlayer(player, commandId);
    commandId += 1;
    set({
      mediaPlayers: get()
        .mediaPlayers.map((media_player) => {
          if (media_player.clientIdentifier === player.clientIdentifier) {
            return updated;
          }
          return media_player;
        })
        // sort by playing state
        .sort((a, b) => {
          if (a.state === "playing") {
            return -1;
          }
          if (b.state === "playing") {
            return 1;
          }
          return 0;
        }),
    });
  },
  nextTrack: async (player: MediaPlayer): Promise<void> => {
    await sendPlayBackCommand(player, "skipNext");
    await get().update(player);
  },
  previousTrack: async (player: MediaPlayer): Promise<void> => {
    await sendPlayBackCommand(player, "skipPrevious");
    await get().update(player);
  },
  setShuffle: async (player: MediaPlayer): Promise<void> => {
    const shouldShuffle = player.shuffle === "1" ? "0" : "1";
    await sendPlayBackCommand(player, `shuffle=${shouldShuffle}`);
    await get().update(player);
  },
  setRepeat: async (player: MediaPlayer): Promise<void> => {
    let repeat = "0";
    if (player.repeat === "0") {
      repeat = "1";
    } else if (player.repeat === "1") {
      repeat = "2";
    }
    await sendPlayBackCommand(player, `repeat=${repeat}`);
    await get().update(player);
  },
  muteVolume: async (player: MediaPlayer): Promise<void> => {
    const mute = !player.is_volume_muted;
    await setParameterCommand(player, `mute=${mute ? "1" : "0"}`);
    await get().update(player);
  },
  setVolumeLevel: async (
    player: MediaPlayer,
    volume: number,
  ): Promise<void> => {
    await setParameterCommand(player, `volume=${volume}`);
    await get().update(player);
  },
  getLyrics: async (player: MediaPlayer): Promise<Lyrics | undefined> => {
    return getLyrics(player);
  },
  // ... other methods
}));
