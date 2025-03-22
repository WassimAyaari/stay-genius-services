
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Headphones, Settings } from 'lucide-react';

const AssistanceSection = () => {
  return (
    <section className="px-6 mb-10">
      <div className="flex flex-col gap-4">
        <Link to="/contact">
          <Card className="bg-primary text-white p-4 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2.5 rounded-xl">
                  <Headphones className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Need Assistance?</h3>
                  <p className="text-sm">We're here to help 24/7</p>
                </div>
              </div>
              <div className="bg-white rounded-full p-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M12 5L18 11M12 5L6 11" stroke="#00AFB9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </Card>
        </Link>
        
        <Link to="/admin">
          <Card className="bg-secondary text-white p-4 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2.5 rounded-xl">
                  <Settings className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Administration</h3>
                  <p className="text-sm">Gérer votre hôtel</p>
                </div>
              </div>
              <div className="bg-white rounded-full p-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M12 5L18 11M12 5L6 11" stroke="#00AFB9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </section>
  );
};

export default AssistanceSection;
