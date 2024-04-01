import { Container, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Lyrics, MediaPlayer } from "../store/media-player.type";

interface LyricsDisplayProps {
  lyrics: Lyrics;
  mediaPlayer: MediaPlayer;
  offset: number;
}

const LyricsDisplay: React.FC<LyricsDisplayProps> = ({ lyrics, mediaPlayer, offset }) => {
  const [currentLine, setCurrentLine] = useState("");
  const [previousLines, setPreviousLines] = useState<string[]>([]);
  const [upcomingLines, setUpcomingLines] = useState<string[]>([]);
  const [userTakeControl, setUserTakeControl] = useState<boolean>(false);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  const currentLineRef = useRef<HTMLDivElement>(null);

  const setCurrentAndUpcomingLines = (lyrics: Lyrics, currentIndex: number) => {
    // Function to set the current line and upcoming lines based on the given lyrics and current index
    const currentLineSpan = lyrics.Line[currentIndex]?.Span;
    if (currentLineSpan && currentLineSpan.length > 0) {
      setCurrentLine(currentLineSpan[0].text);
    } else {
      setCurrentLine("...");
    }
    const nextLines = lyrics.Line.slice(currentIndex + 1).map((line) => line.Span?.[0]?.text || "...");
    setUpcomingLines(nextLines);
  };

  const setPreviousLinesFromIndex = (lyrics: Lyrics, currentIndex: number) => {
    const prevLines = lyrics.Line.slice(0, currentIndex).map((line) => line.Span?.[0]?.text || "...");
    setPreviousLines(prevLines);
  };

  useEffect(() => {
    // Effect hook to reset the lyrics when they change
    if (lyrics.timed) {
      setCurrentAndUpcomingLines(lyrics, 0);
    } else {
      setUpcomingLines(lyrics.Line.map((line) => line.Span?.[0]?.text || "..."));
    }

    setPreviousLines([]);
  }, [lyrics]);

  useEffect(() => {
    const currentTime = Number(mediaPlayer.time) + offset;
    let currentIndex = lyrics.Line.findIndex(
      (line) => currentTime >= line.startOffset && currentTime <= line.endOffset,
    );
    // Special case for the last line
    if (currentIndex === -1 && currentTime >= lyrics.Line[lyrics.Line.length - 1].startOffset) {
      currentIndex = lyrics.Line.length - 1;
    }
    if (currentIndex !== -1) {
      setCurrentAndUpcomingLines(lyrics, currentIndex);
      setPreviousLinesFromIndex(lyrics, currentIndex);
    }
  }, [mediaPlayer.time, lyrics]);

  useEffect(() => {
    if (currentLineRef.current && lyricsContainerRef.current && !userTakeControl) {
      const containerHeight = lyricsContainerRef.current.clientHeight;
      const lineTop = currentLineRef.current.offsetTop;
      const lineHeight = currentLineRef.current.clientHeight;
      lyricsContainerRef.current.scrollTop = lineTop - containerHeight / 2 + lineHeight / 2;
    }
  }, [previousLines, currentLine]);

  useEffect(() => {
    const handleUserInteraction = (e: any) => {
      const isUserInteracting = e.type === "touchstart" || e.type === "mouseenter";
      setUserTakeControl(isUserInteracting);
    };

    const events = ["touchstart", "mouseenter", "touchend", "mouseleave"];
    const lyricsContainer = lyricsContainerRef.current;

    if (lyricsContainer) {
      events.forEach((event) => {
        lyricsContainer.addEventListener(event, handleUserInteraction);
      });
    }

    return () => {
      if (lyricsContainer) {
        events.forEach((event) => {
          lyricsContainer.removeEventListener(event, handleUserInteraction);
        });
      }
    };
  }, [lyricsContainerRef]);

  return (
    <div
      style={{
        position: "fixed",
        height: "50%",
        width: "80%",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        color: "white",
        overflow: "auto",
        scrollbarWidth: "none",
      }}
      ref={lyricsContainerRef}
    >
      <Container
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          padding: "20px",
        }}
      >
        {previousLines.map((line, index) => (
          <Typography key={index} style={{ padding: "20px", color: "grey" }} variant="h5">
            {line}
          </Typography>
        ))}
        <div ref={currentLineRef}>
          <Typography style={{ padding: "20px", color: "white" }} variant="h5">
            {currentLine}
          </Typography>
        </div>
        {upcomingLines.map((line, index) => (
          <Typography key={index} style={{ padding: "20px", color: lyrics.timed ? "grey" : "white" }} variant="h5">
            {line}
          </Typography>
        ))}
      </Container>
    </div>
  );
};

export default LyricsDisplay;
