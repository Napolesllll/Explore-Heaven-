"use client";

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface BackButtonProps {
  href?: string;
}

export default function BackButton({ href = "/" }: BackButtonProps) {
  return (
    <Link
      href={href}
      className="fixed top-4 left-4 z-50 flex items-center space-x-1 bg-gray-800/80 hover:bg-gray-700/90 backdrop-blur-sm border border-yellow-400/30 text-yellow-400 px-4 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-yellow-400/20"
    >
      <ArrowLeftIcon className="h-5 w-5" />
      <span className="font-medium">Regresar</span>
    </Link>
  );
}
