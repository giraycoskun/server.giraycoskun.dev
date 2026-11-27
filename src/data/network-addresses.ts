import { useEffect, useState } from "react";

export const addressLabels = {
  lanIPv4: "Local IPv4 (LAN)",
  tailscaleIPv4: "Tailscale IPv4",
  publicIPv4: "External IPv4",
} as const;

type AddressKey = keyof typeof addressLabels;
export const addressKeys = Object.keys(addressLabels) as AddressKey[];
export type NetworkInfo = Record<AddressKey, string | null> & { observedAt?: string };
export type NetworkAddressesResult = { info: NetworkInfo; snapshot: boolean };

async function loadNetworkAddresses(
  signal: AbortSignal,
): Promise<NetworkAddressesResult | null> {
  for (const path of ["/network-info", "/network-info.json"]) {
    if (signal.aborted) return null;
    try {
      const response = await fetch(path, { cache: "no-store", signal });
      if (!response.ok) continue;
      const info = (await response.json()) as NetworkInfo | null;
      if (
        info &&
        addressKeys.every((key) => info[key] === null || typeof info[key] === "string") &&
        addressKeys.some((key) => info[key])
      ) {
        return { info, snapshot: path.endsWith(".json") };
      }
    } catch {
      // The deployed reverse proxy may only serve the static build.
    }
  }
  return null;
}

export function useNetworkAddresses(enabled = true) {
  const [addresses, setAddresses] = useState<NetworkAddressesResult | null>();

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    void loadNetworkAddresses(controller.signal).then((result) => {
      if (!controller.signal.aborted) setAddresses(result);
    });
    return () => controller.abort();
  }, [enabled]);

  return addresses;
}
