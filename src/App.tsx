import { Route, Switch, useLocation } from "wouter";
import { useUserStore } from "./store/store";
import { Box } from "@mui/material";
import { MediaPlayers } from "./views/MediaPlayers";
import MusicLibrary from "./views/MusicLibrary";
import { Configuration } from "./views/Configuration";
import { Notification } from "./components/Notification";

function App() {
  const {
    configuration: { plexToken },
  } = useUserStore((state) => state);

  const [, setLocation] = useLocation();

  if (!plexToken) {
    setLocation("/config");
  }

  return (
    <Box>
      <Notification />
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
