'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { formatReward } from '@/lib/uat-marketplace';
import {
  resolveRewardStatus,
  computeEarningsTotals,
  type EarningsTotals,
  type RewardStatus,
} from '@/lib/uat-earnings';

export interface EarningItem {
  id: string;
  assignment_id: string;
  job_id: string;
  status: string;
  reward_amount_minor: number;
  currency: string;
  reward_label: string;
  reward_status: RewardStatus;
  approved_at: string | null;
  paid_at: string | null;
  rejected_at: string | null;
  completed_at: string | null;
  created_at: string;
  job_title: string;
  project_name: string | null;
}

export function useEarnings(testerId: string | undefined) {
  const [items, setItems] = useState<EarningItem[]>([]);
  const [totals, setTotals] = useState<EarningsTotals>({
    pendingReview: 0,
    approved: 0,
    paid: 0,
    totalEarned: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!testerId) return;
    setLoading(true);
    setError('');

    const { data: payments, error: err } = await supabase
      .from('uat_payments')
      .select('id, assignment_id, job_id, status, reward_amount_minor, currency, approved_at, paid_at, rejected_at, created_at, stripe_transfer_status')
      .eq('tester_id', testerId)
      .order('created_at', { ascending: false });

    if (err) {
      setError('Failed to load your earnings.');
      setLoading(false);
      return;
    }

    const pays = payments || [];
    setTotals(computeEarningsTotals(pays));

    const jobIds = [...new Set(pays.map((p) => p.job_id))] as string[];
    const assignIds = [...new Set(pays.map((p) => p.assignment_id))] as string[];

    const jobMap: Record<string, any> = {};
    const projectMap: Record<string, string> = {};
    const assignMap: Record<string, string | null> = {};

    if (jobIds.length > 0) {
      const { data: jobs } = await supabase.from('uat_jobs').select('id, title, project_id').in('id', jobIds);
      jobs?.forEach((j) => { jobMap[j.id] = j; });

      const projectIds = [...new Set((jobs || []).map((j) => j.project_id).filter(Boolean))] as string[];
      if (projectIds.length > 0) {
        const { data: projects } = await supabase.from('uat_projects').select('id, name').in('id', projectIds);
        projects?.forEach((p) => { projectMap[p.id] = p.name; });
      }
    }

    if (assignIds.length > 0) {
      const { data: assigns } = await supabase.from('uat_assignments').select('id, completed_at').in('id', assignIds);
      assigns?.forEach((a) => { assignMap[a.id] = a.completed_at || null; });
    }

    const built: EarningItem[] = pays.map((p) => ({
      id: p.id,
      assignment_id: p.assignment_id,
      job_id: p.job_id,
      status: p.status,
      reward_amount_minor: p.reward_amount_minor,
      currency: p.currency || 'GBP',
      reward_label: formatReward(p.reward_amount_minor, p.currency || 'GBP'),
      reward_status: resolveRewardStatus(p.status, p.stripe_transfer_status),
      approved_at: p.approved_at,
      paid_at: p.paid_at,
      rejected_at: p.rejected_at,
      completed_at: assignMap[p.assignment_id] || null,
      created_at: p.created_at,
      job_title: jobMap[p.job_id]?.title || 'Untitled Test',
      project_name: jobMap[p.job_id]?.project_id ? projectMap[jobMap[p.job_id].project_id] || null : null,
    }));

    setItems(built);
    setLoading(false);
  }, [testerId]);

  useEffect(() => {
    load();
  }, [load]);

  return { items, totals, loading, error, refetch: load };
}