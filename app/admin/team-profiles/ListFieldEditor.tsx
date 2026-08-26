'use client';

interface ListFieldEditorProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}

export default function ListFieldEditor({ label, items, onChange, placeholder }: ListFieldEditorProps) {
  const addItem = () => {
    onChange([...(items || []), '']);
  };

  const updateItem = (index: number, value: string) => {
    const next = [...items];
    next[index] = value;
    onChange(next);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-medium text-slate-400">{label}</label>
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-[#06B6D4] hover:bg-[#06B6D4]/10 transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-add-line w-3.5 h-3.5 flex items-center justify-center" />
          Add
        </button>
      </div>
      <div className="space-y-2">
        {items.length === 0 && (
          <p className="text-xs text-slate-600 px-1">No items added yet.</p>
        )}
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder={placeholder || `Item ${index + 1}`}
              className="flex-1 px-3 py-2 bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-lg text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 focus:border-[#06B6D4]/40"
            />
            <button
              type="button"
              onClick={() => moveItem(index, -1)}
              disabled={index === 0}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <i className="ri-arrow-up-line w-3.5 h-3.5 flex items-center justify-center" />
            </button>
            <button
              type="button"
              onClick={() => moveItem(index, 1)}
              disabled={index === items.length - 1}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <i className="ri-arrow-down-line w-3.5 h-3.5 flex items-center justify-center" />
            </button>
            <button
              type="button"
              onClick={() => removeItem(index)}
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