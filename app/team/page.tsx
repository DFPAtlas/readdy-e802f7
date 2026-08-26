import type { Metadata } from 'next';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import JsonLdScript from '@/components/JsonLdScript';
import TeamPageClient from './TeamPageClient';

const SITE_URL = 'https://digital-footprint.uk';

export const metadata: Metadata = {
  title: 'Meet the Digital Footprint Team',
  description:
    'Meet the people behind Digital Footprint — the small, senior team of specialists who design and build websites, business systems, automation and AI-powered tools for independent UK businesses.',
  alternates: {
    canonical: `${SITE_URL}/team`,
  },
  openGraph: {
    type: 'website',
    title: 'Meet the Digital Footprint Team',
    description:
      'Meet the people behind Digital Footprint — the small, senior team of specialists who design and build websites, business systems, automation and AI-powered tools for independent UK businesses.',
    url: `${SITE_URL}/team`,
    siteName: 'Digital Footprint',
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Meet the Digital Footprint Team',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meet the Digital Footprint Team',
    description:
      'Meet the people behind Digital Footprint — the small, senior team of specialists who design and build websites, business systems, automation and AI-powered tools for independent UK businesses.',
    images: [`${SITE_URL}/og-image.jpg`],
  },
};

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

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createSupabaseClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

async function fetchTeamProfiles(): Promise<TeamProfile[]> {
  const client = getSupabaseClient();
  if (!client) return [];
  try {
    const { data } = await client
      .from('public_team_profiles')
      .select('id,public_name,slug,public_job_title,department,leadership_level,short_bio,specialist_areas,profile_asset_id,image_alt_text,display_order,featured')
      .eq('public_status', 'Published')
      .order('display_order');
    return (data || []) as TeamProfile[];
  } catch {
    return [];
  }
}

const teamPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Meet the Digital Footprint Team',
  description:
    'Meet the people behind Digital Footprint — the small, senior team of specialists who design and build websites, business systems, automation and AI-powered tools for independent UK businesses.',
  url: `${SITE_URL}/team`,
  publisher: {
    '@type': 'Organization',
    name: 'Digital Footprint',
  },
};

export default async function TeamPage() {
  const profiles = await fetchTeamProfiles();
  return (
    <>
      <JsonLdScript schemas={[teamPageSchema]} />
      <TeamPageClient initialProfiles={profiles} />
    </>
  );
}