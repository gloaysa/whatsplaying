import { MediaPlayer } from "../store/media-player.type.ts";

export const mockMediaPlayer: MediaPlayer = {
  name: "Mock Player",
  product: "Mock Product",
  productVersion: "1.0.0",
  clientIdentifier: "mock1",
  protocol: "http",
  address: "localhost",
  port: 3000,
  uri: "http://localhost:3000",
  token: "mock-token",
  server: {
    uri: "http://localhost:3000",
    client_identifier: "Mock Server",
    protocol: "http",
    port: 5000,
  },
  state: "playing",
  shuffle: "0",
  repeat: "0",
  volume_level: 50,
  is_volume_muted: false,
  duration: 0,
  time: 0,
};
