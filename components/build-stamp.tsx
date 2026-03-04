'use client';

export function BuildStamp() {
  // Only show in preview/development, not production
  const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';
  
  // Temporarily show in production as requested
  // if (isProduction) return null;
  
  const buildDate = process.env.NEXT_PUBLIC_BUILD_DATE || new Date().toISOString();
  const formattedDate = new Date(buildDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="fixed bottom-4 right-4 text-xs font-mono text-muted-foreground opacity-50 hover:opacity-100 transition-opacity safe-bottom safe-right">
      Build: {process.env.NEXT_PUBLIC_VERCEL_ENV || 'local'} • {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0,7) || 'LOCAL'} • {formattedDate}
    </div>
  );
}
