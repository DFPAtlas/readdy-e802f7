'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from '@/components/motion';
import { RECOVERED_TEAM_IMAGES, buildInitials } from '@/lib/team-images';
import { useCmsMedia, type CmsMedia } from '@/hooks/useCmsData';

interface ProfileImageEditorProps {
  value: string;
  altText: string;
  name: string;
  onChange: (value: string) => void;
  onAltTextChange: (altText: string) => void;
}

const MAX_ALT_LENGTH = 160;

function isValidHttpUrl(value: string): boolean {
  if (!value.trim()) return true;
  try {
    const u = new URL(value.trim());
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

function isImageMedia(media: CmsMedia): boolean {
  return (media.mime_type || '').startsWith('image/') && !!media.public_url;
}

export default function ProfileImageEditor({
  value,
  altText,
  name,
  onChange,
  onAltTextChange,
}: ProfileImageEditorProps) {
  const { media, loading: mediaLoading } = useCmsMedia();

  const [mediaOpen, setMediaOpen] = useState(false);
  const [recoveredOpen, setRecoveredOpen] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [urlTouched, setUrlTouched] = useState(false);
  const [mediaQuery, setMediaQuery] = useState('');

  const initials = buildInitials(name || '?');
  const urlValid = isValidHttpUrl(value);
  const showUrlError = urlTouched && value.trim() !== '' && !urlValid;
  const altOver = altText.length > MAX_ALT_LENGTH;

  const imageMedia = useMemo(() => {
    const images = media.filter(isImageMedia);
    const q = mediaQuery.trim().toLowerCase();
    if (!q) return images;
    return images.filter((m) =>
      (m.title || '').toLowerCase().includes(q) ||
      (m.file_name || '').toLowerCase().includes(q) ||
      (m.alt_text || '').toLowerCase().includes(q)
    );
  }, [media, mediaQuery]);

  const selectMedia = (item: CmsMedia) => {
    onChange(item.public_url || '');
    onAltTextChange(item.alt_text || item.title || item.file_name || `${name} at Digital Footprint`);
    setMediaOpen(false);
    setMediaQuery('');
  };

  const handleRecoveredSelect = (recoveredName: string) => {
    setRecoveredOpen(false);
    onAltTextChange(`${recoveredName} at Digital Footprint`);
  };

  const handleRemove = () => {
    setConfirmRemove(false);
    onChange('');
    onAltTextChange('');
  };

  return (
    <div className="border border-[rgba(255,255,255,0.08)] rounded-xl p-4 bg-white/[0.02]">
      <div className="flex items-start gap-5">
        <div className="shrink-0">
          <p className="text-xs font-medium text-slate-400 mb-2">Preview</p>
          <div className="w-24 h-24 rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.1)] bg-[#0F172A]">
            {value.trim() && urlValid ? (
              <img
                src={value.trim()}
                alt={altText || name}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#06B6D4]/15 to-[#8B5CF6]/15">
                <span className="text-2xl font-bold text-[#06B6D4]/70">{initials}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <label htmlFor="profile-image-url" className="block text-xs font-medium text-slate-400 mb-1.5">
              Image URL
            </label>
            <input
              id="profile-image-url"
              type="text"
              inputMode="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={() => setUrlTouched(true)}
              placeholder="https://... (paste a Readdy Files URL)"
              aria-invalid={showUrlError}
              aria-describedby={showUrlError ? 'profile-image-url-error' : 'profile-image-url-hint'}
              className={`w-full px-3 py-2.5 bg-white/5 border rounded-lg text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 focus:border-[#06B6D4]/40 transition-all ${
                showUrlError ? 'border-red-500/50' : 'border-[rgba(255,255,255,0.08)]'
              }`}
            />
            {showUrlError ? (
              <p id="profile-image-url-error" className="text-xs text-red-400 mt-1">
                Enter a valid image URL starting with http:// or https://.
              </p>
            ) : (
              <p id="profile-image-url-hint" className="text-[11px] text-slate-600 mt-1">
                Paste an image URL, or choose one from the media library below.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="profile-image-alt" className="block text-xs font-medium text-slate-400 mb-1.5">
              Image Alt Text
            </label>
            <input
              id="profile-image-alt"
              type="text"
              value={altText}
              onChange={(e) => onAltTextChange(e.target.value)}
              placeholder="Describe the image for screen readers"
              aria-invalid={altOver}
              aria-describedby={altOver ? 'profile-image-alt-help' : undefined}
              className="w-full px-3 py-2.5 bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-lg text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 focus:border-[#06B6D4]/40 transition-all"
            />
            <p id="profile-image-alt-help" className={`text-[11px] mt-1 ${altOver ? 'text-red-400' : 'text-slate-600'}`}>
              {altOver ? `Alt text is too long (${altText.length}/${MAX_ALT_LENGTH}).` : `${altText.length}/${MAX_ALT_LENGTH} characters`}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-[rgba(255,255,255,0.06)]">
        <button
          type="button"
          onClick={() => { setMediaOpen(true); setRecoveredOpen(false); }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-white bg-[#06B6D4]/15 border border-[#06B6D4]/25 hover:bg-[#06B6D4]/25 transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-image-line w-4 h-4 flex items-center justify-center" />
          Browse media library
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => { setRecoveredOpen((o) => !o); setMediaOpen(false); }}
            aria-expanded={recoveredOpen}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 bg-white/5 border border-[rgba(255,255,255,0.08)] hover:bg-white/10 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-folder-image-line w-4 h-4 flex items-center justify-center" />
            Recovered image names
            <i className={`ri-arrow-down-s-line w-4 h-4 flex items-center justify-center transition-transform ${recoveredOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {recoveredOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="absolute left-0 top-full mt-1 w-64 bg-[#1E293B] border border-[rgba(255,255,255,0.1)] rounded-xl shadow-2xl z-30 overflow-hidden"
              >
                <div className="max-h-64 overflow-y-auto py-1">
                  {RECOVERED_TEAM_IMAGES.map((imgName) => (
                    <button
                      key={imgName}
                      type="button"
                      onClick={() => handleRecoveredSelect(imgName)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                    >
                      <span className="w-6 h-6 rounded-md bg-gradient-to-br from-[#06B6D4]/15 to-[#8B5CF6]/15 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-[#06B6D4]/70">{buildInitials(imgName)}</span>
                      </span>
                      {imgName}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-[11px] text-slate-600">Selecting a recovered name sets its alt text, then paste or browse the matching image.</p>

        {value.trim() && (
          <div className="ml-auto">
            {confirmRemove ? (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400">Remove image?</span>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Remove
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmRemove(false)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmRemove(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center" />
                Remove image
              </button>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {mediaOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setMediaOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-[#1E293B] border border-[rgba(255,255,255,0.08)] rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(255,255,255,0.08)]">
                <div>
                  <h3 className="text-base font-bold text-white">Select from media library</h3>
                  <p className="text-xs text-slate-400">Choose an existing image to use as the profile picture.</p>
                </div>
                <button
                  onClick={() => setMediaOpen(false)}
                  aria-label="Close media library"
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <i className="ri-close-line w-5 h-5 flex items-center justify-center" />
                </button>
              </div>

              <div className="p-5">
                <div className="relative mb-4">
                  <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 flex items-center justify-center" />
                  <input
                    type="text"
                    value={mediaQuery}
                    onChange={(e) => setMediaQuery(e.target.value)}
                    placeholder="Search images..."
                    aria-label="Search media library"
                    className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-lg text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 focus:border-[#06B6D4]/40 transition-all"
                  />
                </div>

                {mediaLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="w-6 h-6 border-2 border-[#06B6D4]/30 border-t-[#06B6D4] rounded-full animate-spin" />
                  </div>
                ) : imageMedia.length === 0 ? (
                  <div className="text-center py-16">
                    <i className="ri-image-line w-10 h-10 text-slate-600 mx-auto mb-3 flex items-center justify-center" />
                    <p className="text-sm text-slate-400">
                      {mediaQuery ? 'No images match your search.' : 'No images in the media library yet. Upload images in the CMS media section, or paste a URL directly.'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[50vh] overflow-y-auto pr-1">
                    {imageMedia.map((item) => {
                      const selected = item.public_url === value.trim();
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => selectMedia(item)}
                          aria-label={`Select ${item.title || item.file_name || 'image'}`}
                          className={`group rounded-xl border overflow-hidden transition-all cursor-pointer ${
                            selected ? 'border-[#06B6D4] ring-2 ring-[#06B6D4]/30' : 'border-[rgba(255,255,255,0.08)] hover:border-[#06B6D4]/50'
                          }`}
                        >
                          <div className="aspect-square bg-[#0F172A] overflow-hidden">
                            <img
                              src={item.public_url || ''}
                              alt={item.alt_text || item.title || ''}
                              className="w-full h-full object-cover object-top"
                              loading="lazy"
                            />
                          </div>
                          <div className="px-2 py-1.5 text-left">
                            <p className="text-[11px] text-slate-300 truncate">{item.title || item.file_name}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}