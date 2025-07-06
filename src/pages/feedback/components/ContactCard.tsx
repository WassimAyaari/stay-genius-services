
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
            variant="secondary" 
            className="w-full bg-white text-gray-900 hover:bg-gray-100 font-medium border-0"
          >
            {t('feedback.contact.callReception')}
          </Button>
          <Button 
            variant="outline" 
            className="w-full border-2 border-white text-white hover:bg-white hover:text-gray-900 font-medium transition-colors"
          >
            {t('feedback.contact.liveChat')}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ContactCard;
