import type { NetworkInfo } from "./network-addresses.ts";

import type { Catalog, CatalogEntry } from "./catalog.ts";

declare const __APP_CATALOG__: Catalog;

export const isExternalBuild = import.meta.env.VITE_ENV === "external";
const configuredHost = import.meta.env.VITE_LOCAL_HOST?.trim();
const isAddress = (host: string) =>
  /^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.startsWith("[");

export const needsLocalAddress = () =>
  !isExternalBuild && !configuredHost && !isAddress(window.location.hostname);

function getLocalHost(network?: NetworkInfo) {
  const hostname = window.location.hostname;
  if (configuredHost || isAddress(hostname)) return configuredHost || hostname;

  const address = hostname.endsWith(".ts.net")
    ? network?.tailscaleIPv4
    : network?.lanIPv4;
  return address || hostname;
}

export function getAppData(network?: NetworkInfo) {
  const localHost = isExternalBuild ? "" : getLocalHost(network);
  const resolveEntry = (entry: CatalogEntry): CatalogEntry => {
    if (!entry.localUrl) return entry;
    const localUrl = entry.localUrl.startsWith("/")
      ? new URL(entry.localUrl, window.location.origin).href
      : entry.localUrl.replace("{host}", localHost);
    return { ...entry, localUrl };
  };

  const services = __APP_CATALOG__.services.map(resolveEntry);
  return {
    remoteServices: services.filter((service) => service.externalUrl),
    localServices: services.filter((service) => !service.externalUrl),
    projects: __APP_CATALOG__.projects.map(resolveEntry),
  };
}

export type { CatalogEntry };
