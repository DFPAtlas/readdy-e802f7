'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from '@/components/motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

interface TeamProfile {
  id: string;
  public_name: string;
  slug: string;
  public_job_title: string | null;
  department: string | null;
  leadership_level: string | null;
  short_bio: string | null;
  specialist_areas: string[] | null;
  profile_asset_id: string | null;
  image_alt_text: string | null;
  display_order: number;
  featured: boolean;
}

const DEPARTMENTS = [
  'Leadership',
  'Product and Strategy',
  'UI Development',
  'UX Development',
  'Software Engineering',
  'AI and Automation',
  'Client Delivery',
  'Quality Assurance',
  'Support',
  'Sales and Partnerships',
  'Operations',
];

const ACCENTS = ['#06B6D4', '#8B5CF6', '#F59E0B', '#10B981', '#EC4899'];

function initialsOf(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function TeamPageClient({ initialProfiles }: { initialProfiles: TeamProfile[] }) {
  const [profiles, setProfiles] = useState<TeamProfile[]>(initialProfiles);
  const [deptFilter, setDeptFilter] = useState('all');

  useEffect(() => {
    let cancelled = false;
    supabase
      .from('public_team_profiles')
      .select('id,public_name,slug,public_job_title,department,leadership_level,short_bio,specialist_areas,profile_asset_id,image_alt_text,display_order,featured')
      .eq('public_status', 'Published')
      .order('display_order')
      .then(({ data }) => {
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setProfiles(data as TeamProfile[]);
        }
      });
    return () => { cancelled = true; };
  }, []);

  const activeDepts = [...new Set(profiles.map((p) => p.department).filter(Boolean))] as string[];
  const filteredProfiles = deptFilter === 'all'
    ? profiles
    : profiles.filter((p) => p.department === deptFilter);

  const featured = filteredProfiles.filter((p) => p.featured);
  const rest = filteredProfiles.filter((p) => !p.featured);

  return (
    <>
      <style>{`
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-slow { animation: spinSlow 28s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .spin-slow { animation: none; }
        }
      `}</style>

      <Header />

      <main id="main-content" className="min-h-screen bg-[#FAFAF7]">
        {/* Hero */}
        <section className="pt-28 lg:pt-36 pb-16 px-6 bg-[#FAFAF7]">
          <div className="max-w-[1200px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-end"
            >
              <div className="lg:col-span-8">
                <div className="flex items-center gap-3 mb-7">
                  <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#1C2333]/40">
                    Meet the team
                  </span>
                  <div className="h-px w-10 bg-[#1C2333]/20" />
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-[#06B6D4]">
                    <path d="M6 0L7.5 4.5L12 6L7.5 8.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z" fill="currentColor" />
                  </svg>
                </div>
                <h1 className="font-serif text-[#1C2333] text-[2.6rem] sm:text-[3.4rem] lg:text-[4.4rem] leading-[1.02] tracking-tight">
                  The people behind
                  <br />
                  <em className="not-italic text-[#06B6D4]">Digital Footprint</em>
                </h1>
                <p className="mt-6 text-[15px] text-[#1C2333]/55 max-w-xl leading-relaxed">
                  A small, senior team of specialists — not a sprawling agency where you get lost in the crowd. Everyone you meet here works directly on your project.
                </p>
              </div>

              <div className="lg:col-span-4 lg:pl-8">
                <div className="flex items-end gap-8 lg:gap-10 border-l-2 border-[#06B6D4]/30 pl-6">
                  <div>
                    <div className="font-serif text-4xl lg:text-5xl text-[#1C2333]">{profiles.length}</div>
                    <div className="mt-1 text-[11px] uppercase tracking-[0.15em] text-[#1C2333]/40">Specialists</div>
                  </div>
                  <div>
                    <div className="font-serif text-4xl lg:text-5xl text-[#1C2333]">{activeDepts.length}</div>
                    <div className="mt-1 text-[11px] uppercase tracking-[0.15em] text-[#1C2333]/40">Disciplines</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Empty state */}
        {profiles.length === 0 && (
          <section className="pb-24 px-6">
            <div className="max-w-[1200px] mx-auto">
              <div className="text-center py-20 bg-white rounded-[24px] border border-[#1C2333]/8">
                <div className="w-20 h-20 rounded-full bg-[#1C2333]/5 flex items-center justify-center mx-auto mb-5">
                  <i className="ri-team-line text-3xl text-[#1C2333]/25 w-8 h-8 flex items-center justify-center" />
                </div>
                <h2 className="font-serif text-2xl text-[#1C2333] mb-2">Team profiles coming soon</h2>
                <p className="text-[#1C2333]/50 mb-7">We&apos;re preparing our team profiles. Check back shortly.</p>
                <Link href="/contact" className="inline-flex px-6 py-3 rounded-xl bg-[#1C2333] text-white font-semibold text-sm hover:bg-[#1C2333]/85 transition-colors whitespace-nowrap cursor-pointer">
                  Get in touch
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Leadership / Featured */}
        {featured.length > 0 && (
          <section className="pb-16 px-6">
            <div className="max-w-[1200px] mx-auto">
              <div className="flex items-center gap-3 mb-9">
                <i className="ri-star-fill text-[#06B6D4] w-4 h-4 flex items-center justify-center" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1C2333]/40">Leadership</span>
                <div className="h-px flex-1 bg-[#1C2333]/10" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featured.map((p, i) => (
                  <FeaturedCard key={p.id} profile={p} index={i} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Team members */}
        {rest.length > 0 && (
          <section className="pb-20 px-6">
            <div className="max-w-[1200px] mx-auto">
              {activeDepts.length > 1 && (
                <div className="flex flex-wrap items-center gap-2 mb-9">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1C2333]/40 mr-1">
                    Filter
                  </span>
                  <button
                    onClick={() => setDeptFilter('all')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                      deptFilter === 'all'
                        ? 'bg-[#1C2333] text-white'
                        : 'bg-white text-[#1C2333]/60 border border-[#1C2333]/12 hover:border-[#1C2333]/30'
                    }`}
                  >
                    All
                  </button>
                  {DEPARTMENTS.filter((d) => activeDepts.includes(d)).map((dept) => (
                    <button
                      key={dept}
                      onClick={() => setDeptFilter(dept)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                        deptFilter === dept
                          ? 'bg-[#1C2333] text-white'
                          : 'bg-white text-[#1C2333]/60 border border-[#1C2333]/12 hover:border-[#1C2333]/30'
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              )}

              {rest.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-[#1C2333]/50">No team members found in this department.</p>
                  <button
                    onClick={() => setDeptFilter('all')}
                    className="mt-3 text-[#06B6D4] text-sm font-medium hover:underline cursor-pointer"
                  >
                    Clear filter
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
                  {rest.map((p) => (
                    <MemberCard key={p.id} profile={p} />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-20 px-6 bg-[#1C2333] relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-[#06B6D4]/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-24 w-72 h-72 rounded-full bg-[#8B5CF6]/10 blur-3xl pointer-events-none" />
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <svg width="20" height="20" viewBox="0 0 12 12" fill="none" className="text-[#06B6D4] mx-auto mb-5">
              <path d="M6 0L7.5 4.5L12 6L7.5 8.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z" fill="currentColor" />
            </svg>
            <h2 className="font-serif text-3xl lg:text-4xl text-white tracking-tight mb-4">
              Want to join the team?
            </h2>
            <p className="text-white/55 max-w-xl mx-auto mb-8 leading-relaxed">
              We&apos;re always looking for talented people who care about building great digital products. If you think you&apos;d be a good fit, we&apos;d love to hear from you.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#06B6D4] text-[#1C2333] font-semibold text-sm hover:bg-[#22c7e4] transition-colors whitespace-nowrap cursor-pointer"
            >
              <i className="ri-mail-send-line w-4 h-4 flex items-center justify-center" />
              Get in touch
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

function FeaturedCard({ profile, index }: { profile: TeamProfile; index: number }) {
  const initials = initialsOf(profile.public_name);
  const accent = ACCENTS[index % ACCENTS.length];
  const areas = (profile.specialist_areas || []).slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/team/${profile.slug}`} className="group block">
        <div className="rounded-t-[120px] rounded-b-[20px] overflow-hidden bg-[#E8E0D6] aspect-[4/5] relative">
          {profile.profile_asset_id ? (
            <img
              src={profile.profile_asset_id}
              alt={profile.image_alt_text || profile.public_name}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1C2333]/5 to-[#1C2333]/10">
              <span className="font-serif text-6xl text-[#1C2333]/15">{initials}</span>
            </div>
          )}
          <div className="absolute top-5 left-5 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase text-white bg-[#1C2333]/80 backdrop-blur-sm">
            {profile.leadership_level || 'Leadership'}
          </div>
        </div>

        <div className="px-1 pt-5 text-center">
          <h3 className="font-serif text-2xl text-[#1C2333] group-hover:text-[#06B6D4] transition-colors">
            {profile.public_name}
          </h3>
          {profile.public_job_title && (
            <p className="mt-1 text-sm font-medium" style={{ color: accent }}>
              {profile.public_job_title}
            </p>
          )}
          {profile.short_bio && (
            <p className="mt-3 text-[13px] text-[#1C2333]/50 leading-relaxed line-clamp-2">
              {profile.short_bio}
            </p>
          )}
          {areas.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-1.5">
              {areas.map((area, i) => (
                <span key={i} className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#1C2333]/5 text-[#1C2333]/55">
                  {area}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

function MemberCard({ profile }: { profile: TeamProfile }) {
  const initials = initialsOf(profile.public_name);

  return (
    <Link href={`/team/${profile.slug}`} className="group block">
      <div className="rounded-[20px] overflow-hidden bg-[#E8E0D6] aspect-[3/4] relative">
        {profile.profile_asset_id ? (
          <img
            src={profile.profile_asset_id}
            alt={profile.image_alt_text || profile.public_name}
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1C2333]/5 to-[#1C2333]/10">
            <span className="font-serif text-4xl text-[#1C2333]/15">{initials}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C2333]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <div className="pt-3">
        <h3 className="font-serif text-lg text-[#1C2333] group-hover:text-[#06B6D4] transition-colors leading-tight">
          {profile.public_name}
        </h3>
        {profile.public_job_title && (
          <p className="mt-0.5 text-[12px] font-medium text-[#1C2333]/50 truncate">{profile.public_job_title}</p>
        )}
        {profile.department && (
          <p className="mt-0.5 text-[11px] text-[#1C2333]/35">{profile.department}</p>
        )}
      </div>
    </Link>
  );
}