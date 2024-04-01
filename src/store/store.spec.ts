import { mockMediaPlayer } from "../__mocks__/media-player.mock";
import { useUserStore, useLibraryStore, useMediaPlayerStore } from "./store";
import { act, renderHook } from "@testing-library/react";
import { mockLibrary, mockLibraryItem } from "../__mocks__/library.mock.ts";
import { mockPlexClientResource, mockPlexResources, mockPlexServerResource } from "../__mocks__/server.mock.ts";

describe("UserStore", () => {
  it("fetches user when plexToken is available", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ id: 1 }));
    const { result } = renderHook(() => useUserStore());

    await act(async () => {
      await result.current.getUser();
    });

    expect(result.current.user).toBeDefined();
    expect(result.current.user?.id).toEqual(1);
  });

  it("does not fetch user when plexToken is not available", async () => {
    const error = { message: "User could not be authenticated" };
    fetchMock.mockResponseOnce(JSON.stringify({ errors: [error] }), {
      status: 401,
    });
    const { result } = renderHook(() => useUserStore());

    await act(async () => {
      await result.current.getUser();
    });

    expect(result.current.errors).toBeDefined();
    expect(result.current.errors).toEqual([error]);
  });
});

describe("LibraryStore", () => {
  it("fetches library when player is available", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockLibrary));
    fetchMock.mockResponseOnce(JSON.stringify({ MediaContainer: mockLibraryItem }));

    const { result } = renderHook(() => useLibraryStore());
    await act(async () => {
      await result.current.getLibrary(mockMediaPlayer);
    });

    expect(result.current.library).toBeDefined();
    expect(result.current.library[0].thumb).toEqual(mockLibrary.MediaContainer.Directory[0].thumb);
  });
});

describe("MediaPlayerStore", () => {
  it("fetches media players", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockPlexResources));
    const { result } = renderHook(() => useMediaPlayerStore());

    await act(async () => {
      await result.current.getMediaPlayers();
    });

    expect(result.current.mediaPlayers).toBeDefined();
    expect(result.current.mediaPlayers[0].uri).toEqual(mockPlexClientResource.connections[0].uri);
    expect(result.current.mediaPlayers[0].server.uri).toEqual(mockPlexServerResource.connections[0].uri);
  });
});
