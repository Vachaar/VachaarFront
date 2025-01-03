/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      //for handling cors
      {
        source: "/vachaar-api/:path*",
        destination: `${process.env.NODE_ENV === "development" ? "http://localhost" : process.env.NEXT_PUBLIC_BASE_URL}/:path*/`,
      },
    ];
  },
};

module.exports = nextConfig;
