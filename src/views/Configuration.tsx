import React, { FormEvent, FunctionComponent, useEffect, useState } from "react";
import { Box, Button, Card, CardContent, Grid, InputAdornment, Switch, TextField, Typography } from "@mui/material";

export const Configuration: FunctionComponent = () => {
  const [plexToken, setPlexToken] = useState("");
  const [hideLibraries, setHideLibraries] = useState([""]);
  const [preferredOrder, setPreferredOrder] = useState([""]);
  const [autoDisplayAlbums, setAutoDisplayAlbums] = useState(false);
  const [intervalBetweenAlbums, setIntervalBetweenAlbums] = useState(30);

  useEffect(() => {
    // Load configuration from localStorage and set the state
    const storedPlexToken = localStorage.getItem("plexToken");
    const storedHideLibraries = localStorage.getItem("hideLibraries");
    const storedPreferredOrder = localStorage.getItem("preferredOrder");
    const storedAutoDisplayAlbums = localStorage.getItem("autoDisplayAlbums");
    const storedIntervalBetweenAlbums = localStorage.getItem("intervalBetweenAlbums");

    if (storedPlexToken) setPlexToken(storedPlexToken);
    if (storedHideLibraries) setHideLibraries(storedHideLibraries.split(","));
    if (storedPreferredOrder) setPreferredOrder(storedPreferredOrder.split(","));
    if (storedAutoDisplayAlbums) setAutoDisplayAlbums(storedAutoDisplayAlbums === "true");
    if (storedIntervalBetweenAlbums) setIntervalBetweenAlbums(Number(storedIntervalBetweenAlbums));
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    //
    event.preventDefault();
    localStorage.setItem("plexToken", plexToken.trimStart().trimEnd());
    localStorage.setItem("hideLibraries", hideLibraries.join(","));
    localStorage.setItem("preferredOrder", preferredOrder.join(","));
    localStorage.setItem("albumsTimeout", autoDisplayAlbums.toString());
    localStorage.setItem("intervalBetweenAlbums", intervalBetweenAlbums.toString());
    window.location.assign("/");
  };

  const handleAddField = (setter: React.Dispatch<React.SetStateAction<string[]>>, fields: string[]) => {
    setter([...fields, ""]);
  };

  const handleRemoveField = (
    index: number,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    fields: string[],
  ) => {
    setter(fields.filter((_, i) => i !== index));
  };

  const handleFieldChange = (
    index: number,
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    fields: string[],
  ) => {
    const newFields = [...fields];
    newFields[index] = value;
    setter(newFields);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "10%",
        padding: "2%",
      }}
    >
      <Card sx={{ minWidth: "50%" }}>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <Typography variant="body1" sx={{ paddingBottom: "15px" }}>
              What's Playing can be customized to suit your needs by setting some configurations, like what Plex
              libraries you would like to hide from your Album showcase (you maybe have a library of type music for
              audiobooks or Christmas music to not have it merged with your normal music), what order you would like to
              display your media players in (maybe you are using this for an specific room and the speaker in that room
              should have precedence over all others), and your Plex Token (depending on the user of the token, you will
              display the info when they are plugin music).
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Plex Token"
                  value={plexToken}
                  onChange={(e) => setPlexToken(e.target.value)}
                  required
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6">Hide Libraries</Typography>
                <Typography variant="body1" sx={{ paddingBottom: "5px" }}>
                  For example, if you have libraries named "Music", "AudioBooks" and "Podcasts" and you want to hide the
                  "AudioBooks" and "Podcasts" libraries, you would will add two new entries with names of each library.
                </Typography>
                {hideLibraries.map((lib, index) => (
                  <Box key={index} sx={{ marginBottom: "1%" }}>
                    <TextField
                      value={lib}
                      onChange={(e) => handleFieldChange(index, e.target.value, setHideLibraries, hideLibraries)}
                      fullWidth
                    />
                    <Button onClick={() => handleRemoveField(index, setHideLibraries, hideLibraries)}>-</Button>
                  </Box>
                ))}
                <Button onClick={() => handleAddField(setHideLibraries, hideLibraries)}>
                  Add a new library to hide
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6">Preferred Order</Typography>
                <Typography variant="body1" sx={{ paddingBottom: "5px" }}>
                  List the device's names in the order you prefer them to be displayed. For example, if you have devices
                  named "Living Room", "Bedroom", and "Kitchen" and you want them to be displayed in that order, you
                  would add a new entry in said order for each device. If none of them are playing, but you have another
                  device playing, the currently playing will be displayed by default. As soon as any of your favorite
                  devices start playing, it will be displayed instead.
                </Typography>
                {preferredOrder.map((order, index) => (
                  <Box key={index} sx={{ marginBottom: "1%" }}>
                    <TextField
                      value={order}
                      onChange={(e) => handleFieldChange(index, e.target.value, setPreferredOrder, preferredOrder)}
                      fullWidth
                    />
                    <Button onClick={() => handleRemoveField(index, setPreferredOrder, preferredOrder)}>-</Button>
                  </Box>
                ))}
                <Button onClick={() => handleAddField(setPreferredOrder, preferredOrder)}>Add a new device</Button>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body1" sx={{ paddingBottom: "5px" }}>
                  When none of your media players are playing or paused, your album gallery will be displayed in the
                  carousel. Disabled by default, you can enable this behaviour below.
                </Typography>
                <Switch
                  value={autoDisplayAlbums}
                  aria-label="display albums when all stopped"
                  onChange={(e) => setAutoDisplayAlbums(e.target.checked)}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body1" sx={{ paddingBottom: "5px" }}>
                  Time in seconds for the carousel to switch between albums. Default is 30 seconds.
                </Typography>
                <TextField
                  value={intervalBetweenAlbums}
                  type="number"
                  aria-label="display albums when all stopped"
                  onChange={(e) => setIntervalBetweenAlbums(Number(e.target.value ?? 30))}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">seconds</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Button type="submit" fullWidth variant="contained" disabled={!plexToken}>
                  Save
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </form>
      </Card>
    </Box>
  );
};
