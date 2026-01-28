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
      // State abbreviation to full name redirects
      {
        source: '/locations/ny/:city',
        destination: '/states/new-york/:city',
        permanent: true,
      },
      {
        source: '/locations/ny',
        destination: '/states/new-york',
        permanent: true,
      },
      {
        source: '/locations/ca/:city',
        destination: '/states/california/:city',
        permanent: true,
      },
      {
        source: '/locations/ca',
        destination: '/states/california',
        permanent: true,
      },
      {
        source: '/locations/tx/:city',
        destination: '/states/texas/:city',
        permanent: true,
      },
      {
        source: '/locations/tx',
        destination: '/states/texas',
        permanent: true,
      },
      {
        source: '/locations/fl/:city',
        destination: '/states/florida/:city',
        permanent: true,
      },
      {
        source: '/locations/fl',
        destination: '/states/florida',
        permanent: true,
      },
      {
        source: '/locations/ga/:city',
        destination: '/states/georgia/:city',
        permanent: true,
      },
      {
        source: '/locations/ga',
        destination: '/states/georgia',
        permanent: true,
      },
      {
        source: '/locations/va/:city',
        destination: '/states/virginia/:city',
        permanent: true,
      },
      {
        source: '/locations/va',
        destination: '/states/virginia',
        permanent: true,
      },
      {
        source: '/locations/sc/:city',
        destination: '/states/south-carolina/:city',
        permanent: true,
      },
      {
        source: '/locations/sc',
        destination: '/states/south-carolina',
        permanent: true,
      },
      {
        source: '/locations/nc/:city',
        destination: '/states/north-carolina/:city',
        permanent: true,
      },
      {
        source: '/locations/nc',
        destination: '/states/north-carolina',
        permanent: true,
      },
      {
        source: '/locations/mn/:city',
        destination: '/states/minnesota/:city',
        permanent: true,
      },
      {
        source: '/locations/mn',
        destination: '/states/minnesota',
        permanent: true,
      },
      {
        source: '/locations/mo/:city',
        destination: '/states/missouri/:city',
        permanent: true,
      },
      {
        source: '/locations/mo',
        destination: '/states/missouri',
        permanent: true,
      },
      {
        source: '/locations/ms/:city',
        destination: '/states/mississippi/:city',
        permanent: true,
      },
      {
        source: '/locations/ms',
        destination: '/states/mississippi',
        permanent: true,
      },
      {
        source: '/locations/mi/:city',
        destination: '/states/michigan/:city',
        permanent: true,
      },
      {
        source: '/locations/mi',
        destination: '/states/michigan',
        permanent: true,
      },
      {
        source: '/locations/la/:city',
        destination: '/states/louisiana/:city',
        permanent: true,
      },
      {
        source: '/locations/la',
        destination: '/states/louisiana',
        permanent: true,
      },
      {
        source: '/locations/or/:city',
        destination: '/states/oregon/:city',
        permanent: true,
      },
      {
        source: '/locations/or',
        destination: '/states/oregon',
        permanent: true,
      },
      {
        source: '/locations/ia/:city',
        destination: '/states/iowa/:city',
        permanent: true,
      },
      {
        source: '/locations/ia',
        destination: '/states/iowa',
        permanent: true,
      },
      {
        source: '/locations/al/:city',
        destination: '/states/alabama/:city',
        permanent: true,
      },
      {
        source: '/locations/al',
        destination: '/states/alabama',
        permanent: true,
      },
      {
        source: '/locations/ar/:city',
        destination: '/states/arkansas/:city',
        permanent: true,
      },
      {
        source: '/locations/ar',
        destination: '/states/arkansas',
        permanent: true,
      },
      {
        source: '/locations/tn/:city',
        destination: '/states/tennessee/:city',
        permanent: true,
      },
      {
        source: '/locations/tn',
        destination: '/states/tennessee',
        permanent: true,
      },
      {
        source: '/locations/md/:city',
        destination: '/states/maryland/:city',
        permanent: true,
      },
      {
        source: '/locations/md',
        destination: '/states/maryland',
        permanent: true,
      },
      {
        source: '/locations/wv/:city',
        destination: '/states/west-virginia/:city',
        permanent: true,
      },
      {
        source: '/locations/wv',
        destination: '/states/west-virginia',
        permanent: true,
      },
      {
        source: '/locations/vt/:city',
        destination: '/states/vermont/:city',
        permanent: true,
      },
      {
        source: '/locations/vt',
        destination: '/states/vermont',
        permanent: true,
      },
      {
        source: '/locations/nh/:city',
        destination: '/states/new-hampshire/:city',
        permanent: true,
      },
      {
        source: '/locations/nh',
        destination: '/states/new-hampshire',
        permanent: true,
      },
      {
        source: '/locations/nj/:city',
        destination: '/states/new-jersey/:city',
        permanent: true,
      },
      {
        source: '/locations/nj',
        destination: '/states/new-jersey',
        permanent: true,
      },
      {
        source: '/locations/ct/:city',
        destination: '/states/connecticut/:city',
        permanent: true,
      },
      {
        source: '/locations/ct',
        destination: '/states/connecticut',
        permanent: true,
      },
      {
        source: '/locations/pa/:city',
        destination: '/states/pennsylvania/:city',
        permanent: true,
      },
      {
        source: '/locations/pa',
        destination: '/states/pennsylvania',
        permanent: true,
      },
      {
        source: '/locations/me/:city',
        destination: '/states/maine/:city',
        permanent: true,
      },
      {
        source: '/locations/me',
        destination: '/states/maine',
        permanent: true,
      },
      {
        source: '/locations/wi/:city',
        destination: '/states/wisconsin/:city',
        permanent: true,
      },
      {
        source: '/locations/wi',
        destination: '/states/wisconsin',
        permanent: true,
      },
      {
        source: '/locations/ne/:city',
        destination: '/states/nebraska/:city',
        permanent: true,
      },
      {
        source: '/locations/ne',
        destination: '/states/nebraska',
        permanent: true,
      },
      {
        source: '/locations/ok/:city',
        destination: '/states/oklahoma/:city',
        permanent: true,
      },
      {
        source: '/locations/ok',
        destination: '/states/oklahoma',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
