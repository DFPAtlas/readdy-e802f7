'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from '@/components/motion';
import Link from 'next/link';

export interface PublicTeamProfile {
  id: string;
  public_name: string;
  slug: string;
  public_job_title: string | null;
  department: string | null;
  leadership_level: string | null;
  short_bio: string | null;
  full_bio: string | null;
  responsibilities: string[] | null;
  specialist_areas: string[] | null;
  experience_summary: string[] | null;
  qualifications: string[] | null;
  products: string[] | null;
  services: string[] | null;
  profile_asset_id: string | null;
  image_alt_text: string | null;
  professional_links: Record<string, string> | null;
  display_order: number;
  featured: boolean;
}

const PALETTES = [
  { accent: '#C4B5E0', name: 'lavender' },
  { accent: '#A8C9B8', name: 'sage' },
  { accent: '#A8C7E0', name: 'sky' },
  { accent: '#E0B5B5', name: 'rose' },
  { accent: '#D9C7A8', name: 'sand' },
];

const TAGLINES = [
  { lead: 'I design clarity\nand build\nexperiences\nthat', emphasis: 'matter.' },
  { lead: 'I turn complex\nproblems into\nsimple products\nthat', emphasis: 'work.' },
  { lead: 'I lead with\ncraft, care\nand curiosity\nthat', emphasis: 'inspire.' },
  { lead: 'I shape strategy\nand ship work\nthat truly', emphasis: 'moves.' },
  { lead: 'I build systems\nthat help teams\nmove', emphasis: 'faster.' },
];

function hashString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

const strengthIcons = [
  'ri-flashlight-line',
  'ri-route-line',
  'ri-layout-masonry-line',
  'ri-team-line',
  'ri-search-line',
];

