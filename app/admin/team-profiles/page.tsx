'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from '@/components/motion';
import AdminShell from '@/components/admin/AdminShell';
import { useTeamProfiles, type PublicTeamProfile } from '@/hooks/useCmsData';
import { TEAM_PROFILE_STATUSES, teamProfileStatusConfig, TEAM_DEPARTMENTS } from '@/lib/cms-definitions';
import TeamProfileForm from './TeamProfileForm';

export default function TeamProfilesAdminPage() {
  const { profiles, loading, refetch } = useTeamProfiles();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');

  const [formOpen, setFormOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<PublicTeamProfile | null>(null);

  const [archiveTarget, setArchiveTarget] = useState<PublicTeamProfile | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const departments = useMemo(
    () => [...new Set(profiles.map((p) => p.department).filter(Boolean))] as string[],
    [profiles]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return profiles.filter((p) => {
      const matchSearch =
        !q ||
        (p.public_name || '').toLowerCase().includes(q) ||
        (p.public_job_title || '').toLowerCase().includes(q) ||
        (p.department || '').toLowerCase().includes(q);
      const matchStatus = statusFilter === 'all' || p.public_status === statusFilter;
      const matchDept = deptFilter === 'all' || p.department === deptFilter;
      return matchSearch && matchStatus && matchDept;
    });
  }, [profiles, search, statusFilter, deptFilter]);

  const openCreate = () => {
    setEditingProfile(null);
    setFormOpen(true);
  };

  const openEdit = (profile: PublicTeamProfile) => {
    setEditingProfile(profile);
    setFormOpen(true);
  };

  const handleSaved = (message: string) => {
    setFormOpen(false);
    setEditingProfile(null);
    refetch();
    showToast(message, 'success');
  };

  const quickStatusChange = async (profile: PublicTeamProfile, status: string, message: string) => {
    const { error } = await supabase
      .from('public_team_profiles')
      .update({ public_status: status, updated_at: new Date().toISOString() })
      .eq('id', profile.id);
    if (error) showToast(error.message, 'error');
    else {
      refetch();
      showToast(message, 'success');
    }
  };

  const confirmArchive = async () => {
    if (!archiveTarget) return;
    await quickStatusChange(archiveTarget, 'Archived', `${archiveTarget.public_name} archived.`);
    setArchiveTarget(null);
  };

  const statusChips = ['all', ...TEAM_PROFILE_STATUSES];

  return (
    <AdminShell>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Team Profiles</h1>
            <p className="text-sm text-slate-400 mt-0.5">Manage the profiles shown on the public team pages.</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#06B6D4] text-white rounded-xl text-sm font-semibold hover:bg-[#0891B2] transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-add-line w-4 h-4 flex items-center justify-center" />
            Add Profile
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
          <div className="bg-[#1E293B] border border-[rgba(255,255,255,0.06)] rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-1">Total</p>
            <p className="text-xl font-bold text-white">{loading ? '-' : profiles.length}</p>
          </div>
          <div className="bg-[#1E293B] border border-[rgba(255,255,255,0.06)] rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-1">Published</p>
            <p className="text-xl font-bold text-emerald-400">{loading ? '-' : profiles.filter((p) => p.public_status === 'Published').length}</p>
          </div>
          <div className="bg-[#1E293B] border border-[rgba(255,255,255,0.06)] rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-1">Draft</p>
            <p className="text-xl font-bold text-slate-400">{loading ? '-' : profiles.filter((p) => p.public_status === 'Draft').length}</p>
          </div>
          <div className="bg-[#1E293B] border border-[rgba(255,255,255,0.06)] rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-1">Hidden</p>
            <p className="text-xl font-bold text-orange-400">{loading ? '-' : profiles.filter((p) => p.public_status === 'Hidden').length}</p>
          </div>
          <div className="bg-[#1E293B] border border-[rgba(255,255,255,0.06)] rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-1">Featured</p>
            <p className="text-xl font-bold text-[#06B6D4]">{loading ? '-' : profiles.filter((p) => p.featured).length}</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 flex items-center justify-center" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, role or department..."
              className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 focus:border-[#06B6D4]/40"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {statusChips.map((s) => {
              const label = s === 'all' ? 'All Status' : (teamProfileStatusConfig[s]?.label || s);
              return (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap border ${
                    statusFilter === s
                      ? 'bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/20'
                      : 'text-slate-400 border-[rgba(255,255,255,0.08)] hover:text-white hover:border-white/20'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
          {departments.length > 1 && (
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-3 py-2 bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-lg text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 cursor-pointer pr-8"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          )}
        </div>

        <div className="bg-[#1E293B] border border-[rgba(255,255,255,0.06)] rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-6 h-6 border-2 border-[#06B6D4]/30 border-t-[#06B6D4] rounded-full animate-spin mx-auto" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <i className="ri-user-star-line w-10 h-10 text-slate-600 mx-auto mb-3 flex items-center justify-center" />
              <p className="text-slate-400 text-sm">
                {profiles.length === 0 ? 'No team profiles yet. Create your first profile to get started.' : 'No profiles match your search or filters.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.06)]">
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-400">Name</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-400">Slug</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-400">Department</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-400">Role</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-400">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-400">Featured</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-400">Order</th>
                    <th className="text-right px-5 py-3 text-xs font-medium text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => {
                    const sc = teamProfileStatusConfig[p.public_status] || { label: p.public_status, color: '#94A3B8' };
                    const isArchived = p.public_status === 'Archived';
                    return (
                      <tr key={p.id} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            {p.profile_asset_id ? (
                              <Image src={p.profile_asset_id} alt="" width={32} height={32} className="w-8 h-8 rounded-lg object-cover object-top" unoptimized />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                <span className="text-xs font-bold text-slate-500">
                                  {p.public_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                                </span>
                              </div>
                            )}
                            <span className="text-sm font-medium text-white">{p.public_name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-sm text-slate-400 font-mono text-xs">{p.slug}</td>
                        <td className="px-5 py-3"><span className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/5 text-slate-400">{p.department || '-'}</span></td>
                        <td className="px-5 py-3 text-sm text-slate-400 max-w-[160px] truncate">{p.public_job_title || '-'}</td>
                        <td className="px-5 py-3">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: `${sc.color}15`, color: sc.color }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sc.color }} />
                            {sc.label}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <button
                            onClick={() => {
                              const next = !p.featured;
                              supabase
                                .from('public_team_profiles')
                                .update({ featured: next, updated_at: new Date().toISOString() })
                                .eq('id', p.id)
                                .then(({ error }) => {
                                  if (error) showToast(error.message, 'error');
                                  else { refetch(); showToast(next ? 'Added to featured.' : 'Removed from featured.', 'success'); }
                                });
                            }}
                            className={`w-5 h-5 rounded cursor-pointer flex items-center justify-center ${p.featured ? 'text-[#06B6D4]' : 'text-slate-600 hover:text-slate-400'}`}
                          >
                            <i className={`${p.featured ? 'ri-star-fill' : 'ri-star-line'} w-4 h-4 flex items-center justify-center`} />
                          </button>
                        </td>
                        <td className="px-5 py-3 text-sm text-slate-400">{p.display_order}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openEdit(p)}
                              title="Edit"
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#06B6D4] hover:bg-[#06B6D4]/10 transition-colors cursor-pointer"
                            >
                              <i className="ri-edit-line w-4 h-4 flex items-center justify-center" />
                            </button>
                            {p.public_status !== 'Published' && (
                              <button
                                onClick={() => quickStatusChange(p, 'Published', `${p.public_name} published.`)}
                                title="Publish"
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                              >
                                <i className="ri-eye-line w-4 h-4 flex items-center justify-center" />
                              </button>
                            )}
                            {p.public_status === 'Published' && (
                              <button
                                onClick={() => quickStatusChange(p, 'Hidden', `${p.public_name} hidden.`)}
                                title="Hide"
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-orange-400 hover:bg-orange-500/10 transition-colors cursor-pointer"
                              >
                                <i className="ri-eye-off-line w-4 h-4 flex items-center justify-center" />
                              </button>
                            )}
                            {!isArchived && (
                              <button
                                onClick={() => setArchiveTarget(p)}
                                title="Archive"
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                              >
                                <i className="ri-archive-line w-4 h-4 flex items-center justify-center" />
                              </button>
                            )}
                            {isArchived && (
                              <button
                                onClick={() => quickStatusChange(p, 'Draft', `${p.public_name} restored to Draft.`)}
                                title="Restore"
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#06B6D4] hover:bg-[#06B6D4]/10 transition-colors cursor-pointer"
                              >
                                <i className="ri-arrow-go-back-line w-4 h-4 flex items-center justify-center" />
                              </button>
                            )}
                            <a
                              href={`/team/${p.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="View public page"
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#06B6D4] hover:bg-white/5 transition-colors cursor-pointer"
                            >
                              <i className="ri-external-link-line w-4 h-4 flex items-center justify-center" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {formOpen && (
          <TeamProfileForm
            profile={editingProfile}
            existingProfiles={profiles}
            onClose={() => { setFormOpen(false); setEditingProfile(null); }}
            onSaved={handleSaved}
          />
        )}

        {archiveTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setArchiveTarget(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-[#1E293B] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <i className="ri-archive-line w-6 h-6 text-red-400 flex items-center justify-center" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Archive this profile?</h3>
              <p className="text-sm text-slate-400 mb-6">
                &quot;{archiveTarget.public_name}&quot; will be removed from the public team pages but not deleted. You can restore it later.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setArchiveTarget(null)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 bg-white/5 border border-[rgba(255,255,255,0.08)] hover:bg-white/10 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmArchive}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Archive
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl text-sm font-medium shadow-lg z-[60] ${
              toast.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </AdminShell>
  );
}