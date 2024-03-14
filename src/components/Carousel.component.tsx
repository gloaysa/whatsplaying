import { ReactNode } from "react";
import { MediaPlayer } from "../store/media-player.type";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { MediaDisplay } from "./MediaDisplay";

/**
 * Carousel component to display the media players.
 * Has arrows to navigate through the media players.
 * Takes the whole available width and height.
 * @param mediaPlayers
 */
export const MediaCarousel = ({
  mediaPlayers,
}: {
  mediaPlayers: MediaPlayer[];
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

  return (
    <Carousel
      showIndicators={false}
      showThumbs={false}
      renderItem={customRenderItem}
      className="presentation-mode"
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
