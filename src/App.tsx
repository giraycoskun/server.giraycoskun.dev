import { Github, Linkedin, FileText, ExternalLink } from "lucide-react";
import appData from "./data/data.tsx";
import { useState, useEffect } from "react";
import { checkMultipleUrls, getStatusLabel, getStatusColorClasses } from "./util/check.tsx";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import BashCommandsPage from "./pages/commands.tsx";

function HomeServerLanding() {
  const [urlStatuses, setUrlStatuses] = useState<Map<string, boolean>>(new Map());

  useEffect(() => {
    // Collect all URLs from services and projects
    const allUrls = [
      ...appData.services.map((s) => s.url),
      ...appData.projects.map((p) => p.url),
    ];

    // Check all URLs on mount
    checkMultipleUrls(allUrls).then(setUrlStatuses);
  }, []);

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
    }
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
            My localhost server hosting various services for friends and family, as well as personal projects for development and testing purposes.
          </p>
        </div>

        {/* Social Links */}
        <div className="flex flex-col md:flex-row gap-5 justify-center mb-16 animate-fade-in">
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

        {/* separator between services and projects */}
        <div className="flex items-center justify-center my-10">
          <div className="h-px bg-white/10 flex-1" />
          <span className="px-4 text-sm text-white/70 uppercase tracking-wider">
            Services
          </span>
          <div className="h-px bg-white/10 flex-1" />
        </div>

        {/* Service Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up">
          {appData.services.map((service) => {
            const isRunning = urlStatuses.get(service.url) ?? false;
            const statusColors = getStatusColorClasses(isRunning);
            const statusLabel = getStatusLabel(isRunning);

            return (
              <div
                key={service.id}
                onClick={() => (window.location.href = service.url)}
                className="relative overflow-hidden group rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 cursor-pointer transition-transform duration-200 hover:-translate-y-2"
              >
                {/* Card background */}
                <div className="absolute inset-0 bg-black/35 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl pointer-events-none" />

                {/* Shine effect (subtle) */}
                <div className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-white/5 to-transparent" />

                <div className="relative z-10">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <img
                      src={service.icon ?? `/service-icon.svg`}
                      alt={`${service.title} icon`}
                      className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 rounded-sm object-contain shrink-0"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "/icons/default-project.svg";
                      }}
                    />
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white leading-tight flex-1">
                      {service.title}
                    </h3>
                    {service.external && (
                      <a
                        href={service.external}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-white/70 hover:text-white transition-colors z-20"
                        title="View external link"
                      >
                        <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                      </a>
                    )}
                  </div>
                  <p className="text-white/90 text-xs sm:text-sm lg:text-base leading-relaxed mb-3 sm:mb-4 lg:mb-5">
                    {service.description}
                  </p>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                    <a
                      href={service.url}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-block px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 bg-white/25 rounded-full text-white text-sm sm:text-base font-semibold transition-all duration-300 hover:bg-white/35 hover:scale-105 relative z-10 whitespace-nowrap"
                      style={{ color: '#ffffff' }}
                    >
                      Open Service →
                    </a>
                    <span className={`inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 ${statusColors.bg} border ${statusColors.border} rounded-full text-xs sm:text-sm text-white whitespace-nowrap`}>
                      <span className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full ${statusColors.dot} block shrink-0`} />
                      {statusLabel}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* separator between services and projects */}
        <div className="my-10 flex items-center justify-center">
          <div className="h-px bg-white/10 flex-1" />
          <span className="px-4 text-sm text-white/70 uppercase tracking-wider">
            Projects
          </span>
          <div className="h-px bg-white/10 flex-1" />
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up">
          {appData.projects.map((project) => {
            const isRunning = urlStatuses.get(project.url) ?? false;
            const statusColors = getStatusColorClasses(isRunning);
            const statusLabel = getStatusLabel(isRunning);

            return (
              <div
                key={project.id}
                onClick={() => (window.location.href = project.url)}
                className="relative overflow-hidden group rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 cursor-pointer transition-transform duration-200 hover:-translate-y-2"
              >
                {/* Card background */}
                <div className="absolute inset-0 bg-black/35 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl pointer-events-none" />

                {/* Shine effect (subtle) */}
                <div className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-white/5 to-transparent" />

                <div className="relative z-10">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <img
                      src={project.icon ?? `/project-icon.svg`}
                      alt={`${project.title} icon`}
                      className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 rounded-sm object-contain shrink-0"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "/icons/default-project.svg";
                      }}
                    />
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white leading-tight flex-1">
                      {project.title}
                    </h3> 
                    {project.external && (
                      <a
                        href={project.external}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-white/70 hover:text-white transition-colors z-20"
                        title="View external link"
                      >
                        <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                      </a>
                    )}
                  </div>
                  <p className="text-white/90 text-xs sm:text-sm lg:text-base leading-relaxed mb-3 sm:mb-4 lg:mb-5">
                    {project.description}
                  </p>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                    <a
                      href={project.url}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-block px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 bg-white/25 rounded-full text-white text-sm sm:text-base font-semibold transition-all duration-300 hover:bg-white/35 hover:scale-105 relative z-10 whitespace-nowrap"
                      style={{ color: '#ffffff' }}
                    >
                      Open Project →
                    </a>
                    <span className={`inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 ${statusColors.bg} border ${statusColors.border} rounded-full text-xs sm:text-sm text-white whitespace-nowrap`}>
                      <span className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full ${statusColors.dot} block shrink-0`} />
                      {statusLabel}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Internal Pages Link */}
        <div className="flex justify-end right-0 mt-20 mr-10">
          <Link
            to="/commands"
            className="bg-white/12 backdrop-blur-sm border border-white/10 px-6 py-3 rounded-full text-white font-semibold text-base flex items-center justify-center gap-3 transition transform duration-200 hover:bg-white/25 hover:-translate-y-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            📖 Bash Commands Reference
          </Link>
        </div>

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

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeServerLanding />} />
        <Route path="/commands" element={<BashCommandsPage />} />
      </Routes>
    </Router>
  );
}
