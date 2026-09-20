import Image from "next/image";
import { getRemoteImageHosts } from "@/lib/images";

type Props = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
};

function isOptimizable(src: string): boolean {
  if (src.startsWith("/")) return true;
  try {
    return getRemoteImageHosts().includes(new URL(src).hostname);
  } catch {
    return false;
  }
}

/**
 * Image whose source comes from the CMS. Local files and hosts listed in
 * IMAGE_REMOTE_HOSTS go through next/image (resizing, WebP/AVIF, lazy loading).
 * Any other https URL is rendered as a plain lazy <img> so the image optimizer
 * is never turned into an open proxy.
 */
export function CmsImage({ src, alt, className, sizes, priority, fill, width, height }: Props) {
  if (isOptimizable(src)) {
    return fill ? (
      <Image src={src} alt={alt} fill sizes={sizes ?? "100vw"} priority={priority} className={className} />
    ) : (
      <Image src={src} alt={alt} width={width ?? 1200} height={height ?? 675} sizes={sizes} priority={priority} className={className} />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      referrerPolicy="no-referrer"
      className={fill ? `absolute inset-0 size-full ${className ?? ""}` : className}
      {...(fill ? {} : { width, height })}
    />
  );
}
