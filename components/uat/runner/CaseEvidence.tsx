'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Camera, Paperclip, TriangleAlert } from 'lucide-react';
import UATEvidenceList from '@/components/uat/evidence/UATEvidenceList';
import UATEvidenceUploader from '@/components/uat/evidence/UATEvidenceUploader';
import UATScreenshotCapture from '@/components/uat/evidence/UATScreenshotCapture';
import type { UATEvidence } from '@/components/uat/evidence/evidence-types';

interface CaseEvidenceProps {
  assignmentId: string;
  assignmentTestCaseId: string;
  sessionId: string | null;
  canModify: boolean;
  requiredOnFail: boolean;
  onCountChange: (count: number) => void;
}

export default function CaseEvidence({
  assignmentId, assignmentTestCaseId, sessionId, canModify, requiredOnFail, onCountChange,
}: CaseEvidenceProps) {
  const [evidence, setEvidence] = useState<UATEvidence[]>([]);
  const [loading, setLoading] = useState(false);
  const [screenshotOpen, setScreenshotOpen] = useState(false);
  const [uploaderOpen, setUploaderOpen] = useState(false);

  const loadEvidence = useCallback(async () => {
    if (!assignmentTestCaseId) return;
    setLoading(true);
    const { data } = await supabase
      .from('uat_evidence')
      .select('*')
      .eq('assignment_test_case_id', assignmentTestCaseId)
      .in('status', ['uploaded', 'attached'])
      .order('created_at', { ascending: false });

    const evData = (data || []) as UATEvidence[];

    for (const ev of evData) {
      if (ev.evidence_type === 'screenshot' || ev.evidence_type === 'image') {
        try {
          const { data: signed } = await supabase.storage.from('uat-evidence').createSignedUrl(ev.storage_path, 300);
          if (signed) ev.signedUrl = signed.signedUrl;
        } catch {}
      }
    }

    setEvidence(evData);
    setLoading(false);
    onCountChange(evData.length);
  }, [assignmentTestCaseId, onCountChange]);

  useEffect(() => {
    loadEvidence();
  }, [loadEvidence]);

  const handleComplete = useCallback(() => {
    loadEvidence();
    setScreenshotOpen(false);
    setUploaderOpen(false);
  }, [loadEvidence]);

  const handleRemove = useCallback(async (evidenceId: string) => {
    const { data } = await supabase.rpc('soft_delete_uat_evidence', { p_evidence_id: evidenceId });
    const result = data as any;
    if (result?.success) loadEvidence();
  }, [loadEvidence]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Evidence</h4>
        {evidence.length > 0 && <span className="text-[11px] font-semibold text-slate-400">{evidence.length} item(s)</span>}
      </div>

      <UATEvidenceList
        evidence={evidence}
        loading={loading}
        onRemove={handleRemove}
        showRemove
      />

      {canModify && (
        <div className="grid grid-cols-2 gap-2 mt-3">
          <button
            onClick={() => setScreenshotOpen(true)}
            className="flex items-center justify-center gap-1.5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold text-slate-600 cursor-pointer whitespace-nowrap transition-colors"
          >
            <Camera className="h-3.5 w-3.5" /> Screenshot
          </button>
          <button
            onClick={() => setUploaderOpen((v) => !v)}
            className="flex items-center justify-center gap-1.5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold text-slate-600 cursor-pointer whitespace-nowrap transition-colors"
          >
            <Paperclip className="h-3.5 w-3.5" /> Upload File
          </button>
        </div>
      )}

      {uploaderOpen && (
        <div className="mt-3">
          <UATEvidenceUploader
            assignmentId={assignmentId}
            assignmentTestCaseId={assignmentTestCaseId}
            sessionId={sessionId}
            existingEvidence={[]}
            onUploadComplete={handleComplete}
            onRemove={handleRemove}
          />
        </div>
      )}

      {requiredOnFail && evidence.length === 0 && canModify && (
        <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-2">
          <TriangleAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">Evidence is required for failed or blocked cases before you can submit.</p>
        </div>
      )}

      {screenshotOpen && (
        <UATScreenshotCapture
          assignmentId={assignmentId}
          assignmentTestCaseId={assignmentTestCaseId}
          sessionId={sessionId}
          onUploadComplete={handleComplete}
          onClose={() => setScreenshotOpen(false)}
        />
      )}
    </div>
  );
}