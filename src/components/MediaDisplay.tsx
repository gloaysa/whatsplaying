import { FunctionComponent, useEffect, useState } from "react";
import { Lyrics, MediaPlayer } from "../store/media-player.type";
import { AlbumCover } from "./AlbumCover";
import { MediaControls } from "./MediaControls";
import { useMediaPlayerStore } from "../store/store";
import LyricsDisplay from "./Lyrics";

interface IMediaPlayerProps {
  plexamp: MediaPlayer;
  isSelected: boolean;
}
export const MediaDisplay: FunctionComponent<IMediaPlayerProps> = ({
  plexamp,
  isSelected,
}) => {
  const { update, getLyrics } = useMediaPlayerStore((state) => state);
  useEffect(() => {}, [isSelected, plexamp, update]);
  const [lyrics, setLyrics] = useState<Lyrics | undefined>();
  const [showLyrics, setShowLyrics] = useState(false);

  /**
   * Function that updates the media player state the first time the component is mounted.
   * If the media player is selected, it will update the state every 5 seconds.
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

  useEffect(() => {
    // when the media player changes, get the lyrics for the new media player
    getLyrics(plexamp).then((lyr) => {
      setLyrics(lyr);
    });
  }, [getLyrics, plexamp.metadata?.playQueueItemID]);

  return (
    <div>
      {lyrics && showLyrics && (
        <LyricsDisplay lyrics={lyrics} mediaPlayer={plexamp} />
      )}
      <AlbumCover mediaUrl={plexamp.metadata?.thumb} />
      <div className="legend">
        <MediaControls
          plexamp={plexamp}
          showLyrics={() => setShowLyrics(!showLyrics)}
        />
      </div>
    </div>
  );
};
