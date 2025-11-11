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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <AsrarEveryday />
    </div>
  );
}
