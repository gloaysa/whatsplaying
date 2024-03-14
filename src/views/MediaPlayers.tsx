import React, { ReactNode } from "react";
import { MediaPlayer } from "../store/media-player.type";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { MediaDisplay } from "../components/MediaDisplay";
import { CircularProgress } from "@mui/material";

/**
 * Carousel component to display the media players.
 * Has arrows to navigate through the media players.
 * Takes the whole available width and height.
 */
export const MediaPlayers = ({
  mediaPlayers,
  setSelectedMediaPlayer,
}: {
  mediaPlayers: MediaPlayer[];
  setSelectedMediaPlayer: (player: MediaPlayer) => void;
}) => {
  const customRenderItem = (
    item: any,
    options?:
      | {
          isSelected: boolean;
          isPrevious: boolean;
        }
      | undefined,
  ): ReactNode => <item.type {...item.props} {...options} />;

  if (!mediaPlayers?.length) {
    return <CircularProgress />;
  }

  return (
    <Carousel
      showIndicators={false}
      showThumbs={false}
      renderItem={customRenderItem}
      className="presentation-mode"
      onChange={(index) => setSelectedMediaPlayer(mediaPlayers[index])}
      swipeable
    >
      {mediaPlayers.map((player) => (
        <MediaDisplay
          key={player.clientIdentifier}
          plexamp={player}
          isSelected={false}
        />
      ))}
    </Carousel>
  );
};
