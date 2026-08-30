'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { formatReward } from '@/lib/uat-marketplace';
import {
  assignmentSection,
  assignmentLabel,
  assignmentBadge,
  rewardStatusLabel,
  computeProgress,
  COMPLETED_TEST_CASE_STATUSES,
  type AssignmentSection,
  type RewardStatus,
} from '@/lib/uat-assignment';

export interface MyTestItem {
  id: string;
  job_id: string;
  status: string;
  status_label: string;
  status_badge: string;
  section: AssignmentSection;
  job_title: string;
  project_name: string | null;
  deadline: string | null;
  assigned_at: string;
  last_activity: string | null;
  submitted_at: string | null;
  completed_at: string | null;
  agreed_reward_label: string;
  progress_completed: number;
  progress_total: number;
  progress_percent: number;
  reward_status: RewardStatus;
  required_devices: string[];
  required_browsers: string[];
}

export interface PendingApplication {
  id: string;
  job_id: string;
  job_title: string;
  project_name: string | null;
  created_at: string;
}

export function useMyTests(testerId: string | undefined) {
  const [items, setItems] = useState<MyTestItem[]>([]);
  const [pendingApplications, setPendingApplications] = useState<PendingApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!testerId) return;
    setLoading(true);
    setError('');

    const [{ data: assignments, error: assignErr }, { data: applications }] = await Promise.all([
      supabase.from('uat_assignments')
        .select('id, job_id, status, agreed_reward_amount_minor, currency, deadline, submitted_at, completed_at, created_at, updated_at')
        .eq('tester_id', testerId)
        .order('created_at', { ascending: false }),
      supabase.from('uat_job_applications').select('id, job_id, created_at').eq('tester_id', testerId).eq('status', 'pending').order('created_at', { ascending: false }),
    ]);

    if (assignErr) {
      setError('Failed to load your tests.');
      setLoading(false);
      return;
    }

    const assigns = assignments || [];
    const apps = applications || [];

    const jobIds = [...new Set([...assigns.map((a: any) => a.job_id), ...apps.map((p: any) => p.job_id)])] as string[];

    let jobMap: Record<string, any> = {};
    let projectMap: Record<string, string> = {};
    let testCaseMap: Record<string, { completed: number; total: number }> = {};
    let paymentByAssignment: Record<string, any> = {};

    if (jobIds.length > 0) {
      const { data: jobs } = await supabase
        .from('uat_jobs')
        .select('id, title, project_id, deadline, required_devices, required_browsers')
        .in('id', jobIds);
      jobs?.forEach((j: any) => { jobMap[j.id] = j; });

      const projectIds = [...new Set((jobs || []).map((j: any) => j.project_id).filter(Boolean))] as string[];
      if (projectIds.length > 0) {
        const { data: projects } = await supabase.from('uat_projects').select('id, name').in('id', projectIds);
        projects?.forEach((p: any) => { projectMap[p.id] = p.name; });
      }
    }

    const assignmentIds = assigns.map((a: any) => a.id) as string[];
    if (assignmentIds.length > 0) {
      const [{ data: atcs }, { data: payments }] = await Promise.all([
        supabase.from('uat_assignment_test_cases').select('assignment_id, status').in('assignment_id', assignmentIds),
        supabase.from('uat_payments').select('assignment_id, status, eligibility_state').in('assignment_id', assignmentIds),
      ]);

      const byAssignment: Record<string, { completed: number; total: number }> = {};
      (atcs || []).forEach((tc: any) => {
        if (!byAssignment[tc.assignment_id]) byAssignment[tc.assignment_id] = { completed: 0, total: 0 };
        byAssignment[tc.assignment_id].total += 1;
        if (COMPLETED_TEST_CASE_STATUSES.includes(tc.status)) {
          byAssignment[tc.assignment_id].completed += 1;
        }
      });
      testCaseMap = byAssignment;

      (payments || []).forEach((p: any) => {
        if (p.assignment_id && !paymentByAssignment[p.assignment_id]) {
          paymentByAssignment[p.assignment_id] = p;
        }
      });
    }

    const built: MyTestItem[] = assigns.map((a: any) => {
      const job = jobMap[a.job_id];
      const progress = computeProgress(
        testCaseMap[a.id]?.completed || 0,
        testCaseMap[a.id]?.total || 0,
      );
      const reward = rewardStatusLabel(paymentByAssignment[a.id]);
      return {
        id: a.id,
        job_id: a.job_id,
        status: a.status,
        status_label: assignmentLabel(a.status),
        status_badge: assignmentBadge(a.status),
        section: assignmentSection(a.status),
        job_title: job?.title || 'Untitled Test',
        project_name: job?.project_id ? projectMap[job.project_id] || null : null,
        deadline: a.deadline || job?.deadline || null,
        assigned_at: a.created_at,
        last_activity: a.updated_at,
        submitted_at: a.submitted_at,
        completed_at: a.completed_at,
        agreed_reward_label: formatReward(a.agreed_reward_amount_minor, a.currency || 'GBP'),
        progress_completed: progress.completed,
        progress_total: progress.total,
        progress_percent: progress.percent,
        reward_status: reward,
        required_devices: job?.required_devices || [],
        required_browsers: job?.required_browsers || [],
      };
    });

    const builtApps: PendingApplication[] = apps.map((p: any) => {
      const job = jobMap[p.job_id];
      return {
        id: p.id,
        job_id: p.job_id,
        job_title: job?.title || 'Untitled Test',
        project_name: job?.project_id ? projectMap[job.project_id] || null : null,
        created_at: p.created_at,
      };
    });

    setItems(built);
    setPendingApplications(builtApps);
    setLoading(false);
  }, [testerId]);

  useEffect(() => {
    load();
  }, [load]);

  return { items, pendingApplications, loading, error, refetch: load };
}