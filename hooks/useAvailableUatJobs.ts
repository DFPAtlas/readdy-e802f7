'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import {
  enrichMarketplaceJob,
  isMarketplaceVisible,
  type MarketplaceJob,
} from '@/lib/uat-marketplace';

export function useAvailableUatJobs() {
  const [jobs, setJobs] = useState<MarketplaceJob[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('uat_jobs')
      .select('*')
      .eq('marketplace_status', 'published')
      .eq('visibility', 'marketplace')
      .order('published_at', { ascending: false });

    const visible = (data || []).filter(isMarketplaceVisible);

    const projectIds = [...new Set(visible.map((j: any) => j.project_id).filter(Boolean))] as string[];
    const projectMap: Record<string, string> = {};
    if (projectIds.length > 0) {
      const { data: projData } = await supabase
        .from('uat_projects')
        .select('id, name')
        .in('id', projectIds);
      projData?.forEach((p: any) => {
        projectMap[p.id] = p.name;
      });
    }

    setJobs(visible.map((j: any) => enrichMarketplaceJob(j, projectMap[j.project_id] || null)));
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { jobs, loading, refetch: load };
}