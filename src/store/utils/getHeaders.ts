import { MediaPlayer } from "../media-player.type";

export const mediaPlayerHeaders = (player: MediaPlayer) => ({
  "X-Plex-Version": player.productVersion,
  "X-Plex-Product": player.product,
  "X-Plex-Target-Client-Identifier": player.clientIdentifier,
  "X-Plex-Device-Name": player.name,
  "X-Plex-Token": player.token,
  "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
  Accept: "application/json",
  "X-Plex-Client-Identifier": "Plex-Client-Identifier",
});
