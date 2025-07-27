// src/components/sections/SafetySection.tsx
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import { SafetyTip } from '../../types';

const SafetyTipsSection = dynamic(() => import('./SafetyTipsSection'));
const MapSection = dynamic(() => import('./MapSection'));

const SafetySection = ({ safetyTips }: { safetyTips: SafetyTip[] }) => {
  const { t } = useTranslation('common');
  
  return (
    <section 
      id="safety" 
      className="bg-emerald-50 py-20"
      aria-label={t('safety.ariaLabel')}
    >
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-emerald-900">
          {t('safety.title')}
        </h2> 
        <div className="grid md:grid-cols-2 gap-8">
          <SafetyTipsSection safetyTips={safetyTips} />
          <MapSection />
        </div>
      </div>
    </section>
  );
};

export default SafetySection;