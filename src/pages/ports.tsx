import React, { useState } from "react";
import { Search, Network, ArrowRight, Home } from "lucide-react";
import appData from "../data/data.tsx";

const categoryColors: Record<string, string> = {
  systemd: "from-orange-500 to-orange-700",
  docker: "from-blue-500 to-blue-700",
  nginx: "from-lime-500 to-lime-700",
  default: "from-rose-500 to-rose-600",
};

const defaultDescription = "";

const PortMappingPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredPort, setHoveredPort] = useState<number | null>(null);

  const normalizedServices = React.useMemo(() => {
    return appData.services
      .map((mapping) => {
        const category = mapping.category ?? "default";
        const description = mapping.description ?? defaultDescription;
        const categoryColor =
          categoryColors[category] ?? categoryColors["default"];

        return {
          title: mapping.title,
          port: mapping.port,
          url: mapping.url,
          icon: mapping.icon ?? "",
          category,
          description,
          categoryColor,
        };
      })
      .sort((a, b) => a.port - b.port);
  }, []);

  const filteredServiceMappings = React.useMemo(() => {
    const search = searchTerm.toLowerCase();
    return normalizedServices.filter(
      (mapping) =>
        mapping.port.toString().includes(searchTerm) ||
        mapping.title.toLowerCase().includes(search) ||
        mapping.description.toLowerCase().includes(search)
    );
  }, [searchTerm, normalizedServices]);

  const normalizedProjects = React.useMemo(() => {
    return appData.projects
      .filter(
        (mapping): mapping is typeof mapping & { port: number } =>
          mapping.port !== undefined
      )
      .map((mapping) => {
        const category = mapping.category ?? "default";
        const description = mapping.description ?? defaultDescription;
        const categoryColor =
          categoryColors[category] ?? categoryColors["default"];

        return {
          title: mapping.title,
          port: mapping.port,
          url: mapping.url,
          icon: mapping.icon ?? "",
          category,
          description,
          categoryColor,
        };
      })
      .sort((a, b) => a.port - b.port);
  }, []);

  const filteredProjectMappings = React.useMemo(() => {
    const search = searchTerm.toLowerCase();

    return normalizedProjects.filter(
      (mapping) =>
        mapping.port.toString().includes(searchTerm) ||
        mapping.title.toLowerCase().includes(search) ||
        mapping.description.toLowerCase().includes(search)
    );
  }, [searchTerm, normalizedProjects]);

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

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by port, service, category, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* separator between services and projects */}
        <div className="my-10 flex items-center justify-center">
          <div className="h-px bg-white/10 flex-1" />
          <span className="px-4 text-sm text-white/70 uppercase tracking-wider">
            Services
          </span>
          <div className="h-px bg-white/10 flex-1" />
        </div>

        {/* Service Port Mappings - Visual Flow */}
        <div className="space-y-3">
          {filteredServiceMappings.map((mapping) => (
            <div
              key={mapping.port}
              className="relative"
              onMouseEnter={() => setHoveredPort(mapping.port)}
              onMouseLeave={() => setHoveredPort(null)}
            >
              <div className="flex items-center gap-4 bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-all duration-300">
                {/* Port Section */}
                <div className="shrink-0 w-32">
                  <div className="bg-linear-to-r from-slate-700 to-slate-600 rounded-lg p-4 text-center">
                    <div className="text-xs text-slate-400 mb-1">PORT</div>
                    <div className="text-3xl font-bold text-white">
                      {mapping.port}
                    </div>
                  </div>
                </div>

                {/* Connection Line */}
                <div className="shrink-0 relative">
                  <div
                    className={`relative h-1 w-16 bg-linear-to-r ${
                      mapping.categoryColor
                    } rounded-full transition-all duration-300 ${
                      hoveredPort === mapping.port ? "w-24" : ""
                    }`}
                  >
                    <div
                      className={`absolute top-1/2 -translate-y-1/2 transition-all duration-300
                      ${
                        hoveredPort === mapping.port
                          ? "right-0 translate-x-1/2"
                          : "left-1/2 -translate-x-1/2"
                      }`}
                    >
                      <ArrowRight
                        strokeWidth={5}
                        className="w-5 h-5 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Service Section */}
                <div className="flex-1 min-w-0">
                  <div
                    className={`bg-linear-to-r ${
                      mapping.categoryColor
                    } rounded-lg p-4 transition-all duration-300 ${
                      hoveredPort === mapping.port
                        ? "shadow-lg scale-[1.02]"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {mapping.icon && (
                          <img
                            src={`/${mapping.icon}`}
                            alt={`${mapping.title} icon`}
                            className="w-8 h-8"
                          />
                        )}
                        {mapping.url ? (
                          <a
                            href={mapping.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-2xl font-bold text-white hover:underline"
                          >
                            {mapping.title}
                          </a>
                        ) : (
                          <h3 className="text-2xl font-bold text-white">
                            {mapping.title}
                          </h3>
                        )}
                      </div>
                      <span className="text-xs px-3 py-1 bg-white/20 text-white rounded-full">
                        {mapping.category}
                      </span>
                    </div>
                    <p className="text-sm text-white/90 mb-2">
                      {mapping.description}
                    </p>
                    {mapping.url && (
                      <a
                        href={mapping.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-white/70 hover:text-white transition-colors"
                      >
                        {mapping.url}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* separator between services and projects */}
        {filteredProjectMappings.length > 0 && (
          <div className="my-10 flex items-center justify-center">
            <div className="h-px bg-white/10 flex-1" />
            <span className="px-4 text-sm text-white/70 uppercase tracking-wider">
              Projects
            </span>
            <div className="h-px bg-white/10 flex-1" />
          </div>
        )}

        {/* Project Port Mappings - Visual Flow */}
        <div className="space-y-3">
          {filteredProjectMappings.map((mapping) => (
            <div
              key={mapping.port}
              className="relative"
              onMouseEnter={() => setHoveredPort(mapping.port)}
              onMouseLeave={() => setHoveredPort(null)}
            >
              <div className="flex items-center gap-4 bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-all duration-300">
                {/* Port Section */}
                <div className="shrink-0 w-32">
                  <div className="bg-linear-to-r from-slate-700 to-slate-600 rounded-lg p-4 text-center">
                    <div className="text-xs text-slate-400 mb-1">PORT</div>
                    <div className="text-3xl font-bold text-white">
                      {mapping.port}
                    </div>
                  </div>
                </div>

                {/* Connection Line */}
                <div className="shrink-0 relative">
                  <div
                    className={`relative h-1 w-16 bg-linear-to-r ${
                      mapping.categoryColor
                    } rounded-full transition-all duration-300 ${
                      hoveredPort === mapping.port ? "w-24" : ""
                    }`}
                  >
                    <div
                      className={`absolute top-1/2 -translate-y-1/2 transition-all duration-300
                      ${
                        hoveredPort === mapping.port
                          ? "right-0 translate-x-1/2"
                          : "left-1/2 -translate-x-1/2"
                      }`}
                    >
                      <ArrowRight
                        strokeWidth={5}
                        className="w-5 h-5 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Service Section */}
                {/* Service Section */}
                <div className="flex-1 min-w-0">
                  <div
                    className={`bg-linear-to-r ${
                      mapping.categoryColor
                    } rounded-lg p-4 transition-all duration-300 ${
                      hoveredPort === mapping.port
                        ? "shadow-lg scale-[1.02]"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {mapping.icon && (
                          <img
                            src={`/${mapping.icon}`}
                            alt={`${mapping.title} icon`}
                            className="w-8 h-8"
                          />
                        )}
                        {mapping.url ? (
                          <a
                            href={mapping.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-2xl font-bold text-white hover:underline"
                          >
                            {mapping.title}
                          </a>
                        ) : (
                          <h3 className="text-2xl font-bold text-white">
                            {mapping.title}
                          </h3>
                        )}
                      </div>
                      <span className="text-xs px-3 py-1 bg-white/20 text-white rounded-full">
                        {mapping.category}
                      </span>
                    </div>
                    <p className="text-sm text-white/90 mb-2">
                      {mapping.description}
                    </p>
                    {mapping.url && (
                      <a
                        href={mapping.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-white/70 hover:text-white transition-colors"
                      >
                        {mapping.url}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredServiceMappings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">
              No matching ports or services found
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-slate-500 text-sm">
          Showing{" "}
          {filteredServiceMappings.length + filteredProjectMappings.length} of{" "}
          {filteredServiceMappings.length + filteredProjectMappings.length} port
          mappings
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
};

export default PortMappingPage;
