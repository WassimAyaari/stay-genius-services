
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ContactCard = () => {
  const { t } = useTranslation();

  return (
    <div className="mb-8">
      <Card className="p-6 rounded-xl bg-primary text-white">
        <h3 className="font-semibold text-lg mb-2">{t('feedback.contact.needAssistance')}</h3>
        <p className="mb-4">{t('feedback.contact.assistanceDescription')}</p>
        <div className="grid grid-cols-2 gap-3">
          <Button 
            className="w-full bg-white text-slate-900 hover:bg-slate-100 font-medium border-0 shadow-sm"
          >
            {t('feedback.contact.callReception')}
          </Button>
          <Button 
            className="w-full bg-transparent border-2 border-white text-white hover:bg-white hover:text-slate-900 font-medium transition-all duration-200"
          >
            {t('feedback.contact.liveChat')}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ContactCard;
