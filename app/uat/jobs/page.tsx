'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Briefcase, SlidersHorizontal, X } from 'lucide-react';
import { useUATTester } from '@/components/uat/UATTesterProvider';
import { useAvailableUatJobs } from '@/hooks/useAvailableUatJobs';
import { computeTesterMatch, capitalize, experienceLabel } from '@/lib/uat-marketplace';
import UATPortalBreadcrumbs from '@/components/uat/portal/UATPortalBreadcrumbs';
import UATEmptyState from '@/components/uat/portal/UATEmptyState';
import UATMarketplaceCard from '@/components/uat/portal/UATMarketplaceCard';
import UATFilterDropdown, { type FilterOption } from '@/components/uat/portal/UATFilterDropdown';

function durationBucket(job: any): string {
  const max = job.estimated_minutes_max ?? job.estimated_minutes_min;
  if (!max) return 'unspecified';
  if (max < 60) return 'under1';
  if (max <= 180) return '1to3';
  return '3plus';
}

function rewardBucket(job: any): string {
  const minor = job.reward_amount_minor ?? 0;
  if (minor < 2500) return 'under25';
  if (minor <= 5000) return '25to50';
  return '50plus';
}

export default function TesterJobsPage() {
  const { tester } = useUATTester();
  const testerId = tester.id;
  const { jobs, loading } = useAvailableUatJobs();
  const [testerDevices, setTesterDevices] = useState<{ category: string; browser: string | null }[]>([]);

  const [deviceFilter, setDeviceFilter] = useState('all');
  const [browserFilter, setBrowserFilter] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all');
  const [rewardFilter, setRewardFilter] = useState('all');

  useEffect(() => {
    if (!testerId) return;
    (async () => {
      const { data } = await supabase
        .from('uat_tester_devices')
        .select('category, browser')
        .eq('tester_id', testerId)
        .eq('is_active', true);
      setTesterDevices((data || []).map((d: any) => ({ category: d.category, browser: d.browser })));
    })();
  }, [testerId]);

  const deviceOptions: FilterOption[] = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => (j.required_devices || []).forEach((d) => set.add(d)));
    return [
      { value: 'all', label: 'Any device' },
      ...Array.from(set).map((v) => ({ value: v, label: capitalize(v) })),
    ];
  }, [jobs]);

  const browserOptions: FilterOption[] = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => (j.required_browsers || []).forEach((b) => set.add(b)));
    return [
      { value: 'all', label: 'Any browser' },
      ...Array.from(set).map((v) => ({ value: v, label: v })),
    ];
  }, [jobs]);

  const experienceOptions: FilterOption[] = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => {
      if (j.required_experience_level) set.add(j.required_experience_level);
    });
    return [
      { value: 'all', label: 'Any level' },
      ...Array.from(set).map((v) => ({ value: v, label: experienceLabel(v) })),
    ];
  }, [jobs]);

  const durationOptions: FilterOption[] = [
    { value: 'all', label: 'Any duration' },
    { value: 'under1', label: 'Under 1 hour' },
    { value: '1to3', label: '1 – 3 hours' },
    { value: '3plus', label: '3+ hours' },
  ];

  const rewardOptions: FilterOption[] = [
    { value: 'all', label: 'Any reward' },
    { value: 'under25', label: 'Under £25' },
    { value: '25to50', label: '£25 – £50' },
    { value: '50plus', label: '£50+' },
  ];

  const hasActiveFilters =
    deviceFilter !== 'all' ||
    browserFilter !== 'all' ||
    experienceFilter !== 'all' ||
    durationFilter !== 'all' ||
    rewardFilter !== 'all';

  const clearFilters = () => {
    setDeviceFilter('all');
    setBrowserFilter('all');
    setExperienceFilter('all');
    setDurationFilter('all');
    setRewardFilter('all');
  };

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      if (deviceFilter !== 'all' && !(j.required_devices || []).includes(deviceFilter)) return false;
      if (browserFilter !== 'all' && !(j.required_browsers || []).includes(browserFilter)) return false;
      if (experienceFilter !== 'all' && j.required_experience_level !== experienceFilter) return false;
      if (durationFilter !== 'all' && durationBucket(j) !== durationFilter) return false;
      if (rewardFilter !== 'all' && rewardBucket(j) !== rewardFilter) return false;
      return true;
    });
  }, [jobs, deviceFilter, browserFilter, experienceFilter, durationFilter, rewardFilter]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="w-8 h-8 border-[3px] border-[#2878d0]/20 border-t-[#2878d0] rounded-full animate-spin" />
        <p className="text-sm text-slate-500">Loading available tests...</p>
      </div>
    );
  }

  return (
    <>
      <UATPortalBreadcrumbs items={[{ label: 'Available Tests' }]} />
      <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#789265]">Paid UAT Opportunities</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-[#17325c] sm:text-5xl">Available Tests</h1>
          <p className="mt-2 text-slate-500">Browse paid testing work that matches your devices and experience.</p>
        </div>
        {!loading && jobs.length > 0 && (
          <p className="shrink-0 text-sm font-semibold text-slate-500">
            {filtered.length} {filtered.length === 1 ? 'test' : 'tests'} available
          </p>
        )}
      </div>

      {jobs.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-400">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </span>
          <UATFilterDropdown label="Device" value={deviceFilter} options={deviceOptions} onChange={setDeviceFilter} />
          <UATFilterDropdown label="Browser" value={browserFilter} options={browserOptions} onChange={setBrowserFilter} />
          <UATFilterDropdown label="Experience" value={experienceFilter} options={experienceOptions} onChange={setExperienceFilter} />
          <UATFilterDropdown label="Duration" value={durationFilter} options={durationOptions} onChange={setDurationFilter} />
          <UATFilterDropdown label="Reward" value={rewardFilter} options={rewardOptions} onChange={setRewardFilter} />
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 hover:text-[#2878d0] transition cursor-pointer whitespace-nowrap"
            >
              <X className="h-4 w-4" /> Clear
            </button>
          )}
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {filtered.map((job) => (
            <UATMarketplaceCard
              key={job.id}
              job={job}
              match={computeTesterMatch(job, testerDevices, tester.experience_level)}
            />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-slate-100 bg-white shadow-sm">
          <UATEmptyState
            icon={Briefcase}
            title={jobs.length === 0 ? 'No tests available right now' : 'No tests match your filters'}
            description={
              jobs.length === 0
                ? 'New UAT opportunities will appear here when published.'
                : 'Try adjusting or clearing your filters to see more tests.'
            }
          />
          {jobs.length > 0 && (
            <div className="pb-6 text-center">
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-2 rounded-xl bg-[#2878d0] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 hover:bg-[#1e68b9] transition cursor-pointer whitespace-nowrap"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}