import React from "react";
import { LibraryItem } from "../store/library.interface";
import {
  CircularProgress,
  Container,
  IconButton,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { Carousel } from "react-responsive-carousel";
import { AlbumCover } from "../components/AlbumCover";
import { useLocation } from "wouter";

interface MusicLibraryProps {
  library: LibraryItem[];
}

const MusicLibrary: React.FC<MusicLibraryProps> = ({ library }) => {
  const [, setLocation] = useLocation();

  if (!library?.length) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Carousel
        showThumbs={false}
        showIndicators={false}
        centerMode
        autoPlay
        infiniteLoop
        swipeable
        interval={30000}
        transitionTime={5000}
      >
        {library[0].Metadata.map((album) => (
          <Container key={album.key}>
            <AlbumCover mediaUrl={album.thumb} />
            <Grid
              container
              className="legend"
              justifyContent="space-between"
              alignItems="center"
            >
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
