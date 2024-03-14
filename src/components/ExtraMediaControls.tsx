import { FunctionComponent } from "react";
import { Box, Container, IconButton } from "@mui/material";
import LyricsIcon from "@mui/icons-material/Lyrics";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";

interface IMediaControlsProps {
  showLyrics: () => void;
  showAlbums: () => void;
}

/**
 * Returns a component displaying the title, album, and artist of a media item
 */
export const ExtraMediaControls: FunctionComponent<IMediaControlsProps> = ({
  showAlbums,
  showLyrics,
}) => {
  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "row" },
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <IconButton
          color="primary"
          aria-label="show lyrics"
          onClick={() => showLyrics()}
        >
          <LyricsIcon />
        </IconButton>
        <IconButton
          color="primary"
          aria-label="show albums"
          onClick={() => showAlbums()}
        >
          <LibraryMusicIcon />
        </IconButton>
      </Box>
    </Container>
  );
};
