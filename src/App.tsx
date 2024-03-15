import React, { useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import {
  useLibraryStore,
  useMediaPlayerStore,
  useUserStore,
} from "./store/store";
import { Box } from "@mui/material";
import { MediaPlayers } from "./views/MediaPlayers";
import MusicLibrary from "./views/MusicLibrary";
import { Configuration } from "./views/Configuration";

function App() {
  const {
    configuration: { plexToken },
  } = useUserStore((state) => state);
  const { mediaPlayers, selectedMediaPlayer, getMediaPlayers } =
    useMediaPlayerStore((state) => state);
  const { library, getLibrary } = useLibraryStore((state) => state);

  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!mediaPlayers?.length && plexToken) {
      getMediaPlayers();
    }
  }, [mediaPlayers, getMediaPlayers]);

  useEffect(() => {
    if (!library?.length && selectedMediaPlayer && plexToken) {
      getLibrary(selectedMediaPlayer);
    }
  }, [library, getLibrary, selectedMediaPlayer]);

  if (!plexToken) {
    setLocation("/config");
  }

  return (
    <Box>
      <Switch>
        <Route path="/config">
          <Configuration />
        </Route>

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
