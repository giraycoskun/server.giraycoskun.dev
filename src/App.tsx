import { Github, Linkedin, FileText, ExternalLink } from "lucide-react";
import { getAppData, isExternalBuild, needsLocalAddress } from "./data/data.ts";
import type { CatalogEntry } from "./data/data.ts";
import { useNetworkAddresses } from "./data/network-addresses.ts";
import { AccessLinks, CatalogIcon } from "./components/access-links.tsx";
import { useState, useEffect, useMemo } from "react";
import {
  checkMultipleUrls,
  getStatusLabel,
  getStatusColorClasses,
} from "./util/check.tsx";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import BashCommandsPage from "./pages/commands.tsx";
import PortMappingPage from "./pages/ports.tsx";
import NotFound from "./pages/404.tsx";

function DashboardSection({
  title,
  entries,
  urlStatuses,
}: {
  title: string;
  entries: CatalogEntry[];
  urlStatuses?: Map<string, boolean>;
}) {
  return (
    <section>
      <div className="my-10 flex items-center justify-center">
        <div className="h-px bg-white/10 flex-1" />
        <h2 className="px-4 text-sm text-white/70 uppercase tracking-wider">{title}</h2>
        <div className="h-px bg-white/10 flex-1" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up">
        {entries.map((entry) => {
          const primaryUrl = entry.localUrl ?? entry.externalUrl;
          const showStatus = urlStatuses && primaryUrl;
          const status = primaryUrl ? urlStatuses?.get(primaryUrl) : undefined;
          const colors = getStatusColorClasses(status);

          return (
            <article
              key={entry.id}
              className="flex min-w-0 flex-col rounded-2xl border border-white/10 bg-black/35 p-5 backdrop-blur-sm sm:p-6"
            >
              <div className="mb-3 flex items-center gap-3">
                <CatalogIcon
                  icon={entry.icon}
                  fallback={urlStatuses ? "/service-icon.svg" : "/default-project.svg"}
                />
                <h3 className="flex-1 text-xl font-semibold leading-tight text-white">
                  {entry.title}
                </h3>
                {entry.sourceUrl && (!urlStatuses || !isExternalBuild) && (
                  <a
                    href={entry.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${entry.title} project website`}
                    className="shrink-0 text-white/70 hover:text-white"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
              <p className="mb-4 text-sm leading-relaxed text-white/90">{entry.description}</p>
              <div className="mt-auto">
                <AccessLinks localUrl={entry.localUrl} externalUrl={entry.externalUrl} />
                {showStatus && (
                  <span className={`mt-3 inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs text-white ${colors.bg} ${colors.border}`}>
                    <span className={`h-2 w-2 rounded-full ${colors.dot}`} />
                    {getStatusLabel(status)}
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function HomeServerLanding() {
  const [urlStatuses, setUrlStatuses] = useState<Map<string, boolean>>(
    new Map(),
  );

  const network = useNetworkAddresses(needsLocalAddress())?.info;
  const { projects, remoteServices, localServices } = useMemo(() => getAppData(network), [network]);

  useEffect(() => {
    const urls = [...remoteServices, ...localServices].flatMap((service) => {
      const url = service.localUrl ?? service.externalUrl;
      return url ? [url] : [];
    });
    let active = true;
    void checkMultipleUrls(urls).then((statuses) => {
      if (active) setUrlStatuses(statuses);
    });
    return () => { active = false; };
  }, [remoteServices, localServices]);

  const socialLinks = [
    {
      name: "GitHub",
      url: "https://github.com/giraycoskun",
      icon: Github,
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/giraycoskun",
      icon: Linkedin,
    },
    {
      name: "CV / Resume",
      url: "/cv-18-11-2025.pdf",
      icon: FileText,
    },
    {
      name: "Personal Website",
      url: "https://giraycoskun.com",
      icon: ExternalLink,
    },
  ];

  return (
    <div className="min-h-screen w-screen bg-linear-to-br from-indigo-700 via-purple-700 to-purple-900 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-down">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-3 leading-tight tracking-tight drop-shadow-lg flex items-center justify-center gap-4">
            <img
              src="/server.svg"
              alt="server icon"
              className="h-10 w-10 md:h-12 md:w-12 inline-block"
            />
            <span>localhost</span>
          </h1>
          <p className="text-xl md:text-2xl font-bold max-w-2xl mx-auto mt-0 text-right">
            by giraycoskun
          </p>
          <p className="text-lg md:text-xl text-white/95 max-w-2xl mx-auto mt-10">
            My localhost server hosting various services for friends and family,
            as well as personal projects for development and testing purposes.
          </p>
        </div>

        {/* Social Links */}
        <div className="flex flex-col md:flex-row gap-5 justify-center mb-10 animate-fade-in">
          {socialLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.name}
                title={link.name}
                className="bg-white/12 backdrop-blur-sm border border-white/10 px-6 py-3 rounded-full text-white font-semibold text-base flex items-center justify-center gap-3 transition transform duration-200 hover:bg-white/25 hover:-translate-y-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                <Icon size={18} className="text-white" />
                <span className="leading-none text-white">{link.name}</span>
              </a>
            );
          })}
        </div>

        <div className="flex justify-center m-10 gap-6 animate-fade-in">
          <Link
            to="/ports"
            className="bg-white/12 backdrop-blur-sm border border-white/10 px-6 py-3 rounded-full text-white font-semibold text-base flex items-center justify-center gap-3 transition transform duration-200 hover:bg-white/25 hover:-translate-y-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            📍 Port Mapping
          </Link>
          <Link
            to="/commands"
            className="bg-white/12 backdrop-blur-sm border border-white/10 px-6 py-3 rounded-full text-white font-semibold text-base flex items-center justify-center gap-3 transition transform duration-200 hover:bg-white/25 hover:-translate-y-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            📖 Bash Commands Reference
          </Link>
        </div>

        <DashboardSection title="Projects" entries={projects} />
        <DashboardSection title="Remote Services" entries={remoteServices} urlStatuses={urlStatuses} />
        <DashboardSection title="Local Services" entries={localServices} urlStatuses={urlStatuses} />
      </div>

      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-down { animation: fadeInDown 0.6s ease both; }
        .animate-fade-in { animation: fadeIn 0.9s ease 0.2s both; }
        .animate-fade-in-up { animation: fadeInUp 0.9s ease 0.35s both; }
      `}</style>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomeServerLanding />} />
        <Route path="/commands" element={<BashCommandsPage />} />
        <Route path="/ports" element={<PortMappingPage />} />
        {/* ❌ 404 CATCH-ALL ROUTE */}
        {/* This must be one of the last routes defined */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
