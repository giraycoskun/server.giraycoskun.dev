import React, { useState, useMemo } from 'react';
import { Search, Copy, Check, Terminal, ExternalLink, Home } from 'lucide-react';

interface Example {
  code: string;
  desc: string;
}

interface Command {
  id: number;
  category: string;
  command: string;
  syntax: string;
  description: string;
  examples: Example[];
  link?: string;
}

interface Category {
  id: string;
  name: string;
}

const BashCommandsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [customInputs, setCustomInputs] = useState<Record<number, string>>({});

  const commands: Command[] = [
    {
      id: 1,
      category: 'files',
      command: 'ls',
      syntax: 'ls [options] [path]',
      description: 'List directory contents',
      examples: [
        { code: 'ls -la', desc: 'List all files with details' },
        { code: 'ls -lh', desc: 'List with human-readable sizes' },
        { code: 'ls -lt', desc: 'Sort by modification time' }
      ],
    },
    {
      id: 2,
      category: 'files',
      command: 'rm',
      syntax: 'rm [options] file',
      description: 'Remove files or directories',
      examples: [
        { code: 'rm file.txt', desc: 'Delete a file' },
        { code: 'rm -r directory/', desc: 'Delete directory recursively' },
        { code: 'rm -f file.txt', desc: 'Force delete without prompt' }
      ]
    },
    {
      id: 3,
      category: 'video',
      command: 'ffmpeg',
      syntax: 'ffmpeg [options] input_file output_file',
      description: 'Convert, stream, and manipulate multimedia files',
      examples: [
        { code: 'ffmpeg -i input.mp4 output.avi', desc: 'Convert MP4 to AVI' },
        { code: 'ffmpeg -i input.mp4 -vf "scale=640:480" output.mp4', desc: 'Resize video' },
        { code: 'ffmpeg -protocol_whitelist file,crypto,data,http,https,tls,tcp -i "http://example.com/stream/playlist.m3u8" -c copy -bsf:a aac_adtstoasc video.mp4', desc: 'Download HLS stream' }
      ]
    },
    {
      id: 4,
      category: 'text',
      command: 'sed',
      syntax: 'sed [options] script [file]',
      description: 'Stream editor for text manipulation',
      examples: [
        { code: 'sed \'s/old/new/g\' file.txt', desc: 'Replace text' },
        { code: 'sed -i \'s/foo/bar/g\' file.txt', desc: 'Replace in-place' },
        { code: 'sed -n \'10,20p\' file.txt', desc: 'Print lines 10-20' }
      ]
    },
    {
      id: 5,
      category: 'process',
      command: 'ps',
      syntax: 'ps [options]',
      description: 'Display running processes',
      examples: [
        { code: 'ps aux', desc: 'List all processes' },
        { code: 'ps aux | grep nginx', desc: 'Find specific process' },
        { code: 'ps -ef', desc: 'Full format listing' }
      ]
    },
    {
      id: 6,
      category: 'process',
      command: 'top',
      syntax: 'top [options]',
      description: 'Display real-time system processes',
      examples: [
        { code: 'top', desc: 'Interactive process viewer' },
        { code: 'top -u username', desc: 'Show processes for user' },
        { code: 'top -n 1', desc: 'Run once and exit' }
      ]
    },
    {
      id: 11,
      category: 'system',
      command: 'df',
      syntax: 'df [options] [filesystem]',
      description: 'Display disk space usage',
      examples: [
        { code: 'df -h', desc: 'Human-readable disk space' },
        { code: 'df -i', desc: 'Show inode information' },
        { code: 'df -T', desc: 'Show filesystem types' }
      ]
    },
    {
      id: 12,
      category: 'system',
      command: 'du',
      syntax: 'du [options] [path]',
      description: 'Estimate file and directory space usage',
      examples: [
        { code: 'du -sh *', desc: 'Summary of all items' },
        { code: 'du -h --max-depth=1', desc: 'Show first level only' },
        { code: 'du -ah | sort -rh | head -20', desc: 'Top 20 largest files' }
      ]
    },
    {
      id: 13,
      category: 'network',
      command: 'ss',
      syntax: 'ss [options]',
      description: 'Display socket statistics',
      examples: [
        { code: 'ss -tuln', desc: 'List all listening TCP/UDP ports' },
        { code: 'ss -tulnp | grep :PORT', desc: 'To check if a port is in use' },
      ],
      link: "https://man7.org/linux/man-pages/man8/ss.8.html"
    },
    {
      id: 14,
      category: 'permissions',
      command: 'chmod',
      syntax: 'chmod [options] mode file',
      description: 'Change file permissions',
      examples: [
        { code: 'chmod 755 script.sh', desc: 'Make file executable' },
        { code: 'chmod +x file.sh', desc: 'Add execute permission' },
        { code: 'chmod -R 644 dir/', desc: 'Recursive permission change' }
      ]
    },
    {
      id: 15,
      category: 'permissions',
      command: 'chown',
      syntax: 'chown [options] user:group file',
      description: 'Change file owner and group',
      examples: [
        { code: 'chown user file.txt', desc: 'Change owner' },
        { code: 'chown user:group file.txt', desc: 'Change owner and group' },
        { code: 'chown -R user:group dir/', desc: 'Recursive ownership change' }
      ]
    },
    {
      id: 16,
      category: 'files',
      command: 'find',
      syntax: 'find [path] [options]',
      description: 'Search for files in directory hierarchy',
      examples: [
        { code: 'find . -name "*.txt"', desc: 'Find files by name' },
        { code: 'find . -type f -mtime -7', desc: 'Files modified in last 7 days' },
        { code: 'find . -size +100M', desc: 'Files larger than 100MB' }
      ]
    },
    {
      id: 17,
      category: 'process',
      command: 'kill',
      syntax: 'kill [options] pid',
      description: 'Send signal to process',
      examples: [
        { code: 'kill 1234', desc: 'Terminate process by PID' },
        { code: 'kill -9 1234', desc: 'Force kill process' },
        { code: 'killall process_name', desc: 'Kill all processes by name' }
      ]
    },
    {
      id: 18,
      category: 'process',
      command: 'nohup',
      syntax: 'nohup command [args] &',
      description: 'Run command immune to hangups',
      examples: [
        { code: 'nohup myscript.sh &', desc: 'Run script in background' },
      ]
    },
    {
      id: 19,
      category: 'vim',
      command: 'vim :1,$d',
      syntax: ':1,$d',
      description: 'Select and Delete all lines in the file',
      examples: [
        { code: ':1,$d', desc: 'Delete all lines from line 1 to the end' },
      ]
    },
    {
      id: 20,
      category: 'process',
      command: 'nginx -t',
      syntax: 'nginx -t',
      description: 'Test Nginx configuration for syntax errors',
      examples: [
        { code: 'nginx -t', desc: 'Check Nginx config syntax' },
        { code: 'sudo nginx -t && sudo systemctl reload nginx', desc: 'Reload Nginx after config changes' },
      ]
    },
    {
      id: 21,
      category: 'process',
      command: 'systemctl reload <service>',
      syntax: 'systemctl reload <service>',
      description: 'Reload systemd service without downtime',
      examples: [
        { code: 'systemctl reload nginx', desc: 'Reload Nginx service' },
      ]
    },
    {
      id: 22,
      category: 'process',
      command: 'systemctl status <service>',
      syntax: 'systemctl status <service>',
      description: 'Check the status of a systemd service',
      examples: [
        { code: 'systemctl status nginx', desc: 'Check Nginx service status' },
      ]
    },
    {
      id: 23,
      category: 'tmux',
      command: 'tmux',
      syntax: 'tmux [options]',
      description: 'Terminal multiplexer to manage multiple terminal sessions',
      examples: [
        { code: 'tmux new -s session_name', desc: 'Create a new tmux session' },
        { code: 'tmux attach -t session_name', desc: 'Attach to an existing session' },
        { code: 'tmux ls', desc: 'List all tmux sessions' }
      ]
    },
    {
      id: 24,
      category: 'tmux',
      command: 'Ctrl+b c',
      syntax: 'Ctrl+b c',
      description: 'Create a new tmux window',
      examples: [
        { code: 'Ctrl+b c', desc: 'Create a new window in current session' },
      ]
    }
  ];

  const categories: Category[] = [
    { id: 'all', name: 'All Commands' },
    { id: 'files', name: 'Files' },
    { id: 'video', name: 'Video Processing' },
    { id: 'network', name: 'Network' },
    { id: 'process', name: 'Process Management' },
    { id: 'system', name: 'System' },
    { id: 'docker', name: 'Docker' },
    { id: 'tmux', name: 'Tmux' },
    { id: 'vim', name: 'Vim' },
  ];

  const filteredCommands = useMemo(() => {
    return commands.filter(cmd => {
      const matchesCategory = activeCategory === 'all' || cmd.category === activeCategory;
      const matchesSearch = searchQuery === '' || 
        cmd.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cmd.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cmd.examples.some(ex => ex.code.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const copyToClipboard = (text: string, id: string): void => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Terminal className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Bash Commands Reference</h1>
            </div>
            <a
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </a>
          </div>
          <p className="text-gray-400">Quick reference for commonly used bash commands</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search commands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-blue-600 text-gray-400'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Commands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCommands.map(cmd => (
            <div key={cmd.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
              {/* Command Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <code className="text-lg font-bold text-gray-900">{cmd.command}</code>
                    {cmd.link && (
                      <a
                        href={cmd.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="View documentation"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{cmd.description}</p>
                </div>
              </div>

              {/* Syntax */}
              <div className="mb-3 bg-gray-900 rounded p-2 relative group">
                <code className="text-sm text-green-400 font-mono">{cmd.syntax}</code>
                <button
                  onClick={() => copyToClipboard(cmd.syntax, `syntax-${cmd.id}`)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {copiedId === `syntax-${cmd.id}` ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400 hover:text-white" />
                  )}
                </button>
              </div>

              {/* Examples */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase">Examples:</p>
                {cmd.examples.map((ex, idx) => (
                  <div key={idx} className="bg-gray-50 rounded p-2">
                    <div className="flex items-start justify-between gap-2 mb-1 group">
                      <code className="text-sm text-gray-900 font-mono flex-1 break-all">{ex.code}</code>
                      <button
                        onClick={() => copyToClipboard(ex.code, `ex-${cmd.id}-${idx}`)}
                        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {copiedId === `ex-${cmd.id}-${idx}` ? (
                          <Check className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-gray-400 hover:text-gray-700" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-600">{ex.desc}</p>
                  </div>
                ))}
              </div>

              {/* Custom Input */}
              <div className="mt-3 space-y-1">
                <p className="text-xs font-semibold text-gray-500 uppercase">Custom:</p>
                <div className="relative">
                  <textarea
                    value={customInputs[cmd.id] || ''}
                    onChange={(e) =>
                      setCustomInputs((prev) => ({ ...prev, [cmd.id]: e.target.value }))
                    }
                    placeholder="Write your own command variant here..."
                    rows={2}
                    className="w-full pr-8 px-2 py-1 text-sm border border-gray-200 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white resize-y font-mono"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      customInputs[cmd.id] &&
                      copyToClipboard(customInputs[cmd.id], `custom-${cmd.id}`)
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                    disabled={!customInputs[cmd.id]}
                 >
                    {copiedId === `custom-${cmd.id}` ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCommands.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No commands found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BashCommandsPage;