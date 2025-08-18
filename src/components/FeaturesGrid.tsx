"use client";
import React from "react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeaturesGridProps {
  features: Feature[];
  className?: string;
}

export default function FeaturesGrid({
  features,
  className = "",
}: FeaturesGridProps) {
  return (
    <div className={`grid md:grid-cols-3 gap-12 text-center ${className}`}>
      {features.map((feature, index) => (
        <div key={index} className="space-y-6">
          <div className="mx-auto bg-yellow-400/10 p-4 rounded-full w-20 h-20 flex items-center justify-center">
            {feature.icon}
          </div>
          <h3 className="text-xl font-bold text-white">{feature.title}</h3>
          <p className="text-gray-300 leading-relaxed">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}
