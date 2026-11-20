import { execFile } from "node:child_process";
import { isIPv4 } from "node:net";
import { networkInterfaces } from "node:os";
import { promisify } from "node:util";

const run = promisify(execFile);
let publicLookup: Promise<string | null> | undefined;
let publicLookupExpires = 0;

async function getLanInterface(): Promise<string | undefined> {
  if (process.env.LAN_INTERFACE) return process.env.LAN_INTERFACE;

  try {
    const { stdout } = await run("ip", ["-j", "-4", "route", "show", "default"], {
      timeout: 2000,
    });
    const routes: { dev?: string; metric?: number }[] = JSON.parse(stdout);
    return routes.sort((a, b) => (a.metric ?? 0) - (b.metric ?? 0))[0]?.dev;
  } catch {
    return undefined;
  }
}

async function lookupPublicIPv4(): Promise<string | null> {
  try {
    const response = await fetch("https://api.ipify.org", {
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) return null;
    const address = (await response.text()).trim();
    return isIPv4(address) ? address : null;
  } catch {
    return null;
  }
}

function getPublicIPv4() {
  if (!publicLookup || Date.now() >= publicLookupExpires) {
    publicLookup = lookupPublicIPv4();
    publicLookupExpires = Date.now() + 60_000;
  }
  return publicLookup;
}

async function getTailscaleIPv4(): Promise<string | null> {
  try {
    const { stdout } = await run("tailscale", ["ip", "-4"], { timeout: 2000 });
    const address = stdout.trim();
    return isIPv4(address) ? address : null;
  } catch {
    return null;
  }
}

export async function getNetworkInfo() {
  const interfaces = networkInterfaces();
  const ipv4 = (name: string | undefined) => {
    if (!name) return null;
    const entry = interfaces[name]?.find(
      (entry) => entry.family === "IPv4" && !entry.internal,
    );
    return entry?.address ?? null;
  };
  const [lanInterface, tailscaleIPv4, publicIPv4] = await Promise.all([
    getLanInterface(),
    ipv4("tailscale0") ?? getTailscaleIPv4(),
    getPublicIPv4(),
  ]);

  return {
    lanIPv4: ipv4(lanInterface),
    tailscaleIPv4,
    publicIPv4,
    observedAt: new Date().toISOString(),
  };
}
