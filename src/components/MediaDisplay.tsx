import { FunctionComponent, useEffect, useState } from "react";
import { Lyrics, MediaPlayer } from "../store/media-player.type";
import { AlbumCover } from "./AlbumCover";
import { MediaControls } from "./MediaControls";
import { useMediaPlayerStore } from "../store/store";
import LyricsDisplay from "./Lyrics";
import { ExtraMediaControls } from "./ExtraMediaControls";
import { useLocation } from "wouter";
// @ts-expect-error - color-thief-ts is not typed
import ColorThief from "color-thief-ts";

interface IMediaPlayerProps {
  plexamp: MediaPlayer;
  isSelected: boolean;
}

export const MediaDisplay: FunctionComponent<IMediaPlayerProps> = ({ plexamp, isSelected }) => {
  const { update, getLyrics, setSelectMediaPlayer, setShowLyrics, showLyrics } = useMediaPlayerStore((state) => state);
  useEffect(() => {}, [isSelected, plexamp, update]);
  const [lyrics, setLyrics] = useState<Lyrics | undefined>();
  const [isInteracting, setIsInteracting] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | undefined>();
  const [backgroundGradient, setBackgroundGradient] = useState("");

  const [, setLocation] = useLocation();

  /**
   * Function that updates the media player state the first time the component is mounted.
   * If the media player is selected, it will update the state every second.
   * Else, it will update the state every 60 seconds.
   */
  useEffect(() => {
    async function updateState() {
      await update(plexamp);
    }
    updateState();
    const interval = setInterval(updateState, isSelected ? 1000 : 60000);
    return () => clearInterval(interval);
  }, [isSelected, update]);

  /**
   * When the media player is selected in the carousel, set the selected media player in the store.
   */
  useEffect(() => {
    if (isSelected) {
      setSelectMediaPlayer(plexamp);
    }
  }, [isSelected]);

  useEffect(() => {
    const colorThief = new ColorThief();

    if (plexamp.metadata?.thumb) {
      colorThief
        .getPaletteAsync(plexamp.metadata.thumb, 4, { quality: 1, colorType: "array" }) // Request 4 colors for the 4 gradients
        .then((palette: [[number, number, number, number]]) => {
          // Convert each RGB array to a RGBA string with 80% opacity
          const gradientColors = palette.map((rgb) => `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.8)`);

          // Create 4 radial gradients, each with a different color and position
          const gradients = [
            `radial-gradient(circle at left bottom, ${gradientColors[0]} 0px, transparent 80%)`,
            `radial-gradient(circle at right bottom, ${gradientColors[1]} 0px, transparent 80%)`,
            `radial-gradient(circle at right top, ${gradientColors[2]} 0px, transparent 80%)`,
            `radial-gradient(circle at left top, ${gradientColors[3]} 0px, transparent 80%)`,
          ];

          // Join the gradients into a single background image
          const backgroundImage = gradients.join(", ");

          setBackgroundGradient(backgroundImage);
        })
        .catch((error: Error) => console.error(error));
    }
  }, [plexamp.metadata?.thumb]);

  /**
   * If the user is not interacting with the page for 5 seconds, hide the media controls.
   */
  const handleInteraction = () => {
    clearTimeout(timeoutId);
    setIsInteracting(true);
    setTimeoutId(setTimeout(() => setIsInteracting(false), 5000));
  };

  useEffect(() => {
    // when the media player changes, get the lyrics for the new media player
    getLyrics(plexamp).then((lyr) => {
      setLyrics(lyr);
    });
  }, [getLyrics, plexamp.metadata?.playQueueItemID]);

  return (
    <div
      onMouseMove={handleInteraction}
      onTouchMove={handleInteraction}
      style={{ height: "100vh", backgroundImage: backgroundGradient }}
    >
      {lyrics && isSelected && showLyrics && <LyricsDisplay lyrics={lyrics} mediaPlayer={plexamp} />}
      <AlbumCover mediaUrl={plexamp.metadata?.thumb} />
      {isInteracting && (
        <div className="legend">
          <ExtraMediaControls showLyrics={() => setShowLyrics(!showLyrics)} showAlbums={() => setLocation("/albums")} />
          <MediaControls plexamp={plexamp} />
        </div>
      )}
    </div>
  );
};
