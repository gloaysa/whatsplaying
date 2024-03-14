import { Container, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Lyrics, MediaPlayer } from "../store/media-player.type";

interface LyricsDisplayProps {
  lyrics: Lyrics;
  mediaPlayer: MediaPlayer;
}

const LyricsDisplay: React.FC<LyricsDisplayProps> = ({
  lyrics,
  mediaPlayer,
}) => {
  const [currentLine, setCurrentLine] = useState("");
  const [previousLines, setPreviousLines] = useState<string[]>([]);
  const [upcomingLines, setUpcomingLines] = useState<string[]>([]);

  // Function to set the current line and upcoming lines based on the given lyrics and current index
  const setCurrentAndUpcomingLines = (lyrics: Lyrics, currentIndex: number) => {
    const currentLineSpan = lyrics.Line[currentIndex]?.Span;
    if (currentLineSpan && currentLineSpan.length > 0) {
      setCurrentLine(currentLineSpan[0].text);
    }
    const nextLines = lyrics.Line.slice(
      currentIndex + 1,
      currentIndex + 11,
    ).map((line) => line.Span?.[0]?.text);
    setUpcomingLines(nextLines);
  };

  const setPreviousLinesFromIndex = (lyrics: Lyrics, currentIndex: number) => {
    const prevLines = lyrics.Line.slice(
      Math.max(0, currentIndex - 5),
      currentIndex,
    ).map((line) => line.Span?.[0]?.text);
    setPreviousLines(prevLines);
  };

  useEffect(() => {
    // Effect hook to reset the lyrics when they change
    setCurrentAndUpcomingLines(lyrics, 0);
    setPreviousLines([]);
  }, [lyrics]);

  useEffect(() => {
    // Effect hook to update the current line and previous lines based on the current time of the media player
    const currentTime = Number(mediaPlayer.time) + 1000; // add a second to compensate for the delay
    const currentIndex = lyrics.Line.findIndex(
      (line) =>
        currentTime >= line.startOffset && currentTime <= line.endOffset,
    );
    if (currentIndex !== -1) {
      setCurrentAndUpcomingLines(lyrics, currentIndex);

      setPreviousLinesFromIndex(lyrics, currentIndex);
    } else {
      setCurrentLine("...");
    }
  }, [mediaPlayer.time, lyrics]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        color: "white",
        overflow: "auto",
        padding: "50px",
      }}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          rowGap: "10px",
        }}
      >
        {previousLines.map((line, index) => (
          <Typography key={index} style={{ color: "grey" }} variant="h5">
            {line}
          </Typography>
        ))}
        <Typography style={{ color: "white" }} variant="h5">
          {currentLine}
        </Typography>
        {upcomingLines.map((line, index) => (
          <Typography key={index} style={{ color: "grey" }} variant="h5">
            {line}
          </Typography>
        ))}
      </Container>
    </div>
  );
};

export default LyricsDisplay;
