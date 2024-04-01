import { FunctionComponent } from "react";
import { Box, Container, IconButton, Typography } from "@mui/material";
import LyricsIcon from "@mui/icons-material/Lyrics";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";

interface IMediaControlsProps {
  showLyrics: () => void;
  showAlbums: () => void;
  isLyricsVisible: boolean;
  offset: number;
  onOffsetChange: (off: number) => void;
}

/**
 * Returns a component displaying the title, album, and artist of a media item
 */
export const ExtraMediaControls: FunctionComponent<IMediaControlsProps> = ({
  showAlbums,
  showLyrics,
  isLyricsVisible,
  offset,
  onOffsetChange,
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
        {isLyricsVisible && (
          <>
            <IconButton color="primary" aria-label="increase lyric offset" onClick={() => onOffsetChange(offset + 10)}>
              <AddIcon />
            </IconButton>
            <Typography variant="body1" sx={{ paddingRight: "10px" }}>
              {offset}ms
            </Typography>
            <IconButton color="primary" aria-label="decrease lyric offset" onClick={() => onOffsetChange(offset - 10)}>
              <RemoveIcon />
            </IconButton>
          </>
        )}

        <IconButton color="primary" aria-label="show lyrics" onClick={() => showLyrics()}>
          <LyricsIcon />
        </IconButton>

        <IconButton color="primary" aria-label="show albums" onClick={() => showAlbums()}>
          <LibraryMusicIcon />
        </IconButton>
      </Box>
    </Container>
  );
};
