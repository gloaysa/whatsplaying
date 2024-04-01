export interface IConfig {
  loaded: boolean;
  preferredOrder: string[];
  hideLibraries: string[];
  plexToken: string;
  autoDisplayAlbums: boolean;
  intervalBetweenAlbums: number;
}

/**
 * Fetches the config.json file from the public folder and returns the config object if it is valid
 */
export async function loadConfig() {
  const initialConfig = await fetchConfig();
  const preferredOrder = localStorage.getItem("preferredOrder")?.split(",");
  const hideLibraries = localStorage.getItem("hideLibraries")?.split(",");
  const plexToken = localStorage.getItem("plexToken");
  const autoDisplayAlbums = localStorage.getItem("autoDisplayAlbums");
  const intervalBetweenAlbums = localStorage.getItem("intervalBetweenAlbums");

  const config: IConfig = {
    preferredOrder: preferredOrder ?? initialConfig.preferredOrder,
    hideLibraries: hideLibraries ?? initialConfig.hideLibraries,
    plexToken: plexToken?.length ? plexToken : initialConfig.plexToken,
    autoDisplayAlbums: autoDisplayAlbums?.length ? autoDisplayAlbums === "true" : initialConfig.autoDisplayAlbums,
    intervalBetweenAlbums: Number(intervalBetweenAlbums ?? initialConfig.intervalBetweenAlbums),
    loaded: true,
  };
  config.preferredOrder = config.preferredOrder.map((device: string) => device.trim().toLowerCase());
  config.hideLibraries = config.hideLibraries.map((device: string) => device.trim().toLowerCase());
  await saveConfig(config);
  return config;
}

/**
 * Saves the config object to localStorage
 * */
export async function saveConfig(config: IConfig): Promise<void> {
  return new Promise((resolve) => {
    localStorage.setItem("preferredOrder", config.preferredOrder.join(","));
    localStorage.setItem("hideLibraries", config.hideLibraries.join(","));
    localStorage.setItem("plexToken", config.plexToken.trimStart().trimEnd());
    localStorage.setItem("autoDisplayAlbums", config.autoDisplayAlbums.toString());
    localStorage.setItem("intervalBetweenAlbums", config.intervalBetweenAlbums.toString());
    resolve();
  });
}

/**
 * Fetches the config.json file from the public folder
 */
async function fetchConfig(): Promise<IConfig> {
  try {
    const response = await fetch("/config.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const conf = await response.json();

    configIsValid(conf);
    return conf;
  } catch (e) {
    console.error(`Error in config.json: ${e}`);
    return {
      preferredOrder: [],
      hideLibraries: [],
      plexToken: "",
      autoDisplayAlbums: false,
      intervalBetweenAlbums: 30,
      loaded: true,
    };
  }
}

/**
 * Validates the config object
 */
function configIsValid(conf: Record<string, unknown>) {
  if (!Array.isArray(conf.preferredOrder)) {
    throw new Error("preferredOrder is not an array");
  }
  if (!Array.isArray(conf.hideLibraries)) {
    throw new Error("hideLibraries is not an array");
  }
  if (typeof conf.plexToken !== "string") {
    throw new Error("plexToken is not a string");
  }
  if (typeof conf.autoDisplayAlbums !== "boolean") {
    throw new Error("albumsOnTimeout is not a boolean");
  }
  if (typeof conf.intervalBetweenAlbums !== "number") {
    throw new Error("intervalBetweenAlbums is not a number");
  }
}
