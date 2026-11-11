'use client';

import { useState } from 'react';
import { motion } from '@/components/motion';
import { Check, Copy, Clock, Mail, ArrowRight } from 'lucide-react';

interface ProjectBriefConfirmationProps {
  reference: string;
  email: string;
  onClose: () => void;
}

const nextSteps = [
  {
    icon: Clock,
    title: 'We review your brief',
    desc: 'A specialist reads your requirements within one working day.',
  },
  {
    icon: Mail,
    title: 'You get a scoped reply',
    desc: 'Approach, timeline and pricing options land in your inbox.',
  },
];

export default function ProjectBriefConfirmation({ reference, email, onClose }: ProjectBriefConfirmationProps) {
  const [copied, setCopied] = useState(false);

  const copyReference = async () => {
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="p-8">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 bg-[#00F0FF]/15 rounded-full flex items-center justify-center mx-auto mb-5"
        >
          <Check className="w-8 h-8 text-[#00B8CC]" />
        </motion.div>
        <h2 className="text-xl font-bold font-mono text-gray-900">Brief received</h2>
        <p className="text-sm text-gray-500 mt-2">
          Your project brief is safely logged with our team.
        </p>
      </div>

      <div className="mt-6 rounded-xl border border-[#00F0FF]/30 bg-[#00F0FF]/5 p-4">
        <p className="text-xs font-mono uppercase tracking-wider text-gray-500">Your reference</p>
        <div className="flex items-center justify-between gap-3 mt-2">
          <p className="font-mono text-lg font-bold text-gray-900 break-all">{reference}</p>
          <button
            onClick={copyReference}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs font-mono text-gray-600 hover:border-[#00F0FF] hover:text-[#00B8CC] transition-colors cursor-pointer whitespace-nowrap"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Quote this if you contact us about your project. We will reply to {email}.
        </p>
      </div>

      <div className="mt-6 space-y-3">
        {nextSteps.map((step) => (
          <div key={step.title} className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/80 p-4">
            <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
              <step.icon className="w-4 h-4 text-[#00B8CC]" />
            </div>
            <div>
              <p className="font-mono text-sm text-gray-900">{step.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onClose}
        className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00F0FF] to-[#00B8CC] rounded-lg font-mono font-bold text-white hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all cursor-pointer whitespace-nowrap"
      >
        Done
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}