export default function EditorialProfile({ profile }: { profile: PublicTeamProfile | null }) {
  const [liveProfile, setLiveProfile] = useState<PublicTeamProfile | null>(profile);

  useEffect(() => {
    const slug = profile?.slug || (typeof window !== 'undefined' ? window.location.pathname.split('/').filter(Boolean).pop() : null);
    if (!slug) return;
    let cancelled = false;
    supabase
      .from('public_team_profiles')
      .select('*')
      .eq('slug', slug)
      .eq('public_status', 'Published')
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled && data) {
          setLiveProfile(data as PublicTeamProfile);
        }
      });
    return () => { cancelled = true; };
  }, [profile?.slug]);

  const p = liveProfile;

  if (!p) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-6">
        <div className="w-20 h-20 rounded-2xl bg-[#1C2333]/5 flex items-center justify-center mb-4">
          <i className="ri-user-search-line text-3xl text-[#1C2333]/20 w-8 h-8 flex items-center justify-center" />
        </div>
        <h2 className="text-2xl font-bold text-[#1C2333] mb-2">Profile not found</h2>
        <p className="text-[#1C2333]/50 mb-6">This team member profile is not available.</p>
        <Link href="/team" className="px-5 py-2.5 rounded-xl bg-[#1C2333] text-white font-semibold text-sm hover:bg-[#1C2333]/80 transition-colors whitespace-nowrap cursor-pointer">
          View all team members
        </Link>
      </div>
    );
  }

  const slug = p.slug || '';
  const hash = hashString(slug);
  const palette = slug === 'amelia-hart' ? PALETTES[0] : PALETTES[hash % PALETTES.length];
  const tagline = slug === 'amelia-hart' ? TAGLINES[0] : TAGLINES[hash % TAGLINES.length];
  const accent = palette.accent;

  const initials = p.public_name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const areas = p.specialist_areas || [];
  const experience = p.experience_summary || [];
  const quals = p.qualifications || [];
  const expItems = experience.length > 0 ? experience : quals;
  const firstName = p.public_name.split(' ')[0];
  const taglineLines = tagline.lead.split('\n');

  const highlights =
    p.products && p.products.length > 0
      ? p.products
      : p.services && p.services.length > 0
      ? p.services
      : ['GuardianHub', 'LetHub', 'QuickGuard', 'Synqoro'];

  const sideLabel = p.department || 'Digital Footprint';

  return (
    <div className="bg-white min-h-screen relative overflow-hidden">
      {/* Vertical side text */}
      <div className="hidden xl:block fixed left-6 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
        <span
          className="text-[10px] tracking-[0.3em] uppercase text-[#1C2333]/30 font-medium"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          {sideLabel}
        </span>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 pt-14 lg:pt-24 pb-16">
        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-start">
          {/* Left Text Column */}
          <div className="lg:col-span-5 pt-4 lg:pt-16">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Label */}
              <div className="flex items-center gap-3 mb-8">
                <span className="text-[10px] font-semibold tracking-[0.25em] uppercase" style={{ color: accent }}>
                  Hello, I&apos;m {firstName}
                </span>
                <div className="h-px w-10 opacity-50" style={{ backgroundColor: accent }} />
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ color: accent }}>
                  <path d="M6 0L7.5 4.5L12 6L7.5 8.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z" fill="currentColor" />
                </svg>
              </div>

              {/* Headline */}
              <h1 className="font-serif text-[#1C2333] text-[2.6rem] sm:text-[3.2rem] lg:text-[3.6rem] leading-[1.08] mb-8 tracking-tight">
                {taglineLines.map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < taglineLines.length - 1 ? <br /> : ' '}
                  </span>
                ))}
                <em style={{ color: accent, fontStyle: 'italic' }}>
                  {tagline.emphasis}
                </em>
              </h1>

              {/* Short bio */}
              <p className="text-[13px] text-[#1C2333]/55 max-w-[280px] leading-[1.7] mb-10">
                {p.short_bio}
              </p>

              {/* CTA Link */}
              <Link
                href="/team"
                className="inline-flex items-center gap-2 text-[#1C2333] text-sm font-medium border-b border-[#1C2333]/20 pb-1 hover:border-[#1C2333] transition-colors cursor-pointer group"
              >
                Back to team
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="opacity-50 group-hover:opacity-100 transition-opacity"
                >
                  <path
                    d="M3 8H13M13 8L9 4M13 8L9 12"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </motion.div>
          </div>

          {/* Right Image Column */}
          <div className="lg:col-span-7 relative lg:pt-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Arch image container */}
              <div className="rounded-t-[160px] lg:rounded-t-[200px] overflow-hidden bg-[#E8E0D6] aspect-[3/4] lg:aspect-[4/5] relative">
                {p.profile_asset_id ? (
                  <img
                    src={p.profile_asset_id}
                    alt={p.image_alt_text || p.public_name}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200/40 to-[#1C2333]/10">
                    <span className="font-serif text-7xl text-[#1C2333]/15">{initials}</span>
                  </div>
                )}
              </div>

              {/* Decorative circular text */}
              <div className="absolute -right-3 top-[15%] w-[72px] h-[72px] opacity-[0.12] hidden lg:block">
                <svg viewBox="0 0 100 100" className="w-full h-full" style={{ animation: 'spin 24s linear infinite' }}>
                  <defs>
                    <path
                      id="circlePath"
                      d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                    />
                  </defs>
                  <text className="text-[8px] uppercase tracking-[0.25em] fill-[#1C2333]">
                    <textPath href="#circlePath">
                      UX Design • Strategy • Research •
                    </textPath>
                  </text>
                </svg>
              </div>

              {/* Small decorative star */}
              <div className="absolute bottom-8 right-8 w-10 h-10 bg-[#1C2333] rounded-xl flex items-center justify-center shadow-lg">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 0L8.5 5.5L14 7L8.5 8.5L7 14L5.5 8.5L0 7L5.5 5.5L7 0Z" fill="white" />
                </svg>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Three Cards Section — overlapping bottom of image */}
        <div className="mt-[-48px] md:mt-[-80px] lg:mt-[-120px] relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
            {/* Card 1: Core Strengths */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="bg-[#1C2333] text-white rounded-[20px] p-6 lg:p-8"
            >
              <h3 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/40 mb-6">
                Core Strengths
              </h3>
              <ul className="space-y-3.5">
                {areas.slice(0, 5).map((area, i) => (
                  <li key={i} className="flex items-center gap-3 text-[13px] text-white/90">
                    <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <i className={`${strengthIcons[i] || 'ri-circle-line'} text-white/70 w-3.5 h-3.5 flex items-center justify-center text-xs`} />
                    </span>
                    {area}
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-5 border-t border-white/10">
                <p className="text-[12px] text-white/35 italic font-serif leading-relaxed">
                  {p.public_job_title || 'Building better, together.'}
                </p>
              </div>
            </motion.div>

            {/* Card 2: Experience Snapshot */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-[20px] p-6 lg:p-8 border border-[#1C2333]/8 shadow-[0_1px_2px_rgba(28,35,51,0.04)]"
            >
              <h3 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#1C2333]/35 mb-8">
                Experience Snapshot
              </h3>
              <div className="space-y-4">
                {expItems.length > 0 ? (
                  expItems.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="mt-1.5 w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: accent }} />
                      <span className="text-[13px] text-[#1C2333]/60 leading-snug">{item}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-[13px] text-[#1C2333]/50 leading-snug">
                    Experience across the digital product lifecycle.
                  </p>
                )}
              </div>
            </motion.div>

            {/* Card 3: Quote */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-[20px] p-6 lg:p-8 relative"
              style={{ backgroundColor: accent }}
            >
              <div className="text-[#1C2333]/15 text-5xl font-serif leading-none mb-3">&quot;</div>
              <p className="text-[13px] text-[#1C2333]/75 leading-[1.7] mb-8">
                {p.full_bio || p.short_bio}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#1C2333]/10 flex items-center justify-center">
                  <i className="ri-user-3-line text-[#1C2333]/40 w-4 h-4 flex items-center justify-center text-xs" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[#1C2333]">{p.public_name}</p>
                  <p className="text-[10px] text-[#1C2333]/45">{p.department || 'Digital Footprint'}</p>
                </div>
              </div>
              <div className="absolute bottom-5 right-5 w-9 h-9 bg-[#1C2333] rounded-xl flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z" fill="white" />
                </svg>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Selected Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 bg-white rounded-[20px] p-5 lg:p-7 flex flex-col lg:flex-row items-center gap-5 lg:gap-10 border border-[#1C2333]/8"
        >
          <div className="flex-shrink-0">
            <p className="text-[9px] font-bold tracking-[0.15em] uppercase text-[#1C2333] leading-tight text-center lg:text-left">
              Selected
              <br />
              Highlights
            </p>
          </div>
          <div className="h-px w-16 lg:w-px lg:h-10 bg-[#1C2333]/8 hidden lg:block" />
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 lg:gap-10">
            {highlights.map((name) => (
              <span
                key={name}
                className="text-[13px] font-semibold tracking-wider text-[#1C2333]/30 uppercase"
              >
                {name}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="mt-16 text-center"
        >
          <p className="text-[13px] text-[#1C2333]/40 mb-4">Interested in working with our team?</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1C2333] text-white font-semibold text-sm hover:bg-[#1C2333]/80 transition-colors whitespace-nowrap cursor-pointer"
          >
            <i className="ri-mail-send-line w-4 h-4 flex items-center justify-center" />
            Contact Digital Footprint
          </Link>
        </motion.div>
      </div>
    </div>
  );
}