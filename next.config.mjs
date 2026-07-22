/** @type {import('next').NextConfig} */
const nextConfig = {
  // The basket route was briefly /bucket; keep any already-shared links alive
  // (query string — e.g. ?items=… — is preserved through the redirect).
  async redirects() {
    return [{ source: "/bucket", destination: "/basket", permanent: true }];
  },
};

export default nextConfig;
