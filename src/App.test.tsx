import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App Component", () => {
  it("renders Configuration component when plexToken is not available", () => {
    // Mock the useUserStore hook to return no plexToken
    vi.mock("./store/store", async (importOriginal) => ({
      ...(await importOriginal<typeof import("./store/store")>()),
      useUserStore: () => ({ configuration: { plexToken: null } }),
    }));

    render(<App />);

    expect(screen.getByText(/configuration/i)).toBeInTheDocument();
  });

  it("renders MediaPlayers component when path is '/'", () => {
    // Mock the useUserStore hook to return a plexToken
    vi.mock("./store/store", async (importOriginal) => ({
      ...(await importOriginal<typeof import("./store/store")>()),
      useUserStore: () => ({ configuration: { plexToken: "token" } }),
    }));

    render(<App />);

    expect(screen.getByText(/media-players/i)).toBeInTheDocument();
  });

  it("renders MusicLibrary component when path is '/albums'", () => {
    // Mock the useUserStore hook to return a plexToken
    vi.mock("./store/store", async (importOriginal) => ({
      ...(await importOriginal<typeof import("./store/store")>()),
      useUserStore: () => ({ configuration: { plexToken: "token" } }),
    }));

    render(<App />);

    expect(screen.getByText(/music-library/i)).toBeInTheDocument();
  });

  it("renders 404 page when path is not found", () => {
    // Mock the useUserStore hook to return a plexToken
    vi.mock("./store/store", async (importOriginal) => ({
      ...(await importOriginal<typeof import("./store/store")>()),
      useUserStore: () => ({ configuration: { plexToken: "token" } }),
    }));

    render(<App />);

    expect(screen.getByText(/404: No such page!/i)).toBeInTheDocument();
  });
});
