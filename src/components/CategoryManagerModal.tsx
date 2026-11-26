import React, { useState } from 'react';
import { X, SlidersHorizontal, Eye, EyeOff, Edit2, Check, RotateCcw } from 'lucide-react';
import { CategoryConfig } from '../types';

interface CategoryManagerModalProps {
  categories: CategoryConfig[];
  onSaveCategories: (categories: CategoryConfig[]) => void;
  onClose: () => void;
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  categories,
  onSaveCategories,
  onClose,
}) => {
  const [localCats, setLocalCats] = useState<CategoryConfig[]>(categories);
  const [editingName, setEditingName] = useState<string | null>(null);
  const [tempDisplayName, setTempDisplayName] = useState<string>('');

  const handleToggleHide = (origName: string) => {
    const updated = localCats.map((c) =>
      c.originalName === origName ? { ...c, hidden: !c.hidden } : c
    );
    setLocalCats(updated);
  };

  const handleStartRename = (cat: CategoryConfig) => {
    setEditingName(cat.originalName);
    setTempDisplayName(cat.displayName);
  };

  const handleFinishRename = (origName: string) => {
    if (!tempDisplayName.trim()) return;
    const updated = localCats.map((c) =>
      c.originalName === origName ? { ...c, displayName: tempDisplayName.trim() } : c
    );
    setLocalCats(updated);
    setEditingName(null);
  };

  const handleSaveAndClose = () => {
    onSaveCategories(localCats);
    onClose();
  };

  const handleResetDefaults = () => {
    const defaults: CategoryConfig[] = [
      { originalName: 'Local', displayName: 'Local & Regional', hidden: false },
      { originalName: 'Sports', displayName: 'Sports 24/7', hidden: false },
      { originalName: 'News', displayName: 'Breaking News', hidden: false },
      { originalName: 'Movies', displayName: 'Movies & Cinema', hidden: false },
      { originalName: 'Kids', displayName: 'Kids & Family', hidden: false },
      { originalName: 'International', displayName: 'International', hidden: false },
    ];
    setLocalCats(defaults);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-cable-900 border border-cable-border rounded-2xl max-w-xl w-full flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-cable-border bg-cable-950">
          <div className="flex items-center space-x-3">
            <SlidersHorizontal className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-lg font-bold text-white">Customize Categories</h3>
              <p className="text-xs text-slate-400">
                Rename category labels or hide categories you don't watch.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-cable-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of categories */}
        <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
          {localCats.map((cat) => {
            const isEditing = editingName === cat.originalName;

            return (
              <div
                key={cat.originalName}
                className={`flex items-center justify-between p-3 rounded-xl border transition ${
                  cat.hidden
                    ? 'bg-cable-950/40 border-cable-border/40 opacity-60'
                    : 'bg-cable-950 border-cable-border'
                }`}
              >
                {/* Name / Rename Input */}
                <div className="flex-1 mr-3 min-w-0">
                  {isEditing ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={tempDisplayName}
                        onChange={(e) => setTempDisplayName(e.target.value)}
                        autoFocus
                        className="bg-cable-900 border border-amber-400 text-xs px-2.5 py-1 rounded text-white w-full focus:outline-none"
                      />
                      <button
                        onClick={() => handleFinishRename(cat.originalName)}
                        className="p-1 bg-amber-400 text-black rounded hover:bg-amber-300"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-white">{cat.displayName}</span>
                        {cat.displayName !== cat.originalName && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            (was: {cat.originalName})
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        Status: {cat.hidden ? 'Hidden from Live TV' : 'Visible'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action buttons: Rename & Hide/Show */}
                <div className="flex items-center space-x-2 shrink-0">
                  {!isEditing && (
                    <button
                      onClick={() => handleStartRename(cat)}
                      className="p-1.5 rounded-lg bg-cable-850 hover:bg-cable-800 text-slate-300 hover:text-white border border-cable-border text-xs flex items-center space-x-1"
                      title="Rename category"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span className="text-[11px] hidden sm:inline">Rename</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleToggleHide(cat.originalName)}
                    className={`p-1.5 rounded-lg border text-xs flex items-center space-x-1 ${
                      cat.hidden
                        ? 'bg-neutral-800 border-neutral-700 text-slate-400 hover:text-white'
                        : 'bg-cable-850 border-cable-border text-amber-400 hover:bg-cable-800'
                    }`}
                    title={cat.hidden ? 'Show category' : 'Hide category'}
                  >
                    {cat.hidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span className="text-[11px] hidden sm:inline">
                      {cat.hidden ? 'Hidden' : 'Visible'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-cable-950 border-t border-cable-border flex items-center justify-between">
          <button
            onClick={handleResetDefaults}
            className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Defaults</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-cable-800 text-slate-300 text-xs font-semibold hover:bg-cable-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAndClose}
              className="px-5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs cable-focus-ring"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
