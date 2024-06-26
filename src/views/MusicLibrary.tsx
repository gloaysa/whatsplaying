import React, { useEffect } from "react";
import { Box, Container, Grid, IconButton, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { Carousel } from "react-responsive-carousel";
import { AlbumCover } from "../components/AlbumCover";
import { useLocation } from "wouter";
import { useLibraryStore, useMediaPlayerStore, useUserStore } from "../store/store";
import { Spinner } from "../components/Spinner";

const MusicLibrary: React.FC = () => {
  const { library, getLibrary } = useLibraryStore((state) => state);
  const {
    configuration: { plexToken, intervalBetweenAlbums },
  } = useUserStore((state) => state);
  const { selectedMediaPlayer } = useMediaPlayerStore((state) => state);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!library?.length && selectedMediaPlayer && plexToken) {
      getLibrary(selectedMediaPlayer);
    }
  }, [library, getLibrary, selectedMediaPlayer]);

  if (!selectedMediaPlayer) {
    setLocation("/");
  }

  if (!library?.length) {
    return <Spinner open />;
  }

  return (
    <Box sx={{ backgroundColor: "black" }}>
      <Carousel
        showThumbs={false}
        showIndicators={false}
        centerMode
        autoPlay
        infiniteLoop
        swipeable
        interval={intervalBetweenAlbums * 1000}
      >
        {library[0].Metadata.map((album) => (
          <Container key={album.key}>
            <AlbumCover mediaUrl={album.thumb} />
            <Grid container className="legend" justifyContent="space-between" alignItems="center">
              <IconButton onClick={() => setLocation("/")}>
                <ArrowBack color="secondary" fontSize="large" />
              </IconButton>
              <Box>
                <Typography variant="h5" color="white">
                  {album.title}
                </Typography>
                <Typography variant="subtitle1" color="white">
                  {album.parentTitle}
                </Typography>
              </Box>
              <div /> {/* Empty div for spacing */}
            </Grid>
          </Container>
        ))}
      </Carousel>
    </Box>
  );
};

export default MusicLibrary;
