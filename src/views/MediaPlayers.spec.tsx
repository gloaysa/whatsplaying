import { MediaPlayers } from "./MediaPlayers";
import { useMediaPlayerStore } from "../store/store";
import { fireEvent, render, waitFor } from "@testing-library/react";

vi.mock("../store/store");

describe("MediaPlayers", () => {
  beforeEach(() => {
    vi.mocked(useMediaPlayerStore).mockClear();
  });

  it("renders spinner when media players are not loaded", () => {
    vi.mocked(useMediaPlayerStore).mockReturnValue({
      mediaPlayers: undefined,
      getMediaPlayers: vi.fn(),
      configuration: { plexToken: "token", albumsOnTimeout: false },
      selectedMediaPlayer: undefined,
    });

    const { getByRole } = render(<MediaPlayers />);
    expect(getByRole("progressbar")).toBeInTheDocument();
  });

  it("renders media players when they are loaded", () => {
    vi.mocked(useMediaPlayerStore).mockReturnValue({
      mediaPlayers: [{ clientIdentifier: "1" }, { clientIdentifier: "2" }],
      getMediaPlayers: vi.fn(),
      configuration: { plexToken: "token", albumsOnTimeout: false },
      selectedMediaPlayer: undefined,
    });

    const { getAllByRole } = render(<MediaPlayers />);
    expect(getAllByRole("listitem")).toHaveLength(2);
  });

  it("redirects to /albums when no player has been playing for 60 sec", async () => {
    vi.useFakeTimers();

    vi.mocked(useMediaPlayerStore).mockReturnValue({
      mediaPlayers: [{ clientIdentifier: "1" }],
      getMediaPlayers: vi.fn(),
      configuration: { plexToken: "token", albumsOnTimeout: true },
      selectedMediaPlayer: { state: "stopped" },
    });

    const { getByRole } = render(<MediaPlayers />);
    vi.advanceTimersByTime(5000);

    await waitFor(() => {
      expect(getByRole("link", { name: "/albums" })).toBeInTheDocument();
    });

    vi.useRealTimers();
  });

  it("does not redirect to /albums when a player is playing", () => {
    vi.useFakeTimers();

    vi.mocked(useMediaPlayerStore).mockReturnValue({
      mediaPlayers: [{ clientIdentifier: "1" }],
      getMediaPlayers: vi.fn(),
      configuration: { plexToken: "token", albumsOnTimeout: true },
      selectedMediaPlayer: { state: "playing" },
    });

    const { queryByRole } = render(<MediaPlayers />);
    vi.advanceTimersByTime(5000);

    expect(queryByRole("link", { name: "/albums" })).not.toBeInTheDocument();

    vi.useRealTimers();
  });

  it("navigates through media players on swipe", () => {
    vi.mocked(useMediaPlayerStore).mockReturnValue({
      mediaPlayers: [{ clientIdentifier: "1" }, { clientIdentifier: "2" }],
      getMediaPlayers: vi.fn(),
      configuration: { plexToken: "token", albumsOnTimeout: false },
      selectedMediaPlayer: undefined,
    });

    const { getAllByRole, getByRole } = render(<MediaPlayers />);
    const carousel = getByRole("list");

    fireEvent.touchStart(carousel, { touches: [{ clientX: 100 }] });
    fireEvent.touchEnd(carousel, { changedTouches: [{ clientX: 0 }] });

    expect(getAllByRole("listitem")[1]).toHaveAttribute("aria-selected", "true");
  });
});
