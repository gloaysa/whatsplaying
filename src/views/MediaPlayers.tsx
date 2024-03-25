import { FunctionComponent, ReactNode, useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { MediaDisplay } from "../components/MediaDisplay";
import { useMediaPlayerStore } from "../store/store";
import { Spinner } from "../components/Spinner";
import { useLocation } from "wouter";

/**
 * Carousel component to display the media players.
 * Has arrows to navigate through the media players.
 * Takes the whole available width and height.
 */
export const MediaPlayers: FunctionComponent = () => {
  const {
    mediaPlayers,
    getMediaPlayers,
    configuration: { plexToken, albumsOnTimeout },
    selectedMediaPlayer,
  } = useMediaPlayerStore((state) => state);
  const [, setLocation] = useLocation();
  const [showAlbumTimeout, setShowAlbumTimeout] = useState<NodeJS.Timeout | undefined>();

  useEffect(() => {
    if (!mediaPlayers?.length && plexToken) {
      getMediaPlayers();
    }
  }, [mediaPlayers, getMediaPlayers]);

  useEffect(() => {
    // if no player has been playing for 60 sec, redirect to /albums
    if ((albumsOnTimeout && selectedMediaPlayer?.state === "stopped") || selectedMediaPlayer?.state === "unknown") {
      setShowAlbumTimeout(
        setTimeout(() => {
          setLocation("/albums");
        }, 5000),
      );
    } else {
      if (showAlbumTimeout) {
        clearTimeout(showAlbumTimeout);
      }
    }

    // clean up on destroy
    return () => {
      if (showAlbumTimeout) {
        clearTimeout(showAlbumTimeout);
      }
    };
  }, [selectedMediaPlayer?.state]);

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
      showStatus={false}
    >
      {mediaPlayers.map((player) => (
        <MediaDisplay key={player.clientIdentifier} plexamp={player} isSelected={false} />
      ))}
    </Carousel>
  );
};
