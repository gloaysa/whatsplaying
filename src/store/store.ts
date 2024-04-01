import { create } from "zustand";
import { PlexUser } from "./server.interface";
import { Lyrics, MediaPlayer, MediaPlayerState } from "./media-player.type";
import { getLyrics, sendPlayBackCommand, setParameterCommand, updateMediaPlayer } from "./media_player";
import { getMediaPlayers, getUser } from "./server";
import { getLibrary } from "./library";
import { LibraryState } from "./library.interface";
import { devtools } from "zustand/middleware";
import { IConfig, loadConfig } from "./utils/fetchConfig.ts";

interface UserStoreState {
  users: number;
  user: PlexUser | undefined;
  getUser: () => Promise<void>;
  loadConfig: () => Promise<IConfig>;
  configuration: IConfig;
  errors: {
    code: number;
    message: string;
    status: number;
  }[];
}

export const useUserStore = create<UserStoreState>(
  devtools(
    (set, get: () => UserStoreState) => ({
      users: 0,
      user: undefined,
      errors: [],
      getUser: async () => {
        const user = await getUser(get().configuration.plexToken);
        if (user.errors?.length) {
          set({ errors: [...get().errors, user.errors[0]] });
        }
        set({ user });
      },
      loadConfig: async () => {
        const configuration = await loadConfig();
        set({ configuration });
        return configuration;
      },
      configuration: {
        preferredOrder: [],
        hideLibraries: [],
        plexToken: "",
        autoDisplayAlbums: false,
        intervalBetweenAlbums: 30,
        loaded: false,
      },
    }),
    { name: "UserStore" },
  ) as never,
);

let commandId = 0;

export const useLibraryStore = create<LibraryState>(
  devtools(
    (set) => ({
      library: [],
      getLibrary: async (player: MediaPlayer) => {
        const library = await getLibrary(player, useUserStore.getState().configuration.hideLibraries);
        set({ library });
      },
      // ... other methods
    }),
    { name: "LibraryStore" },
  ) as never,
);
export const useMediaPlayerStore = create<MediaPlayerState>(
  devtools(
    (set, get: () => MediaPlayerState) => ({
      error: [],
      removeError: (index: number) => {
        const error = get().error.filter((_, i) => i !== index);
        set({ error });
      },
      mediaPlayers: [],
      selectedMediaPlayer: undefined,
      setSelectMediaPlayer: (player: MediaPlayer) => {
        set({ selectedMediaPlayer: player });
      },
      getMediaPlayers: async () => {
        try {
          const mediaPlayers = await getMediaPlayers(useUserStore.getState().configuration.plexToken);
          set({ mediaPlayers });
        } catch (e: unknown) {
          if (e instanceof Error) {
            set({ error: [...get().error, e.message] });
            if (e.cause === "token") {
              setTimeout(() => {
                window.location.href = "/config";
              }, 5000);
            }
          }
        }
      },
      play: async (player: MediaPlayer): Promise<void> => {
        try {
          await sendPlayBackCommand(player, "play");
          await get().update(player);
        } catch (e: any) {
          set({ error: [...get().error, e.message] });
        }
      },
      pause: async (player: MediaPlayer): Promise<void> => {
        try {
          await sendPlayBackCommand(player, "pause");
          await get().update(player);
        } catch (e: any) {
          set({ error: [...get().error, e.message] });
        }
      },
      update: async (player: MediaPlayer): Promise<void> => {
        try {
          const devicesOrder = useUserStore.getState().configuration.preferredOrder;
          const updated = await updateMediaPlayer(player, commandId);
          if (updated.clientIdentifier === get().selectedMediaPlayer?.clientIdentifier) {
            set({ selectedMediaPlayer: updated });
          }
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
        } catch (e: any) {
          set({ error: [...get().error, e.message] });
        }
      },
      nextTrack: async (player: MediaPlayer): Promise<void> => {
        try {
          await sendPlayBackCommand(player, "skipNext");
          await get().update(player);
        } catch (e: any) {
          set({ error: [...get().error, e.message] });
        }
      },
      previousTrack: async (player: MediaPlayer): Promise<void> => {
        try {
          await sendPlayBackCommand(player, "skipPrevious");
          await get().update(player);
        } catch (e: any) {
          set({ error: [...get().error, e.message] });
        }
      },
      setShuffle: async (player: MediaPlayer): Promise<void> => {
        try {
          const shouldShuffle = player.shuffle === "1" ? "0" : "1";
          await sendPlayBackCommand(player, `shuffle=${shouldShuffle}`);
          await get().update(player);
        } catch (e: any) {
          set({ error: [...get().error, e.message] });
        }
      },
      setRepeat: async (player: MediaPlayer): Promise<void> => {
        try {
          let repeat = "0";
          if (player.repeat === "0") {
            repeat = "1";
          } else if (player.repeat === "1") {
            repeat = "2";
          }
          await sendPlayBackCommand(player, `repeat=${repeat}`);
          await get().update(player);
        } catch (e: any) {
          set({ error: [...get().error, e.message] });
        }
      },
      muteVolume: async (player: MediaPlayer): Promise<void> => {
        try {
          const mute = !player.is_volume_muted;
          await setParameterCommand(player, `mute=${mute ? "1" : "0"}`);
          await get().update(player);
        } catch (e: any) {
          set({ error: [...get().error, e.message] });
        }
      },
      setVolumeLevel: async (player: MediaPlayer, volume: number): Promise<void> => {
        try {
          await setParameterCommand(player, `volume=${volume}`);
          await get().update(player);
        } catch (e: any) {
          set({ error: [...get().error, e.message] });
        }
      },
      getLyrics: async (player: MediaPlayer): Promise<Lyrics | undefined> => {
        try {
          return getLyrics(player);
        } catch (e: any) {
          set({ error: [...get().error, e.message] });
        }
      },
      setShowLyrics: (show: boolean) => {
        localStorage.setItem("showLyrics", show.toString());
        set({ showLyrics: show });
      },
      showLyrics: localStorage.getItem("showLyrics") === "true",
      // ... other methods
    }),
    { name: "MediaPlayerStore" },
  ) as never,
);
