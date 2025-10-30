'use client';

import AsrarEveryday from '../asrar-everyday-app';

/**
 * Home page component for Asrār Everyday
 * 
 * Note: Metadata is inherited from root layout.tsx
 * For page-specific metadata, create a separate server component layout
 * or use the root metadata which applies to all pages.
 * 
 * In Next.js 14, 'use client' components cannot export metadata.
 * Metadata must be exported from server components (default behavior).
 */
export default function Home() {
  return (
    <div className="min-h-screen">
      <AsrarEveryday />
    </div>
  );
}
