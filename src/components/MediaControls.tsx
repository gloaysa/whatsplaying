import { FunctionComponent } from "react";
import { Box, CircularProgress, Container, IconButton, LinearProgress, Slider, Typography } from "@mui/material";
import { Pause, PlayArrow, SkipNext, SkipPrevious } from "@mui/icons-material";
import { MediaPlayer } from "../store/media-player.type";
import { useMediaPlayerStore } from "../store/store";

interface IMediaControlsProps {
  plexamp: MediaPlayer;
}

/**
 * Returns a component displaying the title, album, and artist of a media item
 */
export const MediaControls: FunctionComponent<IMediaControlsProps> = ({ plexamp }) => {
  const { play, pause, nextTrack, previousTrack, setVolumeLevel } = useMediaPlayerStore((state) => state);

  if (!plexamp) {
    return <CircularProgress />;
  }

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box // Song information
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "flex-start",
            columnGap: 5,
          }}
        >
          {plexamp.metadata && (
            <Container>
              <Typography align="left" variant="h6">
                {plexamp.metadata?.title}
              </Typography>
              <Typography align="left" variant="subtitle2">
                by {plexamp.metadata?.grandparentTitle}
              </Typography>
            </Container>
          )}
        </Box>

        <Box>
          <Box // control player
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <IconButton color="primary" aria-label="previous" onClick={() => previousTrack(plexamp)}>
              <SkipPrevious sx={{ fontSize: "2rem", width: "3rem", height: "3rem" }} />
            </IconButton>
            {plexamp.state === "playing" ? (
              <IconButton color="primary" aria-label="pause" onClick={() => pause(plexamp)}>
                <Pause sx={{ fontSize: "2rem", width: "3rem", height: "3rem" }} />
              </IconButton>
            ) : (
              <IconButton
                color="primary"
                sx={{ fontSize: "2rem", width: "3rem", height: "3rem" }}
                aria-label="play"
                onClick={() => play(plexamp)}
              >
                <PlayArrow sx={{ fontSize: "2rem", width: "3rem", height: "3rem" }} />
              </IconButton>
            )}

            <IconButton color="primary" aria-label="next" onClick={() => nextTrack(plexamp)}>
              <SkipNext sx={{ fontSize: "2rem", width: "3rem", height: "3rem" }} />
            </IconButton>
          </Box>
          <Box // volume control
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              justifyContent: "space-around",
              flexWrap: "wrap",
            }}
          >
            <Slider
              step={1}
              aria-label="volume"
              value={plexamp.volume_level}
              min={0}
              max={100}
              onChange={(_, value) => setVolumeLevel(plexamp, value as number)}
            />
            <Typography variant="subtitle2">{plexamp.name}</Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ width: "100%" }}>
        <LinearProgress variant="determinate" value={(plexamp.time / plexamp.duration) * 100} />
      </Box>
    </Container>
  );
};
