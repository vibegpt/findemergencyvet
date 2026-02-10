import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      // ============================================
      // NY-specific redirects (must be BEFORE generic)
      // ============================================
      {
        source: '/states/new-york',
        destination: '/new-york',
        permanent: true,
      },
      {
        source: '/states/new-york/:city',
        destination: '/new-york/:city',
        permanent: true,
      },
      {
        source: '/locations/ny/:city',
        destination: '/new-york/:city',
        permanent: true,
      },
      {
        source: '/locations/ny',
        destination: '/new-york',
        permanent: true,
      },
      // Old flat NY URLs
      {
        source: '/westchester-ny',
        destination: '/new-york/westchester',
        permanent: true,
      },
      {
        source: '/rochester-ny',
        destination: '/new-york/rochester',
        permanent: true,
      },
      {
        source: '/buffalo-ny',
        destination: '/new-york/buffalo',
        permanent: true,
      },
      {
        source: '/albany-ny',
        destination: '/new-york/albany',
        permanent: true,
      },
      {
        source: '/syracuse-ny',
        destination: '/new-york/syracuse',
        permanent: true,
      },
      {
        source: '/long-island-ny',
        destination: '/new-york/long-island',
        permanent: true,
      },
      {
        source: '/nyc-ny',
        destination: '/new-york/nyc',
        permanent: true,
      },
      {
        source: '/ithaca-ny',
        destination: '/new-york/ithaca',
        permanent: true,
      },

      // ============================================
      // Generic /states/ → / redirects (all states)
      // NY is already handled above, so these catch the rest
      // ============================================
      {
        source: '/states/:state/:city',
        destination: '/:state/:city',
        permanent: true,
      },
      {
        source: '/states/:state',
        destination: '/:state',
        permanent: true,
      },

      // ============================================
      // /locations/:abbr → /:state redirects
      // ============================================
      {
        source: '/locations/ca/:city',
        destination: '/california/:city',
        permanent: true,
      },
      {
        source: '/locations/ca',
        destination: '/california',
        permanent: true,
      },
      {
        source: '/locations/tx/:city',
        destination: '/texas/:city',
        permanent: true,
      },
      {
        source: '/locations/tx',
        destination: '/texas',
        permanent: true,
      },
      {
        source: '/locations/fl/:city',
        destination: '/florida/:city',
        permanent: true,
      },
      {
        source: '/locations/fl',
        destination: '/florida',
        permanent: true,
      },
      {
        source: '/locations/ga/:city',
        destination: '/georgia/:city',
        permanent: true,
      },
      {
        source: '/locations/ga',
        destination: '/georgia',
        permanent: true,
      },
      {
        source: '/locations/va/:city',
        destination: '/virginia/:city',
        permanent: true,
      },
      {
        source: '/locations/va',
        destination: '/virginia',
        permanent: true,
      },
      {
        source: '/locations/sc/:city',
        destination: '/south-carolina/:city',
        permanent: true,
      },
      {
        source: '/locations/sc',
        destination: '/south-carolina',
        permanent: true,
      },
      {
        source: '/locations/nc/:city',
        destination: '/north-carolina/:city',
        permanent: true,
      },
      {
        source: '/locations/nc',
        destination: '/north-carolina',
        permanent: true,
      },
      {
        source: '/locations/mn/:city',
        destination: '/minnesota/:city',
        permanent: true,
      },
      {
        source: '/locations/mn',
        destination: '/minnesota',
        permanent: true,
      },
      {
        source: '/locations/mo/:city',
        destination: '/missouri/:city',
        permanent: true,
      },
      {
        source: '/locations/mo',
        destination: '/missouri',
        permanent: true,
      },
      {
        source: '/locations/ms/:city',
        destination: '/mississippi/:city',
        permanent: true,
      },
      {
        source: '/locations/ms',
        destination: '/mississippi',
        permanent: true,
      },
      {
        source: '/locations/mi/:city',
        destination: '/michigan/:city',
        permanent: true,
      },
      {
        source: '/locations/mi',
        destination: '/michigan',
        permanent: true,
      },
      {
        source: '/locations/la/:city',
        destination: '/louisiana/:city',
        permanent: true,
      },
      {
        source: '/locations/la',
        destination: '/louisiana',
        permanent: true,
      },
      {
        source: '/locations/or/:city',
        destination: '/oregon/:city',
        permanent: true,
      },
      {
        source: '/locations/or',
        destination: '/oregon',
        permanent: true,
      },
      {
        source: '/locations/ia/:city',
        destination: '/iowa/:city',
        permanent: true,
      },
      {
        source: '/locations/ia',
        destination: '/iowa',
        permanent: true,
      },
      {
        source: '/locations/al/:city',
        destination: '/alabama/:city',
        permanent: true,
      },
      {
        source: '/locations/al',
        destination: '/alabama',
        permanent: true,
      },
      {
        source: '/locations/ar/:city',
        destination: '/arkansas/:city',
        permanent: true,
      },
      {
        source: '/locations/ar',
        destination: '/arkansas',
        permanent: true,
      },
      {
        source: '/locations/tn/:city',
        destination: '/tennessee/:city',
        permanent: true,
      },
      {
        source: '/locations/tn',
        destination: '/tennessee',
        permanent: true,
      },
      {
        source: '/locations/md/:city',
        destination: '/maryland/:city',
        permanent: true,
      },
      {
        source: '/locations/md',
        destination: '/maryland',
        permanent: true,
      },
      {
        source: '/locations/wv/:city',
        destination: '/west-virginia/:city',
        permanent: true,
      },
      {
        source: '/locations/wv',
        destination: '/west-virginia',
        permanent: true,
      },
      {
        source: '/locations/vt/:city',
        destination: '/vermont/:city',
        permanent: true,
      },
      {
        source: '/locations/vt',
        destination: '/vermont',
        permanent: true,
      },
      {
        source: '/locations/nh/:city',
        destination: '/new-hampshire/:city',
        permanent: true,
      },
      {
        source: '/locations/nh',
        destination: '/new-hampshire',
        permanent: true,
      },
      {
        source: '/locations/nj/:city',
        destination: '/new-jersey/:city',
        permanent: true,
      },
      {
        source: '/locations/nj',
        destination: '/new-jersey',
        permanent: true,
      },
      {
        source: '/locations/ct/:city',
        destination: '/connecticut/:city',
        permanent: true,
      },
      {
        source: '/locations/ct',
        destination: '/connecticut',
        permanent: true,
      },
      {
        source: '/locations/pa/:city',
        destination: '/pennsylvania/:city',
        permanent: true,
      },
      {
        source: '/locations/pa',
        destination: '/pennsylvania',
        permanent: true,
      },
      {
        source: '/locations/me/:city',
        destination: '/maine/:city',
        permanent: true,
      },
      {
        source: '/locations/me',
        destination: '/maine',
        permanent: true,
      },
      {
        source: '/locations/wi/:city',
        destination: '/wisconsin/:city',
        permanent: true,
      },
      {
        source: '/locations/wi',
        destination: '/wisconsin',
        permanent: true,
      },
      {
        source: '/locations/ne/:city',
        destination: '/nebraska/:city',
        permanent: true,
      },
      {
        source: '/locations/ne',
        destination: '/nebraska',
        permanent: true,
      },
      {
        source: '/locations/ok/:city',
        destination: '/oklahoma/:city',
        permanent: true,
      },
      {
        source: '/locations/ok',
        destination: '/oklahoma',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
