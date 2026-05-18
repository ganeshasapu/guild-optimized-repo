import config from "@guild-optimized/config-eslint/next";

export default [
  ...config,
  { ignores: ["next-env.d.ts"] },
];
