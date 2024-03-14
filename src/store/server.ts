// @ts-ignore
import XMLParser from "react-xml-parser";
import {
  BaseMediaPlayerServer,
  PlexResource,
  PlexSonosResource,
  PlexUser,
} from "./server.interface";
import { MediaPlayer } from "./media-player.type";

const token = process.env.REACT_APP_PLEX_TOKEN ?? "";

const headers = {
  "X-Plex-Version": "1.0",
  "X-Plex-Product": "Plex-Product",
  "X-Plex-Client-Identifier": "Plex-Client-Identifier",
  "X-Plex-Device": "Plex-Device",
  "X-Plex-Platform": "Plex-Platform",
  "X-Plex-Platform-Version": "Plex-Platform-Version",
  "X-Plex-Provides": "player",
  "X-Plex-Device-Name": "Plex-Device-Name",
  "X-Plex-Token": token,
  "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
  Accept: "application/json",
};

export async function getUser(): Promise<PlexUser> {
  const response = await fetch("https://plex.tv/api/v2/user", {
    headers: headers,
    method: "GET",
  });
  if (response.status === 401) {
    // TODO: refresh token
  }
  return response.json();
}

/**
 * Function that gets all the media players available in the network.
 * It fetches the resources from the plex.tv API and filters the clients and sonos resources.
 * @returns An array of media players sorted by name and state.
 */
export async function getMediaPlayers(): Promise<MediaPlayer[]> {
  const response = await fetch(`https://plex.tv/api/v2/resources`, {
    headers: headers,
    method: "GET",
  });
  const resources = await response.json();
  const server = getServerInfo(resources);
  if (!server) {
    return [];
  }
  const clients = await getClients(resources, server);
  const sonos = await getSonosResource(server);

  return (
    [...clients, ...sonos]
      // sorts by name
      .sort((a, b) => a.name.localeCompare(b.name))
  );
}

/**
 * Function that gets the sonos resources from the plex.tv API.
 * @returns An array of sonos media players.
 * @param server
 */
async function getSonosResource(
  server: BaseMediaPlayerServer,
): Promise<MediaPlayer[]> {
  const response = await fetch(`https://sonos.plex.tv/resources`, {
    headers: headers,
    method: "GET",
  });
  const data = await response.text();

  const json = new XMLParser().parseFromString(data, "application/xml");
  return json.children.map(
    ({ attributes }: { attributes: PlexSonosResource }) => ({
      name: attributes.title,
      product: attributes.product,
      productVersion: attributes.platformVersion,
      clientIdentifier: attributes.machineIdentifier,
      protocol: attributes.protocol,
      address: attributes.lanIP,
      uri: "https://sonos.plex.tv",
      token: token,
      server: server,
      state: "unknown",
      media_duration: 0,
      media_position: 0,
      shuffle: "0",
      repeat: "0",
      volume_level: 0,
      is_volume_muted: false,
    }),
  );
}

/**
 * Function that gets the server info from the resources.
 * @returns The server info to be used in the media players.
 * @param resources
 */
function getServerInfo(
  resources: PlexResource[],
): BaseMediaPlayerServer | undefined {
  const server = resources.find((resource) => resource.provides === "server");
  if (!server) {
    return undefined;
  }
  return {
    client_identifier: server.clientIdentifier,
    protocol: server.connections[0].protocol,
    port: server.connections[0].port,
    uri: server.connections[0].uri,
  };
}

/**
 * Function that gets the clients from the resources, filtering out the clients that are not available.
 * @returns An array of media players.
 * @param resources
 * @param server
 */
async function getClients(
  resources: PlexResource[],
  server: BaseMediaPlayerServer,
): Promise<MediaPlayer[]> {
  // should find all the resources that are not the server, returning an array
  const clients = resources.filter((resource) =>
    resource.provides.match("client"),
  );

  // iterate over the clients and do a fetch to get the client info, if fetch fails, remove the client from the array
  for (const client of clients) {
    const url = `${client.connections[0].uri}/resources`;
    await fetchWithTimeout(url, {
      headers: headers,
      method: "GET",
    }).catch(() => {
      clients.splice(clients.indexOf(client), 1);
    });
  }

  return clients.map((client) => ({
    name: client.name,
    product: client.product,
    productVersion: client.platformVersion,
    clientIdentifier: client.clientIdentifier,
    protocol: client.connections[0].protocol,
    address: client.connections[0].address,
    port: client.connections[0].port,
    uri: client.connections[0].uri,
    token: token,
    server: server,
    state: "unknown",
    media_duration: 0,
    media_position: 0,
    shuffle: "0",
    repeat: "0",
    volume_level: 0,
    is_volume_muted: false,
    duration: 0,
    time: 0,
  }));
}

function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout = 5000,
): Promise<Response> {
  return new Promise((resolve, reject) => {
    // Set up the timeout
    const timer = setTimeout(() => {
      reject(new Error("Request timed out"));
    }, timeout);

    // Fetch the resource
    fetch(url, options)
      .then((response) => {
        // Clear the timeout
        clearTimeout(timer);

        // Resolve the fetch promise
        resolve(response);
      })
      .catch((error) => {
        // Clear the timeout
        clearTimeout(timer);

        // Reject the fetch promise
        reject(error);
      });
  });
}
