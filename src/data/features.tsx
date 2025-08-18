import {
  GlobeAltIcon,
  UserGroupIcon,
  TicketIcon,
} from "@heroicons/react/24/outline";
import { ReactNode } from "react";

export interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
}

export const features: Feature[] = [
  {
    icon: <GlobeAltIcon className="h-8 w-8" />,
    title: "Multilingual Guides",
    description: "Certified guides in English, French, and German",
  },
  {
    icon: <UserGroupIcon className="h-8 w-8" />,
    title: "Local Expertise",
    description: "Our guides know every safe corner and hidden gem of the city",
  },
  {
    icon: <TicketIcon className="h-8 w-8" />,
    title: "Exclusive Access",
    description: "Priority entry to main attractions with security escorts",
  },
];
