'use client';

import RlsLevelBadge from './RlsLevelBadge';
import RlsPermissionChips from './RlsPermissionChips';
import ExportRlsMatrixButton from './ExportRlsMatrixButton';
import {
  rlsMatrix,
  rlsAccessLevels,
  rlsPermissionMeta,
  rlsPolicyRules,
  rlsMatrixNote,
  type RlsCell,
} from '../../data-model-data';

const actors: { key: 'customer' | 'staff' | 'agent'; label: string }[] = [
  { key: 'customer', label: 'Customer users' },
  { key: 'staff', label: 'DFP staff' },
  { key: 'agent', label: 'Service agents' },
];

function ActorCell({ cell }: { cell: RlsCell }) {
  return (
    <div className="flex flex-col items-start gap-1.5">
      <RlsLevelBadge level={cell.level} />
      <RlsPermissionChips perms={cell.perms} />
    </div>
  );
}

export default function RlsPolicyMatrixSection() {
  return (
    <section id="rls-matrix" className="w-full bg-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#E11D48] mb-3">Access control</p>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Row Level Security matrix</h2>
            <p className="text-slate-500 leading-relaxed">
              Every table is protected by Row Level Security. The matrix shows who can reach each record — and whether they can
              only read it, write to it, or approve it.
            </p>
          </div>
          <ExportRlsMatrixButton />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {rlsAccessLevels.map((level) => (
            <div key={level.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <div className="mb-2">
                <RlsLevelBadge level={level.id} />
              </div>
              <p className="text-sm font-semibold text-slate-800 mb-1">{level.label}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{level.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-8 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Permission split:</span>
          {rlsPermissionMeta.map((perm) => (
            <span key={perm.id} className="inline-flex items-center gap-2">
              <span className={`text-[10px] font-bold border rounded px-1.5 py-0.5 ${perm.tone}`}>{perm.abbr}</span>
              <span>{perm.label}</span>
            </span>
          ))}
        </div>

        <div className="hidden lg:block border border-slate-200 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Table</th>
                {actors.map((actor) => (
                  <th key={actor.key} className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <span className="block">{actor.label}</span>
                    <span className="block text-[10px] font-normal normal-case tracking-normal text-slate-400">
                      read · write · approve
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rlsMatrix.map((row) => (
                <tr key={row.entity} className="border-b border-slate-100 last:border-b-0 hover:bg-rose-50/30 transition-colors">
                  <td className="px-5 py-4 align-top">
                    <span className="block text-sm font-semibold text-slate-800">{row.entity}</span>
                    {row.note && <span className="block text-[11px] text-slate-400 mt-1 leading-snug max-w-[220px]">{row.note}</span>}
                  </td>
                  {actors.map((actor) => (
                    <td key={actor.key} className="px-5 py-4 align-top">
                      <ActorCell cell={row[actor.key]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lg:hidden space-y-4">
          {rlsMatrix.map((row) => (
            <div key={row.entity} className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                <span className="text-sm font-semibold text-slate-800">{row.entity}</span>
                {row.note && <p className="text-[11px] text-slate-400 mt-1 leading-snug">{row.note}</p>}
              </div>
              <div className="divide-y divide-slate-100">
                {actors.map((actor) => (
                  <div key={actor.key} className="px-4 py-3 flex items-center justify-between gap-4">
                    <span className="text-xs text-slate-500">{actor.label}</span>
                    <ActorCell cell={row[actor.key]} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-5">
          {rlsPolicyRules.map((rule) => (
            <div key={rule} className="border border-slate-200 rounded-xl p-5 bg-white">
              <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-rose-50 text-[#E11D48] mb-3">
                <i className="ri-shield-check-line text-lg"></i>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{rule}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs text-slate-400 leading-relaxed border-t border-slate-100 pt-6">{rlsMatrixNote}</p>
      </div>
    </section>
  );
}
