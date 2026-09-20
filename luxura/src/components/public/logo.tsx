import {
  LOGO_FULL_VIEWBOX,
  LOGO_MARK_PATH,
  LOGO_MARK_VIEWBOX,
  LOGO_TECH_PATH,
  LOGO_WORDMARK_PATH,
} from "./logo-paths";
import { cn } from "@/lib/utils";

/**
 * Luxura Tech logo as inline vector (extracted from the supplied logo file).
 * tone="onDark": lime mark + white wordmark.  tone="onLight": all navy.
 */
export function Logo({
  tone = "onDark",
  markOnly = false,
  className,
  title = "Luxura Tech",
}: {
  tone?: "onDark" | "onLight";
  markOnly?: boolean;
  className?: string;
  title?: string;
}) {
  const markFill = tone === "onDark" ? "#d4fb54" : "#0a1b36";
  const textFill = tone === "onDark" ? "#ffffff" : "#0a1b36";
  return (
    <svg
      viewBox={markOnly ? LOGO_MARK_VIEWBOX : LOGO_FULL_VIEWBOX}
      role="img"
      aria-label={title}
      className={cn("h-9 w-auto", className)}
    >
      <title>{title}</title>
      <path d={LOGO_MARK_PATH} fill={markFill} />
      {!markOnly && (
        <>
          <path d={LOGO_WORDMARK_PATH} fill={textFill} />
          <path d={LOGO_TECH_PATH} fill={textFill} />
        </>
      )}
    </svg>
  );
}
