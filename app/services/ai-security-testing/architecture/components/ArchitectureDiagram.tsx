'use client';

import { motion } from '@/components/motion';
import { diagramLayers } from '../architecture-data';

export default function ArchitectureDiagram() {
  return (
    <section className="pb-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-slate-950 border border-slate-800 p-5 sm:p-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#F97316] mb-1">
                Reference architecture
              </p>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                From enquiry to Security Watch — with trust boundaries marked
              </h2>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-300 bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-full">
              Conceptual / illustrative
            </span>
          </div>

          <div>
            {diagramLayers.map((layer, i) => (
              <div key={layer.id}>
                <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
                      {layer.boundary}
                    </span>
                    <span className="text-[11px] font-bold text-slate-600">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                      <i className={`${layer.icon} w-5 h-5 flex items-center justify-center text-[#F97316]`} aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-white">{layer.title}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">{layer.desc}</p>
                      {layer.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {layer.tags.map((tag) => (
                            <span key={tag} className="text-[10px] font-semibold text-slate-300 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {i < diagramLayers.length - 1 && (
                  <div className="flex justify-center py-1">
                    <i className="ri-arrow-down-line w-5 h-5 flex items-center justify-center text-slate-600" aria-hidden="true" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}