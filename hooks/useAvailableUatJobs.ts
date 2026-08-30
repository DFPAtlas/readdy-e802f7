'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import {
  enrichMarketplaceJob,
  isMarketplaceVisible,
  type MarketplaceJob,
} from '@/lib/uat-marketplace';

export function useAvailableUatJobs() {
  const [jobs, setJobs] = useState<MarketplaceJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: jobsError } = await supabase
        .from('uat_jobs')
        .select('*')
        .eq('marketplace_status', 'published')
        .eq('visibility', 'marketplace')
        .order('published_at', { ascending: false });

      if (!mountedRef.current) return;

      if (jobsError) {
        console.error('[uat/jobs] failed to load jobs:', jobsError.message);
        setJobs([]);
        setError('Unable to load available tests. Please try again.');
        setLoading(false);
        return;
      }

      const visible = (data || []).filter(isMarketplaceVisible);

      const projectIds = [...new Set(visible.map((j: any) => j.project_id).filter(Boolean))] as string[];
      const projectMap: Record<string, string> = {};
      if (projectIds.length > 0) {
        const { data: projData, error: projError } = await supabase
          .from('uat_projects')
          .select('id, name')
          .in('id', projectIds);
        if (!projError && projData) {
          projData.forEach((p: any) => {
            projectMap[p.id] = p.name;
          });
        }
      }

      if (!mountedRef.current) return;

      const enriched = visible.map((j: any) =>
        enrichMarketplaceJob(j, projectMap[j.project_id] || null)
      );
      setJobs(enriched);
      setLoading(false);
    } catch (err) {
      if (!mountedRef.current) return;
      console.error('[uat/jobs] unexpected error loading jobs:', err);
      setJobs([]);
      setError('Unable to load available tests. Please try again.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { jobs, loading, error, refetch: load };
}