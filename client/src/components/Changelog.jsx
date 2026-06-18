import React, { useState } from 'react';
import Badge from './common/Badge';
import changelog from '../data/changelog';
import { FiPlus, FiArrowUpRight, FiZap, FiCheck, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { format } from 'date-fns';

const typeConfig = {
  feature: { icon: <FiPlus className="w-3.5 h-3.5" />, bg: 'bg-green-500/15', text: 'text-green-600 dark:text-green-400', label: 'New' },
  improvement: { icon: <FiArrowUpRight className="w-3.5 h-3.5" />, bg: 'bg-sky-500/15', text: 'text-sky-600 dark:text-sky-400', label: 'Improved' },
  fix: { icon: <FiCheck className="w-3.5 h-3.5" />, bg: 'bg-amber-500/15', text: 'text-amber-600 dark:text-amber-400', label: 'Fixed' },
};

function VersionCard({ entry, isLatest, defaultExpanded }) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className={`relative pl-8 pb-8 ${isLatest ? '' : ''}`}>
      <div className={`absolute left-0 top-0 bottom-0 w-px ${isLatest ? 'bg-violet-300 dark:bg-violet-600' : 'bg-gray-200 dark:bg-gray-700/60'}`} />
      <div className={`absolute left-[-5px] top-1.5 w-[11px] h-[11px] rounded-full border-2 ${isLatest ? 'bg-violet-500 border-violet-200 dark:border-violet-800' : 'bg-gray-300 dark:bg-gray-600 border-gray-100 dark:border-gray-800'}`} />

      <div className={`bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/60 overflow-hidden transition-all ${expanded ? '' : ''}`}>
        <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-100/50 dark:hover:bg-gray-700/30 transition">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-lg font-bold text-gray-900 dark:text-white">v{entry.version}</span>
            {entry.tag && (
              <Badge variant={entry.tag === 'Latest' ? 'violet' : 'default'} size="sm">{entry.tag}</Badge>
            )}
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {format(new Date(entry.date), 'MMM dd, yyyy')}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-3">
            {entry.highlights?.slice(0, 2).map((h, i) => (
              <span key={i} className="hidden sm:inline-flex items-center text-xs bg-gray-200/60 dark:bg-gray-700/60 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">{h}</span>
            ))}
            {expanded ? <FiChevronUp className="w-4 h-4 text-gray-400" /> : <FiChevronDown className="w-4 h-4 text-gray-400" />}
          </div>
        </button>

        {expanded && (
          <div className="px-5 pb-5 space-y-3 border-t border-gray-200 dark:border-gray-700/60 pt-4">
            {entry.changes.map((change, i) => {
              const config = typeConfig[change.type] || typeConfig.feature;
              return (
                <div key={i} className="flex items-start gap-3">
                  <span className={`mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${config.bg} ${config.text}`}>
                    {config.icon}
                  </span>
                  <div>
                    <span className={`text-xs font-semibold uppercase tracking-wide ${config.text}`}>{config.label}</span>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{change.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Changelog() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-200 dark:border-violet-800/40">
          <FiZap className="w-3.5 h-3.5 text-violet-500" />
          <span className="text-xs font-semibold text-violet-600 dark:text-violet-400">v{changelog[0]?.version}</span>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Latest release</span>
      </div>

      <div>
        {changelog.map((entry, i) => (
          <VersionCard key={entry.version} entry={entry} isLatest={i === 0} defaultExpanded={i === 0} />
        ))}
      </div>
    </div>
  );
}

export default Changelog;
