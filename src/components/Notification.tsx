import { FunctionComponent } from "react";
import { Alert, Fade, Snackbar } from "@mui/material";
import { useMediaPlayerStore } from "../store/store";

export const Notification: FunctionComponent = () => {
  const { error: mediaPlayerError, removeError: removeMediaPlayerError } = useMediaPlayerStore((state) => state);

  const handleClose = (index: number) => {
    removeMediaPlayerError(index);
  };

  return (
    <>
      {mediaPlayerError.map((error, index) => (
        <Snackbar
          key={index}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={true}
          onClose={() => handleClose(index)}
          TransitionComponent={Fade}
          autoHideDuration={5000}
        >
          <Alert onClose={() => handleClose(index)} severity="error" variant="filled" sx={{ width: "100%" }}>
            {error}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};
