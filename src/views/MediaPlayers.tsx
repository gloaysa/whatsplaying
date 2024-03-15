import React, { FunctionComponent, ReactNode } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { MediaDisplay } from "../components/MediaDisplay";
import { useMediaPlayerStore } from "../store/store";
import { Spinner } from "../components/Spinner";

/**
 * Carousel component to display the media players.
 * Has arrows to navigate through the media players.
 * Takes the whole available width and height.
 */
export const MediaPlayers: FunctionComponent = () => {
  const { mediaPlayers } = useMediaPlayerStore((state) => state);
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
    return <Spinner open />;
  }

  return (
    <Carousel
      showIndicators={false}
      showThumbs={false}
      renderItem={customRenderItem}
      className="presentation-mode"
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
