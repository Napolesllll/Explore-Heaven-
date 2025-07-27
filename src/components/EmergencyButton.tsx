'use client';

import { PhoneIcon } from '@heroicons/react/24/solid';

export default function EmergencyButton() {
  const handleEmergency = () => {
    window.location.href = 'tel:+5744445555';
  };

  return (
    <button 
      onClick={handleEmergency}
      className="fixed bottom-8 right-8 bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 flex items-center gap-2"
    >
      <PhoneIcon className="h-6 w-6" />
      <span>Emergency</span>
    </button>
  );
} 