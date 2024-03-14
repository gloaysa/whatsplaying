import React, { useEffect } from "react";
import "./App.css";
import { useMediaPlayerStore } from "./store/store";
import { CircularProgress } from "@mui/material";
import { MediaCarousel } from "./components/Carousel.component";

function App() {
  const { mediaPlayers, getMediaPlayers } = useMediaPlayerStore(
    (state) => state,
  );

  useEffect(() => {
    // sorts the media players by state playing first
    mediaPlayers.sort((a, b) => {
      if (a.state === "playing") {
        return -1;
      }
      if (b.state === "playing") {
        return 1;
      }
      return 0;
    });
  }, [mediaPlayers]);
  useEffect(() => {
    if (!mediaPlayers?.length) {
      getMediaPlayers();
    }
  }, [mediaPlayers, getMediaPlayers]);

  if (!mediaPlayers?.length) {
    return <CircularProgress />;
  }

  return (
    <div
      className="App"
      style={{
        backgroundColor: "black",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <MediaCarousel mediaPlayers={mediaPlayers} />
    </div>
  );
}

export default App;
