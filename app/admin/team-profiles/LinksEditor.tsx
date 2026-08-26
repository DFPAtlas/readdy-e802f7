'use client';

export interface LinkEntry {
  platform: string;
  url: string;
}

interface LinksEditorProps {
  entries: LinkEntry[];
  onChange: (entries: LinkEntry[]) => void;
}

export default function LinksEditor({ entries, onChange }: LinksEditorProps) {
  const addEntry = () => {
    onChange([...entries, { platform: '', url: '' }]);
  };

  const updateEntry = (index: number, field: 'platform' | 'url', value: string) => {
    const next = entries.map((e, i) => (i === index ? { ...e, [field]: value } : e));
    onChange(next);
  };

  const removeEntry = (index: number) => {
    onChange(entries.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-medium text-slate-400">Professional Links</label>
        <button
          type="button"
          onClick={addEntry}
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-[#06B6D4] hover:bg-[#06B6D4]/10 transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-add-line w-3.5 h-3.5 flex items-center justify-center" />
          Add link
        </button>
      </div>
      <div className="space-y-2">
        {entries.length === 0 && (
          <p className="text-xs text-slate-600 px-1">No links added yet.</p>
        )}
        {entries.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={entry.platform}
              onChange={(e) => updateEntry(index, 'platform', e.target.value)}
              placeholder="Platform (e.g. linkedin)"
              className="w-40 px-3 py-2 bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-lg text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 focus:border-[#06B6D4]/40"
            />
            <input
              type="text"
              value={entry.url}
              onChange={(e) => updateEntry(index, 'url', e.target.value)}
              placeholder="https://..."
              className="flex-1 px-3 py-2 bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-lg text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 focus:border-[#06B6D4]/40"
            />
            <button
              type="button"
              onClick={() => removeEntry(index)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <i className="ri-delete-bin-line w-3.5 h-3.5 flex items-center justify-center" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}