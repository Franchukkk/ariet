import type { NextConfig } from "next"
import i18nextConfig from "./next-i18next.config"


const nextConfig: NextConfig = {
  reactStrictMode: true,
  compiler: { styledComponents: true },
  i18n: i18nextConfig.i18n,

  webpack(config) {
    
    const assetRule = config.module.rules.find(
      // @ts-ignore - rule shape differs by Next version
      (rule) => typeof rule === "object" && rule?.test?.test?.(".svg")
    );
    if (assetRule && typeof assetRule === "object") {
      (assetRule as any).exclude = /\.svg$/i;
    }
    
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      oneOf: [
        { resourceQuery: /url/, type: "asset/resource" }, 
        {
          use: [
            {
              loader: "@svgr/webpack",
              options: { titleProp: true },
            },
          ], 
        },
      ],
    });

    return config;
  },
};

export default nextConfig;


// import type { NextConfig } from 'next';

// const nextConfig: NextConfig = {
//   compiler: { styledComponents: true },
//   webpack(config) {
//     config.module.rules.push({
//       test: /\.svg$/i,
//       issuer: /\.[jt]sx?$/, 
//       use: [
//         {
//           loader: '@svgr/webpack',
//           options: {
//             titleProp: true,
//             ref: true,
           
//           },
//         },
//       ],
//     });
//     return config;
//   },
// };

// export default nextConfig;





// import type { NextConfig } from 'next';

// const nextConfig: NextConfig = {
//   compiler: { styledComponents: true },
//   webpack(config) {
//     config.module.rules.push({
//       test: /\.svg$/i,
//       issuer: /\.[jt]sx?$/,
//       use: [{ loader: '@svgr/webpack', options: { titleProp: true } }],
//     });
//     return config;
//   },
// };

// export default nextConfig;