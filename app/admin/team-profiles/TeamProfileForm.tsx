'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from '@/components/motion';
import type { PublicTeamProfile } from '@/hooks/useCmsData';
import { TEAM_PROFILE_STATUSES, teamProfileStatusConfig, TEAM_DEPARTMENTS } from '@/lib/cms-definitions';
import ListFieldEditor from './ListFieldEditor';
import LinksEditor, { type LinkEntry } from './LinksEditor';
import ProfileImageEditor from './ProfileImageEditor';

interface TeamProfileFormProps {
  profile: PublicTeamProfile | null;
  existingProfiles: PublicTeamProfile[];
  onClose: () => void;
  onSaved: (message: string) => void;
}

interface FormErrors {
  public_name?: string;
  slug?: string;
  public_job_title?: string;
  public_status?: string;
}

export default function TeamProfileForm({ profile, existingProfiles, onClose, onSaved }: TeamProfileFormProps) {
  const isEdit = !!profile;

  const [publicName, setPublicName] = useState(profile?.public_name || '');
  const [slug, setSlug] = useState(profile?.slug || '');
  const [jobTitle, setJobTitle] = useState(profile?.public_job_title || '');
  const [department, setDepartment] = useState(profile?.department || '');
  const [leadershipLevel, setLeadershipLevel] = useState(profile?.leadership_level || '');
  const [shortBio, setShortBio] = useState(profile?.short_bio || '');
  const [fullBio, setFullBio] = useState(profile?.full_bio || '');
  const [responsibilities, setResponsibilities] = useState<string[]>(profile?.responsibilities || []);
  const [specialistAreas, setSpecialistAreas] = useState<string[]>(profile?.specialist_areas || []);
  const [experienceSummary, setExperienceSummary] = useState<string[]>(profile?.experience_summary || []);
  const [qualifications, setQualifications] = useState<string[]>(profile?.qualifications || []);
  const [products, setProducts] = useState<string[]>(profile?.products || []);
  const [services, setServices] = useState<string[]>(profile?.services || []);
  const [profileAssetId, setProfileAssetId] = useState(profile?.profile_asset_id || '');
  const [imageAltText, setImageAltText] = useState(profile?.image_alt_text || '');
  const [links, setLinks] = useState<LinkEntry[]>(
    Object.entries(profile?.professional_links || {}).map(([platform, url]) => ({ platform, url }))
  );
  const [displayOrder, setDisplayOrder] = useState<string>(String(profile?.display_order ?? 0));
  const [featured, setFeatured] = useState(profile?.featured ?? false);
  const [publicStatus, setPublicStatus] = useState(profile?.public_status || 'Draft');

  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const cleanList = (items: string[]) => items.map((i) => i.trim()).filter(Boolean);

  const isValidHttpUrl = (value: string): boolean => {
    try {
      const u = new URL(value.trim());
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!publicName.trim()) next.public_name = 'Name is required.';
    if (!slug.trim()) next.slug = 'Slug is required.';
    else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug.trim())) next.slug = 'Slug must be lowercase letters, numbers and hyphens only.';
    if (!jobTitle.trim()) next.public_job_title = 'Job title is required.';
    if (!publicStatus) next.public_status = 'Public status is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const checkDuplicateSlug = async (): Promise<string | null> => {
    const trimmed = slug.trim().toLowerCase();
    const { data } = await supabase
      .from('public_team_profiles')
      .select('id,slug')
      .eq('slug', trimmed)
      .maybeSingle();
    if (data && data.id !== profile?.id) {
      return `A profile with the slug "${trimmed}" already exists.`;
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!validate()) return;

    if (profileAssetId.trim() && !isValidHttpUrl(profileAssetId)) {
      setFormError('Please enter a valid image URL (http:// or https://) or leave it empty.');
      return;
    }

    setSaving(true);
    const duplicateError = await checkDuplicateSlug();
    if (duplicateError) {
      setErrors((prev) => ({ ...prev, slug: duplicateError }));
      setSaving(false);
      return;
    }

    const cleanLinks: Record<string, string> = {};
    links.forEach((l) => {
      const key = l.platform.trim().toLowerCase();
      const url = l.url.trim();
      if (key && url) cleanLinks[key] = url;
    });

    const payload = {
      public_name: publicName.trim(),
      slug: slug.trim().toLowerCase(),
      public_job_title: jobTitle.trim(),
      department: department.trim() || null,
      leadership_level: leadershipLevel.trim() || null,
      short_bio: shortBio.trim() || null,
      full_bio: fullBio.trim() || null,
      responsibilities: cleanList(responsibilities),
      specialist_areas: cleanList(specialistAreas),
      experience_summary: cleanList(experienceSummary),
      qualifications: cleanList(qualifications),
      products: cleanList(products),
      services: cleanList(services),
      profile_asset_id: profileAssetId.trim() || null,
      image_alt_text: imageAltText.trim() || null,
      professional_links: Object.keys(cleanLinks).length > 0 ? cleanLinks : null,
      display_order: Number(displayOrder) || 0,
      featured,
      public_status: publicStatus,
      updated_at: new Date().toISOString(),
    };

    const { error } = isEdit
      ? await supabase.from('public_team_profiles').update(payload).eq('id', profile!.id)
      : await supabase.from('public_team_profiles').insert(payload);

    setSaving(false);

    if (error) {
      setFormError(error.message || 'Failed to save profile. Please try again.');
      return;
    }

    onSaved(isEdit ? 'Profile updated successfully.' : 'Profile created successfully.');
  };

  const inputClass = (hasError?: string) =>
    `w-full px-3 py-2.5 bg-white/5 border rounded-lg text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 focus:border-[#06B6D4]/40 transition-all ${
      hasError ? 'border-red-500/50' : 'border-[rgba(255,255,255,0.08)]'
    }`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-y-auto p-4 sm:p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl bg-[#1E293B] border border-[rgba(255,255,255,0.08)] rounded-2xl shadow-2xl my-4"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(255,255,255,0.08)] sticky top-0 bg-[#1E293B] rounded-t-2xl z-10">
          <div>
            <h2 className="text-lg font-bold text-white">{isEdit ? 'Edit Team Profile' : 'New Team Profile'}</h2>
            <p className="text-xs text-slate-400">Fields marked * are required.</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <i className="ri-close-line w-5 h-5 flex items-center justify-center" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-6">
          {formError && (
            <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <i className="ri-error-warning-line w-4 h-4 flex items-center justify-center mt-0.5 shrink-0" />
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Name *</label>
              <input type="text" value={publicName} onChange={(e) => setPublicName(e.target.value)} placeholder="Full name" className={inputClass(errors.public_name)} />
              {errors.public_name && <p className="text-xs text-red-400 mt-1">{errors.public_name}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Slug *</label>
              <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. jane-doe" className={inputClass(errors.slug)} />
              {errors.slug && <p className="text-xs text-red-400 mt-1">{errors.slug}</p>}
              <p className="text-[11px] text-slate-600 mt-1">Used in the profile URL: /team/{'{'}slug{'}'}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Job Title *</label>
              <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Head of Design" className={inputClass(errors.public_job_title)} />
              {errors.public_job_title && <p className="text-xs text-red-400 mt-1">{errors.public_job_title}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Leadership Level</label>
              <input type="text" value={leadershipLevel} onChange={(e) => setLeadershipLevel(e.target.value)} placeholder="e.g. Head of Department" className={inputClass()} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Department</label>
              <select value={department} onChange={(e) => setDepartment(e.target.value)} className={`${inputClass()} cursor-pointer pr-8`}>
                <option value="">— None —</option>
                {TEAM_DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Display Order</label>
              <input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} className={inputClass()} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Public Status *</label>
              <select value={publicStatus} onChange={(e) => setPublicStatus(e.target.value)} className={`${inputClass(errors.public_status)} cursor-pointer pr-8`}>
                {TEAM_PROFILE_STATUSES.map((s) => (
                  <option key={s} value={s}>{teamProfileStatusConfig[s]?.label || s}</option>
                ))}
              </select>
              {errors.public_status && <p className="text-xs text-red-400 mt-1">{errors.public_status}</p>}
            </div>
            <div className="flex items-end pb-2">
              <button
                type="button"
                onClick={() => setFeatured(!featured)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                  featured
                    ? 'bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/30'
                    : 'bg-white/5 text-slate-400 border-[rgba(255,255,255,0.08)] hover:text-white'
                }`}
              >
                <i className={`${featured ? 'ri-star-fill' : 'ri-star-line'} w-4 h-4 flex items-center justify-center`} />
                {featured ? 'Featured in Leadership' : 'Mark as Featured'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Short Biography</label>
            <textarea value={shortBio} onChange={(e) => setShortBio(e.target.value)} rows={2} placeholder="One or two sentence introduction" className={`${inputClass()} resize-none`} />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Full Biography</label>
            <textarea value={fullBio} onChange={(e) => setFullBio(e.target.value)} rows={4} placeholder="Longer biography" className={`${inputClass()} resize-none`} />
          </div>

          <div>
            <ProfileImageEditor
              value={profileAssetId}
              altText={imageAltText}
              name={publicName}
              onChange={setProfileAssetId}
              onAltTextChange={setImageAltText}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-[rgba(255,255,255,0.08)] pt-5">
            <ListFieldEditor label="Responsibilities" items={responsibilities} onChange={setResponsibilities} placeholder="Add a responsibility" />
            <ListFieldEditor label="Specialist Areas" items={specialistAreas} onChange={setSpecialistAreas} placeholder="Add a specialism" />
            <ListFieldEditor label="Experience Summary" items={experienceSummary} onChange={setExperienceSummary} placeholder="Add experience" />
            <ListFieldEditor label="Qualifications" items={qualifications} onChange={setQualifications} placeholder="Add a qualification" />
            <ListFieldEditor label="Products" items={products} onChange={setProducts} placeholder="Add a product" />
            <ListFieldEditor label="Services" items={services} onChange={setServices} placeholder="Add a service" />
          </div>

          <div className="border-t border-[rgba(255,255,255,0.08)] pt-5">
            <LinksEditor entries={links} onChange={setLinks} />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[rgba(255,255,255,0.08)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 bg-white/5 border border-[rgba(255,255,255,0.08)] hover:bg-white/10 transition-colors cursor-pointer whitespace-nowrap"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#06B6D4] hover:bg-[#0891B2] transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Profile'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}