import { ImageResponse } from 'next/og';

export const alt = 'Digital Footprint — Digital systems for independent UK businesses';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', height: '100%', background: '#0f172a', color: '#fff', padding: '80px' }}>
      <div style={{ display: 'flex', fontSize: 30, color: '#22d3ee', marginBottom: 36 }}>DIGITAL FOOTPRINT</div>
      <div style={{ display: 'flex', fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>Built around your business.</div>
      <div style={{ display: 'flex', fontSize: 30, color: '#cbd5e1', marginTop: 32 }}>Websites · Client portals · Automation · AI-powered tools</div>
      <div style={{ display: 'flex', fontSize: 24, color: '#22d3ee', marginTop: 60 }}>digital-footprint.uk</div>
    </div>,
    size,
  );
}
