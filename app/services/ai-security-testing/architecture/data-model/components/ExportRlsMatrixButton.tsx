'use client';

import { rlsMatrix, rlsAccessLevels, rlsPermissionMeta } from '../../data-model-data';

const levelLabel = (id: string) => rlsAccessLevels.find((l) => l.id === id)?.label ?? id;
const permText = (perms: string[]) =>
  perms.length === 0
    ? 'None'
    : perms.map((p) => rlsPermissionMeta.find((m) => m.id === p)?.abbr ?? p).join(' / ');

const escapeCell = (value: string) => `"${value.replace(/"/g, '""')}"`;

export default function ExportRlsMatrixButton() {
  const handleExport = () => {
    const header = [
      'Table',
      'Note',
      'Customer access',
      'Customer permissions',
      'Staff access',
      'Staff permissions',
      'Agent access',
      'Agent permissions',
    ];

    const rows = rlsMatrix.map((row) => [
      row.entity,
      row.note ?? '',
      levelLabel(row.customer.level),
      permText(row.customer.perms),
      levelLabel(row.staff.level),
      permText(row.staff.perms),
      levelLabel(row.agent.level),
      permText(row.agent.perms),
    ]);

    const csv = [header, ...rows].map((line) => line.map(escapeCell).join(',')).join('\r\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'rls-access-permission-matrix.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      className="hidden lg:inline-flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-slate-700 border border-slate-300 rounded-full px-4 py-2 hover:bg-slate-50 hover:border-slate-400 transition-colors cursor-pointer"
    >
      <span className="w-4 h-4 flex items-center justify-center">
        <i className="ri-download-2-line"></i>
      </span>
      Export CSV
    </button>
  );
}