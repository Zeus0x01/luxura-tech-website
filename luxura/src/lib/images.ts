/** Images that ship with the site (public/images). Offered in the CMS image picker. */
export const BUNDLED_IMAGES = [
  { path: "/images/highway.jpg", label: "Highway at dusk" },
  { path: "/images/skyline.jpg", label: "City skyline at night" },
  { path: "/images/showroom.jpg", label: "Vehicle in a modern hall" },
  { path: "/images/car-detail.jpg", label: "Vehicle detail, night rain" },
  { path: "/images/freeway.jpg", label: "Freeway in mist" },
  { path: "/images/data-wall.jpg", label: "Data wall" },
  { path: "/images/office.jpg", label: "Office building at dusk" },
  { path: "/images/workspace.jpg", label: "Desk above the city" },
  { path: "/og-default.jpg", label: "Default social image" },
] as const;

/** Hostnames (from IMAGE_REMOTE_HOSTS) that next/image may optimize. */
export function getRemoteImageHosts(): string[] {
  return (process.env.IMAGE_REMOTE_HOSTS ?? "")
    .split(",")
    .map((h) => h.trim())
    .filter(Boolean);
}
