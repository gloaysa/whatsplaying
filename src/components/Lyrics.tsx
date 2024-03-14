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

  useEffect(() => {
    setCurrentLine("");
    setPreviousLines([]);
    setUpcomingLines([]);
  }, [lyrics]);

  useEffect(() => {
    const currentTime = mediaPlayer.time;
    const currentIndex = lyrics.Line.findIndex(
      (line) =>
        currentTime >= line.startOffset && currentTime <= line.endOffset,
    );
    if (currentIndex !== -1) {
      const currentLineSpan = lyrics.Line[currentIndex]?.Span;
      if (currentLineSpan && currentLineSpan.length > 0) {
        setCurrentLine(currentLineSpan[0].text);
      }
      const prevLines = lyrics.Line.slice(
        Math.max(0, currentIndex - 5),
        currentIndex,
      ).map((line) => line.Span?.[0]?.text);
      const nextLines = lyrics.Line.slice(
        currentIndex + 1,
        currentIndex + 11,
      ).map((line) => line.Span?.[0]?.text);
      setPreviousLines(prevLines);
      setUpcomingLines(nextLines);
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
      <Container>
        {previousLines.map((line, index) => (
          <Typography key={index} style={{ color: "white" }} variant="h5">
            {line}
          </Typography>
        ))}
        <Typography style={{ color: "white" }} variant="h2">
          {currentLine}
        </Typography>
        {upcomingLines.map((line, index) => (
          <Typography key={index} style={{ color: "white" }} variant="h5">
            {line}
          </Typography>
        ))}
      </Container>
    </div>
  );
};

export default LyricsDisplay;
