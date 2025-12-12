'use client';

import Script from 'next/script';
import { Analytics as VercelAnalytics } from '@vercel/analytics/next';

export default function Analytics() {
  // Add your Google Analytics ID here when ready
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <>
      {GA_MEASUREMENT_ID && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
        </>
      )}
      <VercelAnalytics />
    </>
  );
}
