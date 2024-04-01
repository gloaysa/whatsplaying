import { IConfig, loadConfig, saveConfig } from "./fetchConfig";
import { afterEach, vitest } from "vitest";
describe("fetchConfig", () => {
  afterEach(() => {
    localStorage.clear();
  });

  describe("loadConfig", () => {
    it("returns config from localStorage when available", async () => {
      // @ts-expect-error is expected
      global.fetch = vitest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404,
          json: () => Promise.resolve({}),
        }),
      );
      const localStorageConfig: IConfig = {
        preferredOrder: ["order1", "order2"],
        hideLibraries: ["lib1", "lib2"],
        plexToken: "token",
        autoDisplayAlbums: true,
        intervalBetweenAlbums: 20,
        loaded: true,
      };
      await saveConfig(localStorageConfig);

      const config = await loadConfig();

      expect(config).toEqual(localStorageConfig);
    });

    it("returns config from fetch when localStorage is not available", async () => {
      const fetchedConfig: IConfig = {
        preferredOrder: ["order1", "order2"],
        hideLibraries: ["lib1", "lib2"],
        plexToken: "token",
        autoDisplayAlbums: true,
        intervalBetweenAlbums: 20,
        loaded: true,
      };

      // @ts-expect-error is expected
      global.fetch = vitest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(fetchedConfig),
        }),
      );

      const config = await loadConfig();

      expect(config).toEqual(fetchedConfig);
    });

    it("returns config from localStorage if it exists even if fetch is successful", async () => {
      const fetchedConfig: IConfig = {
        preferredOrder: ["order1", "order2"],
        hideLibraries: ["lib1", "lib2"],
        plexToken: "token",
        autoDisplayAlbums: true,
        intervalBetweenAlbums: 20,
        loaded: true,
      };

      // @ts-expect-error is expected
      global.fetch = vitest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(fetchedConfig),
        }),
      );

      const localStorageConfig: IConfig = {
        preferredOrder: ["order3", "order4"],
        hideLibraries: ["lib3", "lib4"],
        plexToken: "token2",
        autoDisplayAlbums: false,
        intervalBetweenAlbums: 30,
        loaded: true,
      };

      await saveConfig(localStorageConfig);

      const config = await loadConfig();

      expect(config).toEqual(localStorageConfig);
    });
  });

  describe("saveConfig", () => {
    it("saves config to localStorage", async () => {
      const config: IConfig = {
        preferredOrder: ["order1", "order2"],
        hideLibraries: ["lib1", "lib2"],
        plexToken: "token",
        autoDisplayAlbums: true,
        intervalBetweenAlbums: 20,
        loaded: false,
      };

      await saveConfig(config);

      expect(localStorage.getItem("preferredOrder")).toEqual("order1,order2");
      expect(localStorage.getItem("hideLibraries")).toEqual("lib1,lib2");
      expect(localStorage.getItem("plexToken")).toEqual("token");
      expect(localStorage.getItem("autoDisplayAlbums")).toEqual("true");
      expect(localStorage.getItem("intervalBetweenAlbums")).toEqual("20");
    });
  });
});
