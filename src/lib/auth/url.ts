import { getSiteUrl } from "@/lib/seo/site";

export function getAuthBaseUrl(): string {
  return getSiteUrl();
}

export const AUTH_TRUSTED_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://www.nagaclub.de",
  "https://nagaclub.de",
];
