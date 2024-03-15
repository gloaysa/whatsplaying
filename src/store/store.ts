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
import { devtools } from "zustand/middleware";

const config = {
  PREFERRED_ORDER: localStorage.getItem("preferredOrder")?.split(",") ?? [],
  HIDE_LIBRARIES: localStorage.getItem("hideLibraries")?.split(",") ?? [],
  PLEX_TOKEN: localStorage.getItem("plexToken") ?? "",
};

interface UserStoreState {
  users: number;
  user: PlexUser | undefined;
  getUser: () => Promise<void>;
  configuration: {
    plexToken: string;
  };
}

export const useUserStore = create<UserStoreState>(
  devtools(
    (set, get: () => UserStoreState) => ({
      users: 0,
      user: undefined,
      getUser: async () => {
        const user = await getUser(get().configuration.plexToken);
        set({ user });
      },
      configuration: {
        plexToken: config.PLEX_TOKEN ?? "",
      },
    }),
    { name: "UserStore" },
  ) as any,
);

let commandId = 0;

export const useLibraryStore = create<LibraryState>(
  devtools(
    (set, get: () => LibraryState) => ({
      configuration: {
        librariesToHide:
          config.HIDE_LIBRARIES.map((device: string) =>
            device.trim().toLowerCase(),
          ) ?? [],
        plexToken: config.PLEX_TOKEN,
      },
      library: [],
      getLibrary: async (player: MediaPlayer) => {
        const library = await getLibrary(
          player,
          get().configuration.librariesToHide,
        );
        set({ library });
      },
      // ... other methods
    }),
    { name: "LibraryStore" },
  ) as any,
);
export const useMediaPlayerStore = create<MediaPlayerState>(
  devtools(
    (set, get: () => MediaPlayerState) => ({
      configuration: {
        devicesOrder:
          config.PREFERRED_ORDER.map((device: string) =>
            device.trim().toLowerCase(),
          ) ?? [],
        plexToken: config.PLEX_TOKEN ?? "",
      },
      mediaPlayers: [],
      selectedMediaPlayer: undefined,
      setSelectMediaPlayer: (player: MediaPlayer) => {
        set({ selectedMediaPlayer: player });
      },
      getMediaPlayers: async () => {
        const mediaPlayers = await getMediaPlayers(
          get().configuration.plexToken,
        );
        set({ mediaPlayers });
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
        const devicesOrder = get().configuration.devicesOrder;
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
            // sort by device order
            .sort((a, b) => {
              const aIndex = devicesOrder.indexOf(a.name.trim().toLowerCase());
              const bIndex = devicesOrder.indexOf(b.name.trim().toLowerCase());
              if (aIndex === -1 && bIndex === -1) {
                return 0;
              }
              if (aIndex === -1) {
                return 1;
              }
              if (bIndex === -1) {
                return -1;
              }
              return aIndex - bIndex;
            }) // sort by playing state
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
    }),
    { name: "MediaPlayerStore" },
  ) as any,
);
