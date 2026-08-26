import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Metadata } from 'next';
import EditorialProfile, { type PublicTeamProfile } from '../EditorialProfile';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const SITE_URL = 'https://digital-footprint.uk';

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  return createSupabaseClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

async function fetchPublishedProfile(slug: string): Promise<PublicTeamProfile | null> {
  const client = getSupabaseClient();
  if (!client) {
    return null;
  }

  try {
    const { data } = await client
      .from('public_team_profiles')
      .select('*')
      .eq('slug', slug)
      .eq('public_status', 'Published')
      .maybeSingle();

    return (data as PublicTeamProfile) || null;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  const client = getSupabaseClient();

  if (!client) {
    return [
      { slug: 'martin-hewett' },
      { slug: 'chris' },
      { slug: 'amelia-hart' },
    ];
  }

  try {
    const { data } = await client
      .from('public_team_profiles')
      .select('slug')
      .eq('public_status', 'Published');

    return (data || []).map((profile: { slug: string }) => ({ slug: profile.slug }));
  } catch {
    return [
      { slug: 'martin-hewett' },
      { slug: 'chris' },
      { slug: 'amelia-hart' },
    ];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const profile = await fetchPublishedProfile(slug);

  if (!profile) {
    return {
      title: 'Team Member',
      alternates: { canonical: `${SITE_URL}/team` },
      robots: { index: false, follow: false },
    };
  }

  const name = profile.public_name;
  const jobTitle = profile.public_job_title;
  const title = jobTitle ? `${name} — ${jobTitle}` : name;
  const description = profile.short_bio || `${name}, part of the Digital Footprint team.`;
  const canonical = `${SITE_URL}/team/${profile.slug}`;
  const image = profile.profile_asset_id || `${SITE_URL}/og-image.jpg`;
  const imageAlt = profile.image_alt_text || name;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'profile',
      title,
      description,
      url: canonical,
      siteName: 'Digital Footprint',
      images: [{ url: image, alt: imageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

function buildPersonSchema(profile: PublicTeamProfile, slug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.public_name,
    jobTitle: profile.public_job_title || undefined,
    description: profile.short_bio || undefined,
    image: profile.profile_asset_id || undefined,
    url: `${SITE_URL}/team/${slug}`,
  };
}

export default async function TeamProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = await fetchPublishedProfile(slug);

  const personSchema = profile ? buildPersonSchema(profile, slug) : null;

  return (
    <>
      {personSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema).replace(/</g, '\\u003c'),
          }}
        />
      )}
      <Header />
      <main id="main-content" className="min-h-screen bg-white">
        <EditorialProfile profile={profile} />
      </main>
      <Footer />
    </>
  );
}