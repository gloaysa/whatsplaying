import { FunctionComponent } from "react";

interface IAlbumProps {
  mediaUrl: string | undefined;
}

export const AlbumCover: FunctionComponent<IAlbumProps> = ({ mediaUrl }) => {
  // returns the current height of the window
  const getHeight = () => {
    return window.innerHeight;
  };

  // changes the height of the image to the current height of the window
  const getMediaUrl = (url: string) => {
    const newUrl = new URL(url);
    newUrl.searchParams.set("height", getHeight().toString());
    return newUrl.toString();
  };

  if (!mediaUrl) {
    return null;
  }

  return (
    <div>
      <img style={{ objectFit: "contain" }} height={getHeight()} src={getMediaUrl(mediaUrl)} alt="album cover" />
    </div>
  );
};
