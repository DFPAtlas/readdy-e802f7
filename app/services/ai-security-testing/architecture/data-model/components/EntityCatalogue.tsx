'use client';

import { motion } from '@/components/motion';
import { entities, groupMeta } from '../data-model-data';
import EntityCard from './EntityCard';

const order = ['foundation', 'scoping', 'execution', 'findings', 'remediation', 'monitoring'];

export default function EntityCatalogue() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#E11D48] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-3">
            Proposed entities
          </p>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
            Twenty-two proposed entities.
          </h2>
          <p className="text-base text-slate-500 max-w-3xl mx-auto leading-relaxed">
            Field lists are illustrative and shown with the value sets each entity supports. Expand any entity to see its proposed fields.
          </p>
        </div>

        <div className="space-y-12">
          {order.map((groupKey) => {
            const list = entities.filter((e) => e.group === groupKey);
            if (!list.length) return null;
            const meta = groupMeta[groupKey];
            return (
              <div key={groupKey}>
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-white bg-[#E11D48] px-2.5 py-1 rounded-md">
                    {meta.phase}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">{meta.label}</h3>
                  <span className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs font-semibold text-slate-400">{list.length} entities</span>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {list.map((entity, i) => (
                    <motion.div
                      key={entity.key}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <EntityCard entity={entity} />
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}