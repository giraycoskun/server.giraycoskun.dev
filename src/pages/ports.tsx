import { useMemo, useState } from "react";
import { Search, Network, ArrowRight, Home } from "lucide-react";
import { getAppData } from "../data/data.ts";
import type { CatalogEntry } from "../data/data.ts";
import { addressKeys, addressLabels, useNetworkAddresses } from "../data/network-addresses.ts";
import type { NetworkAddressesResult } from "../data/network-addresses.ts";
import { AccessLinks, CatalogIcon } from "../components/access-links.tsx";

const categoryColors: Record<string, string> = {
  systemd: "from-orange-500 to-orange-700",
  docker: "from-blue-500 to-blue-700",
  nginx: "from-lime-500 to-lime-700",
  default: "from-rose-500 to-rose-600",
};

function NetworkAddresses({ addresses }: { addresses?: NetworkAddressesResult | null }) {
  const observedAt = addresses?.snapshot ? addresses.info.observedAt : undefined;

  return (
    <section aria-label="Server IP addresses" aria-live="polite" className="mb-8">
      <dl className="grid gap-3 sm:grid-cols-3">
        {addressKeys.map((key) => (
          <div
            key={key}
            className="rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3"
          >
            <dt className="text-sm text-slate-300">{addressLabels[key]}</dt>
            <dd className="mt-1 font-mono text-white">
              {addresses === undefined
                ? "Loading…"
                : addresses?.info[key] ?? "Unavailable"}
            </dd>
          </div>
        ))}
      </dl>
      {observedAt && (
        <p className="mt-2 text-sm text-slate-400">
          Server snapshot from{" "}
          <time dateTime={observedAt}>{new Date(observedAt).toLocaleString()}</time>
        </p>
      )}
    </section>
  );
}

function PortMapping({ entry }: { entry: CatalogEntry }) {
  const category = entry.category ?? "default";
  const gradient = categoryColors[category] ?? categoryColors.default;

  return (
    <article className="group flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 p-2 transition-colors hover:border-slate-600 sm:gap-4 sm:p-4">
      {entry.port !== undefined && (
        <>
          <div className="w-14 shrink-0 rounded-lg bg-linear-to-r from-slate-700 to-slate-600 py-3 text-center sm:w-28">
            <div className="mb-1 text-xs text-slate-300">Port</div>
            <div className="text-lg font-bold text-white sm:text-3xl">{entry.port}</div>
          </div>
          <div className={`hidden h-1 w-16 shrink-0 items-center justify-center rounded-full bg-linear-to-r sm:flex ${gradient}`}>
            <ArrowRight aria-hidden="true" strokeWidth={4} className="h-5 w-5 text-white transition-transform group-hover:translate-x-3" />
          </div>
        </>
      )}
      <div className={`min-w-0 flex-1 rounded-lg bg-linear-to-r p-3 sm:p-4 ${gradient}`}>
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <CatalogIcon icon={entry.icon} fallback="/service-icon.svg" />
          <h3 className="min-w-0 flex-1 font-bold text-white sm:text-2xl">{entry.title}</h3>
          <span className="rounded-full bg-black/25 px-2 py-1 text-xs text-white">{category}</span>
        </div>
        <p className="mb-2 text-sm text-white/90">{entry.description}</p>
        <AccessLinks localUrl={entry.localUrl} externalUrl={entry.externalUrl} />
      </div>
    </article>
  );
}

function PortMappingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const addresses = useNetworkAddresses();
  const network = addresses?.info;
  const { remoteServices, localServices, projects } = useMemo(() => getAppData(network), [network]);
  const groups = [
    { title: "Remote Services", entries: remoteServices },
    { title: "Local Services", entries: localServices },
    { title: "Projects", entries: projects.filter((project) => project.port !== undefined) },
  ];
  const search = searchTerm.trim().toLowerCase();
  const matchingGroups = groups.map(({ title, entries }) => ({
    title,
    entries: entries.filter((entry) =>
      [entry.title, entry.description, entry.category, entry.port?.toString(), entry.localUrl, entry.externalUrl]
        .some((value) => value?.toLowerCase().includes(search)),
    ).sort((a, b) => (a.port ?? Infinity) - (b.port ?? Infinity)),
  }));
  const totalEntries = groups.reduce((total, group) => total + group.entries.length, 0);
  const matchingEntries = matchingGroups.reduce((total, group) => total + group.entries.length, 0);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
            <a
              href="/"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Home className="w-4 h-4" />
              Home
            </a>
            <span>/</span>
            <span className="text-slate-200">Port Mapper</span>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Network className="w-10 h-10 text-blue-400" />
              <h1 className="text-4xl font-bold text-white">Port Mapper</h1>
            </div>
            <p className="text-slate-300">
              Visual network port to service mappings
            </p>
          </div>
        </div>

        <NetworkAddresses addresses={addresses} />

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="search"
              aria-label="Search port mappings"
              placeholder="Search by port, service, category, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {matchingGroups.map(({ title, entries }) =>
          entries.length > 0 && (
            <section key={title}>
              <div className="my-10 flex items-center justify-center">
                <div className="h-px flex-1 bg-white/10" />
                <h2 className="px-4 text-sm uppercase tracking-wider text-white/70">{title}</h2>
                <div className="h-px flex-1 bg-white/10" />
              </div>
              <div className="space-y-3">
                {entries.map((entry) => <PortMapping key={entry.id} entry={entry} />)}
              </div>
            </section>
          ),
        )}

        {matchingEntries === 0 && (
          <p className="py-12 text-center text-lg text-slate-400">No matching ports or services found</p>
        )}

        <div className="mt-8 text-center text-sm text-slate-400">
          Showing {matchingEntries} of {totalEntries} entries
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {Object.entries(categoryColors).map(([category, gradient]) => (
            <div key={category} className="flex items-center gap-2">
              <div
                className={`w-4 h-4 rounded bg-linear-to-r ${gradient}`}
              ></div>
              <span className="text-sm text-slate-400">{category}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PortMappingPage;
