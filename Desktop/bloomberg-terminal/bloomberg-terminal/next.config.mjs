/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['nse-api-khaki.vercel.app'],
  },
  env: {
    NEXT_PUBLIC_APP_NAME: 'Bairagi Research Capital',
  },
  // react-simple-maps and d3 ship as ES modules — Next.js must transpile them
  transpilePackages: [
    'react-simple-maps',
    'd3-geo',
    'd3-array',
    'd3-color',
    'd3-format',
    'd3-interpolate',
    'd3-scale',
    'd3-time',
    'd3-timer',
    'topojson-client',
  ],
}

export default nextConfig
