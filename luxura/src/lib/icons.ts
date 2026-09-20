import {
  Briefcase,
  Building2,
  Bus,
  Car,
  CarFront,
  ChartColumn,
  BrainCircuit,
  Compass,
  Cpu,
  Database,
  Factory,
  Gauge,
  Globe,
  Handshake,
  Layers,
  Lightbulb,
  Megaphone,
  Network,
  Radar,
  Rocket,
  Route,
  ShieldCheck,
  Sparkles,
  Store,
  Target,
  TrendingUp,
  Truck,
  Users,
  Workflow,
  Wrench,
  Zap,
  Landmark,
  type LucideIcon,
} from "lucide-react";

/**
 * Icons the CMS can choose from. Listed explicitly (instead of importing every
 * Lucide icon) so the JavaScript bundle stays small.
 */
export const ICONS = {
  Briefcase,
  Building2,
  Bus,
  Car,
  CarFront,
  ChartColumn,
  BrainCircuit,
  Compass,
  Cpu,
  Database,
  Factory,
  Gauge,
  Globe,
  Handshake,
  Landmark,
  Layers,
  Lightbulb,
  Megaphone,
  Network,
  Radar,
  Rocket,
  Route,
  ShieldCheck,
  Sparkles,
  Store,
  Target,
  TrendingUp,
  Truck,
  Users,
  Workflow,
  Wrench,
  Zap,
} satisfies Record<string, LucideIcon>;

export type IconKey = keyof typeof ICONS;
export const ICON_KEYS = Object.keys(ICONS) as IconKey[];

export function getIcon(key: string | null | undefined): LucideIcon {
  if (key && key in ICONS) return ICONS[key as IconKey];
  return Layers;
}
