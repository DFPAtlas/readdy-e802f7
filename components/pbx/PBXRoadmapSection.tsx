'use client';

import { Map, ArrowUpRight, Sparkles, Construction, Clock } from 'lucide-react';
import Link from 'next/link';

interface RoadmapItem {
  title: string;
  description: string;
  status: 'next' | 'progress' | 'planned';
  eta: string;
  href: string;
}

const roadmapItems: RoadmapItem[] = [
  {
    title: 'AI Receptionist',
    description: 'Natural-language call handling that answers, routes and takes messages without a human.',
    status: 'progress',
    eta: 'In progress',
    href: '/pbx/ai-receptionist',
  },
  {
    title: 'Twilio Voice & SMS',
    description: 'Live provider connection for real inbound/outbound calling and two-way text messaging.',
    status: 'next',
    eta: 'Coming next',
    href: '/pbx/sms',
  },
  {
    title: 'n8n Automations',
    description: 'Trigger workflows from calls and messages — log to CRM, notify teams, update records.',
    status: 'next',
    eta: 'Coming next',
    href: '/pbx/call-routing',
  },
  {
    title: 'Call Recordings',
    description: 'Secure recording storage with playback, transcriptions and compliance controls.',
    status: 'planned',
    eta: 'Planned',
    href: '/pbx/voicemail',
  },
  {
    title: 'Usage Billing',
    description: 'Transparent per-minute and per-SMS billing with live usage tracking and invoices.',
    status: 'planned',
    eta: 'Planned',
    href: '/pbx/billing',
  },
  {
    title: 'Team Analytics',
    description: 'Call volume trends, answer rates and missed-call insights to improve responsiveness.',
    status: 'planned',
    eta: 'Planned',
    href: '/pbx/call-logs',
  },
];

const statusConfig = {
  next: { label: 'Coming next', icon: Sparkles, color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  progress: { label: 'In progress', icon: Construction, color: '#06B6D4', bg: 'rgba(6,182,212,0.12)' },
  planned: { label: 'Planned', icon: Clock, color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)' },
};

export default function PBXRoadmapSection() {
  return (
    <div className="bg-[#1E293B] rounded-xl border border-[rgba(255,255,255,0.06)] p-5">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#06B6D4]/12 flex items-center justify-center">
            <Map className="w-5 h-5 text-[#06B6D4]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">What is changing</h3>
            <p className="text-xs text-slate-500 mt-0.5">A look at what is on the way as the PBX system develops</p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-500">
          Roadmap
          <ArrowUpRight className="w-3.5 h-3.5" />
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
        {roadmapItems.map((item) => {
          const config = statusConfig[item.status];
          return (
            <Link
              key={item.title}
              href={item.href}
              className="group rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#0F172A] p-4 hover:border-[rgba(255,255,255,0.16)] hover:bg-[#111B2E] transition-all cursor-pointer block"
            >
              <div className="flex items-center justify-between mb-2.5">
                <div
                  className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium whitespace-nowrap"
                  style={{ backgroundColor: config.bg, color: config.color }}
                >
                  <config.icon className="w-3 h-3" />
                  {config.label}
                </div>
                <span className="text-[10px] text-slate-500 whitespace-nowrap">{item.eta}</span>
              </div>
              <h4 className="text-sm font-semibold text-white group-hover:text-[#06B6D4] transition-colors">
                {item.title}
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.description}</p>
              <span className="inline-flex items-center gap-1 text-[11px] text-[#06B6D4] mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                Preview
                <ArrowUpRight className="w-3 h-3" />
              </span>
            </Link>
          );
        })}
      </div>

      <p className="text-[11px] text-slate-500 mt-4 leading-relaxed">
        Features are subject to change. What you see here is a preview — the final design, layout and capabilities will evolve as development continues.
      </p>
    </div>
  );
}