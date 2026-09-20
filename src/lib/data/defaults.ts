import type { SiteSettingsDTO } from "./types";

/** Used only if the settings row is missing (for example before the first seed). */
export const DEFAULT_SETTINGS: SiteSettingsDTO = {
  companyName: "Luxura Tech USA LLC",
  companyEmail: null,
  phone: null,
  address: null,
  logoUrl: null,
  faviconUrl: null,
  linkedinUrl: null,
  xUrl: null,
  facebookUrl: null,
  instagramUrl: null,
  youtubeUrl: null,
  footerText: "Technology, automotive, and business solutions.",
  defaultSeoTitle: "Luxura Tech USA LLC — Technology, Automotive & Business Solutions",
  defaultSeoDescription:
    "Luxura Tech USA LLC combines technology, automotive expertise, and business consulting to deliver innovative solutions for today's global market.",
  defaultOgImage: null,
};
