import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  Camera,
  Gift,
  Heart,
  MapPin,
  Music4,
} from "lucide-react";

export type IconName =
  | "CalendarDays"
  | "Camera"
  | "Gift"
  | "Heart"
  | "MapPin"
  | "Music4";

export const iconMap: Record<IconName, LucideIcon> = {
  CalendarDays,
  Camera,
  Gift,
  Heart,
  MapPin,
  Music4,
};

export interface ImageItem {
  src: string;
  alt: string;
}

export interface HighlightItem {
  icon: IconName;
  label: string;
  value: string;
}

export interface FeatureItem {
  icon: IconName;
  title: string;
  description: string;
}

export interface StoryData {
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
  images: ImageItem[];
}

export interface GalleryData {
  eyebrow: string;
  title: string;
  cta: string;
  images: ImageItem[];
}

export interface TimelineItem {
  time: string;
  title: string;
  detail: string;
}

export interface TimelineData {
  title: string;
  description: string;
  items: TimelineItem[];
}

export type RsvpFieldType = "text" | "email" | "textarea";

export interface RsvpField {
  id: string;
  label: string;
  type: RsvpFieldType;
  placeholder: string;
  half: boolean;
}

export interface RsvpData {
  title: string;
  description: string;
  fields: RsvpField[];
  submit: string;
}

export interface VenueData {
  title: string;
  description: string;
  image: ImageItem;
}

export interface CountdownData {
  title: string;
  subtitle: string;
  pastTitle: string;
  pastMessage: string;
}

export interface WeddingData {
  date: string;
  dateLabel: string;
  venue: string;
  address: string;
  giftsLabel: string;
  gifts: string;
}

export interface SiteData {
  couple: {
    initials: string;
    nameOne: string;
    nameTwo: string;
    displayName: string;
    eyebrow: string;
  };
  wedding: WeddingData;
  hero: {
    badge: string;
    greeting: string;
    title: string;
    titleAccent: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    image: ImageItem;
  };
  countdown: CountdownData;
  highlights: HighlightItem[];
  features: FeatureItem[];
  story: StoryData;
  gallery: GalleryData;
  timeline: TimelineData;
  rsvp: RsvpData;
  venue: VenueData;
  footer: {
    eyebrow: string;
    name: string;
  };
}
