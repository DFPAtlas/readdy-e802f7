'use client';

import { motion } from '@/components/motion';
import { executionEnvironments } from '../architecture-data';

export default function ExecutionEnvironments() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#E11D48] text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold mb-3">
            Agent execution layer
          </p>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
            Three execution environments, clearly separated.
          </h2>
          <p className="text-base text-slate-500 max-w-3xl mx-auto leading-relaxed">
            Each environment has a defined role. Agents work only inside approved scope and under agreed rules of engagement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {executionEnvironments.map((env, i) => (
            <motion.div
              key={env.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-slate-200/80 bg-[#F7F9FC] p-6 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                  <i className={`${env.icon} w-5 h-5 flex items-center justify-center text-[#E11D48]`} aria-hidden="true" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{env.name}</h3>
              </div>

              <ul className="space-y-2.5">
                {env.uses.map((use) => (
                  <li key={use} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <i className="ri-checkbox-circle-line w-4 h-4 flex items-center justify-center shrink-0 mt-0.5 text-slate-400" aria-hidden="true" />
                    {use}
                  </li>
                ))}
              </ul>

              {env.note && (
                <p className="text-xs text-slate-500 leading-relaxed mt-5 pt-4 border-t border-slate-200">
                  {env.note}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}