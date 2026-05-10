// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: false,
// };

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Activează suportul pentru folderul src/
  experimental: {
    srcDir: 'src',
  },
  basePath: '', // Asigură-te că nu există un prefix nedorit
  trailingSlash: false,
};

export default nextConfig;