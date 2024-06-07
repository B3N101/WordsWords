import { loadEnvConfig } from "@next/env";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const config = {
  POSTGRES_URL: process.env.POSTGRES_URL!,
  AUTH_SECRET: process.env.AUTH_SECRET!,
  AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID!,
  AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET!,
  AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID!,
  AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET!,
  APP_ENV: process.env.APP_ENV!,
};

export default config;
