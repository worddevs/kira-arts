import type { Client } from "discord.js";
import { KiraError } from "./Utils/error.utils";
import { KiraErrorCode } from "./@Types/index";

let registeredClient: Client | null = null;

export function setClient(client: Client): void {
  if (!client || typeof client.users?.fetch !== "function") {
    throw new KiraError(
      "setClient() expects a valid discord.js Client instance",
      KiraErrorCode.Config,
    );
  }

  registeredClient = client;
}

export function getClient(): Client {
  if (!registeredClient) {
    throw new KiraError(
      "No discord.js Client registered. Call setClient(client) once at startup before using kira-arts, e.g. setClient(client) right after client.login().",
      KiraErrorCode.Config,
    );
  }

  return registeredClient;
}
