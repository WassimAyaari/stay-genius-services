
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PhoneCall, Mail, MapPin } from 'lucide-react';
import Layout from '@/components/Layout';

const Contact = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-secondary text-center mb-8">{t('contact.title')}</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6 animate-in fade-in-50 duration-500">
            <h2 className="text-xl font-semibold mb-6">{t('contact.form.title')}</h2>
            <form className="space-y-4">
              <div>
                <Input placeholder={t('contact.form.yourName')} className="bg-gray-50/50" />
              </div>
              <div>
                <Input type="email" placeholder={t('contact.form.yourEmail')} className="bg-gray-50/50" />
              </div>
              <div>
                <Input placeholder={t('contact.form.subject')} className="bg-gray-50/50" />
              </div>
              <div>
                <Textarea 
                  placeholder={t('contact.form.yourMessage')}
                  className="min-h-[150px] bg-gray-50/50"
                />
              </div>
              <Button className="w-full">{t('contact.form.sendMessage')}</Button>
            </form>
          </Card>

          <div className="space-y-4">
            <Card className="p-6 animate-in fade-in-50 duration-500 delay-100">
              <div className="flex items-start gap-4">
                <PhoneCall className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-medium mb-2">{t('contact.info.phone')}</h3>
                  <p className="text-gray-600">{t('contact.info.phoneNumber')}</p>
                  <p className="text-gray-600">{t('contact.info.available247')}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 animate-in fade-in-50 duration-500 delay-200">
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-medium mb-2">{t('contact.info.email')}</h3>
                  <p className="text-gray-600">{t('contact.info.primaryEmail')}</p>
                  <p className="text-gray-600">{t('contact.info.supportEmail')}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 animate-in fade-in-50 duration-500 delay-300">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-medium mb-2">{t('contact.info.address')}</h3>
                  <p className="text-gray-600">
                    {t('contact.info.fullAddress').split('\n').map((line, index) => (
                      <span key={index}>
                        {line}
                        {index < t('contact.info.fullAddress').split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
