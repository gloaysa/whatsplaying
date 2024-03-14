import React, { useEffect } from "react";
import { Route, Switch } from "wouter";
import "./App.css";
import { useLibraryStore, useMediaPlayerStore } from "./store/store";
import { Box } from "@mui/material";
import { MediaPlayers } from "./views/MediaPlayers";
import MusicLibrary from "./views/MusicLibrary";

function App() {
  const { mediaPlayers, selectedMediaPlayer, getMediaPlayers } =
    useMediaPlayerStore((state) => state);
  const { library, getLibrary } = useLibraryStore((state) => state);

  useEffect(() => {
    if (!mediaPlayers?.length) {
      getMediaPlayers();
    }
  }, [mediaPlayers, getMediaPlayers]);

  useEffect(() => {
    if (!library?.length && selectedMediaPlayer) {
      getLibrary(selectedMediaPlayer);
    }
  }, [library, getLibrary, selectedMediaPlayer]);

  return (
    <Box
      sx={{
        backgroundColor: "black",
      }}
    >
      <Switch>
        <Route path="/inbox" />

        <Route path="/albums">
          <MusicLibrary />
        </Route>

        <Route path="/">
          <MediaPlayers />
        </Route>

        {/* Default route in a switch */}
        <Route>404: No such page!</Route>
      </Switch>
    </Box>
  );
}

export default App;
