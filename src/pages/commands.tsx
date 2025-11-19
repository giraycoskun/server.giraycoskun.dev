import React, { useState, useMemo } from 'react';
import { Search, Copy, Check, Terminal } from 'lucide-react';

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
  tags: string[];
}

interface Category {
  id: string;
  name: string;
}

const BashCommandsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
      tags: ['beginner']
    },
    {
      id: 2,
      category: 'files',
      command: 'cd',
      syntax: 'cd [path]',
      description: 'Change directory',
      examples: [
        { code: 'cd ~', desc: 'Go to home directory' },
        { code: 'cd ..', desc: 'Go up one directory' },
        { code: 'cd -', desc: 'Go to previous directory' }
      ],
      tags: ['beginner']
    },
    {
      id: 3,
      category: 'files',
      command: 'cp',
      syntax: 'cp [options] source dest',
      description: 'Copy files or directories',
      examples: [
        { code: 'cp file.txt backup.txt', desc: 'Copy a file' },
        { code: 'cp -r dir1 dir2', desc: 'Copy directory recursively' },
        { code: 'cp -i file.txt dest/', desc: 'Interactive copy (prompt before overwrite)' }
      ],
      tags: ['beginner']
    },
    {
      id: 4,
      category: 'files',
      command: 'mv',
      syntax: 'mv [options] source dest',
      description: 'Move or rename files',
      examples: [
        { code: 'mv old.txt new.txt', desc: 'Rename a file' },
        { code: 'mv file.txt /path/to/dir/', desc: 'Move file to directory' },
        { code: 'mv -i *.txt backup/', desc: 'Move with confirmation' }
      ],
      tags: ['beginner']
    },
    {
      id: 5,
      category: 'files',
      command: 'rm',
      syntax: 'rm [options] file',
      description: 'Remove files or directories',
      examples: [
        { code: 'rm file.txt', desc: 'Delete a file' },
        { code: 'rm -r directory/', desc: 'Delete directory recursively' },
        { code: 'rm -f file.txt', desc: 'Force delete without prompt' }
      ],
      tags: ['dangerous']
    },
    {
      id: 6,
      category: 'text',
      command: 'grep',
      syntax: 'grep [options] pattern [file]',
      description: 'Search text patterns in files',
      examples: [
        { code: 'grep "error" log.txt', desc: 'Search for text in file' },
        { code: 'grep -r "TODO" .', desc: 'Recursive search in directory' },
        { code: 'grep -i "warning" file.txt', desc: 'Case-insensitive search' }
      ],
      tags: ['beginner']
    },
    {
      id: 7,
      category: 'text',
      command: 'cat',
      syntax: 'cat [options] [file]',
      description: 'Display file contents',
      examples: [
        { code: 'cat file.txt', desc: 'Display file content' },
        { code: 'cat file1.txt file2.txt', desc: 'Concatenate files' },
        { code: 'cat -n file.txt', desc: 'Display with line numbers' }
      ],
      tags: ['beginner']
    },
    {
      id: 8,
      category: 'text',
      command: 'sed',
      syntax: 'sed [options] script [file]',
      description: 'Stream editor for text manipulation',
      examples: [
        { code: 'sed \'s/old/new/g\' file.txt', desc: 'Replace text' },
        { code: 'sed -i \'s/foo/bar/g\' file.txt', desc: 'Replace in-place' },
        { code: 'sed -n \'10,20p\' file.txt', desc: 'Print lines 10-20' }
      ],
      tags: ['advanced']
    },
    {
      id: 9,
      category: 'system',
      command: 'ps',
      syntax: 'ps [options]',
      description: 'Display running processes',
      examples: [
        { code: 'ps aux', desc: 'List all processes' },
        { code: 'ps aux | grep nginx', desc: 'Find specific process' },
        { code: 'ps -ef', desc: 'Full format listing' }
      ],
      tags: ['beginner']
    },
    {
      id: 10,
      category: 'system',
      command: 'top',
      syntax: 'top [options]',
      description: 'Display real-time system processes',
      examples: [
        { code: 'top', desc: 'Interactive process viewer' },
        { code: 'top -u username', desc: 'Show processes for user' },
        { code: 'top -n 1', desc: 'Run once and exit' }
      ],
      tags: ['beginner']
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
      ],
      tags: ['beginner']
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
      ],
      tags: ['beginner']
    },
    {
      id: 13,
      category: 'network',
      command: 'curl',
      syntax: 'curl [options] [URL]',
      description: 'Transfer data from or to a server',
      examples: [
        { code: 'curl https://api.example.com', desc: 'GET request' },
        { code: 'curl -X POST -d "data" url', desc: 'POST with data' },
        { code: 'curl -I https://example.com', desc: 'Fetch headers only' }
      ],
      tags: ['beginner']
    },
    {
      id: 14,
      category: 'network',
      command: 'wget',
      syntax: 'wget [options] [URL]',
      description: 'Download files from the web',
      examples: [
        { code: 'wget https://example.com/file.zip', desc: 'Download file' },
        { code: 'wget -c url', desc: 'Resume interrupted download' },
        { code: 'wget -r -np url', desc: 'Recursive download' }
      ],
      tags: ['beginner']
    },
    {
      id: 15,
      category: 'network',
      command: 'netstat',
      syntax: 'netstat [options]',
      description: 'Network statistics and connections',
      examples: [
        { code: 'netstat -tuln', desc: 'Show listening ports' },
        { code: 'netstat -an', desc: 'All connections and ports' },
        { code: 'netstat -r', desc: 'Show routing table' }
      ],
      tags: ['advanced']
    },
    {
      id: 16,
      category: 'permissions',
      command: 'chmod',
      syntax: 'chmod [options] mode file',
      description: 'Change file permissions',
      examples: [
        { code: 'chmod 755 script.sh', desc: 'Make file executable' },
        { code: 'chmod +x file.sh', desc: 'Add execute permission' },
        { code: 'chmod -R 644 dir/', desc: 'Recursive permission change' }
      ],
      tags: ['beginner']
    },
    {
      id: 17,
      category: 'permissions',
      command: 'chown',
      syntax: 'chown [options] user:group file',
      description: 'Change file owner and group',
      examples: [
        { code: 'chown user file.txt', desc: 'Change owner' },
        { code: 'chown user:group file.txt', desc: 'Change owner and group' },
        { code: 'chown -R user:group dir/', desc: 'Recursive ownership change' }
      ],
      tags: ['advanced']
    },
    {
      id: 18,
      category: 'text',
      command: 'awk',
      syntax: 'awk [options] \'pattern {action}\' file',
      description: 'Pattern scanning and text processing',
      examples: [
        { code: 'awk \'{print $1}\' file.txt', desc: 'Print first column' },
        { code: 'awk \'/pattern/ {print $0}\' file', desc: 'Print matching lines' },
        { code: 'awk -F: \'{print $1}\' /etc/passwd', desc: 'Use custom delimiter' }
      ],
      tags: ['advanced']
    },
    {
      id: 19,
      category: 'files',
      command: 'find',
      syntax: 'find [path] [options]',
      description: 'Search for files in directory hierarchy',
      examples: [
        { code: 'find . -name "*.txt"', desc: 'Find files by name' },
        { code: 'find . -type f -mtime -7', desc: 'Files modified in last 7 days' },
        { code: 'find . -size +100M', desc: 'Files larger than 100MB' }
      ],
      tags: ['beginner']
    },
    {
      id: 20,
      category: 'system',
      command: 'kill',
      syntax: 'kill [options] pid',
      description: 'Send signal to process',
      examples: [
        { code: 'kill 1234', desc: 'Terminate process by PID' },
        { code: 'kill -9 1234', desc: 'Force kill process' },
        { code: 'killall process_name', desc: 'Kill all processes by name' }
      ],
      tags: ['dangerous']
    }
  ];

  const categories: Category[] = [
    { id: 'all', name: 'All Commands' },
    { id: 'files', name: 'Files' },
    { id: 'text', name: 'Text Processing' },
    { id: 'system', name: 'System' },
    { id: 'network', name: 'Network' },
    { id: 'permissions', name: 'Permissions' }
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

  const getTagColor = (tag: string): string => {
    switch(tag) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'advanced': return 'bg-purple-100 text-purple-700';
      case 'dangerous': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Terminal className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Bash Commands Reference</h1>
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
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-blue-600 text-white'
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
                    {cmd.tags.map(tag => (
                      <span key={tag} className={`text-xs px-2 py-0.5 rounded-full ${getTagColor(tag)}`}>
                        {tag}
                      </span>
                    ))}
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