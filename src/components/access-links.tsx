import type { CatalogEntry } from "../data/data.ts";

export function AccessLinks({ localUrl, externalUrl }: Pick<CatalogEntry, "localUrl" | "externalUrl">) {
  const links = [
    { label: "Local", url: localUrl },
    { label: "External", url: externalUrl },
  ].filter(({ url }) => url);

  if (!links.length) {
    return <p className="text-sm text-white/75">Local access only</p>;
  }

  return (
    <ul className="space-y-1">
      {links.map(({ label, url }) => (
        <li key={label}>
          <a href={url} className="inline-flex flex-wrap items-baseline gap-x-2 text-sm text-white hover:underline">
            <span className="font-semibold">{label}</span>
            <span className="break-all text-white/85">{url}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function CatalogIcon({ icon, fallback }: { icon: string; fallback: string }) {
  return (
    <img
      src={`/${icon}`}
      alt=""
      className="h-9 w-9 shrink-0 rounded-md bg-white/90 object-contain p-1"
      onError={({ currentTarget }) => {
        if (!currentTarget.src.endsWith(fallback)) currentTarget.src = fallback;
      }}
    />
  );
}
