import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';

const plans = [
  {
    name: 'Discovery',
    price: 'Free',
    desc: 'Get started instantly',
    features: ['Mobile Web App', 'Digital Directory', 'Cashless Tipping', 'QR Code Access'],
  },
  {
    name: 'Essential',
    price: '€99/mo',
    desc: 'Full AI power',
    featured: true,
    features: ['Unlimited AI Chat', 'PMS Integration', 'Guest Profiles', 'Analytics Dashboard'],
  },
  {
    name: 'Elite',
    price: '€249/mo',
    desc: 'Total automation',
    features: ['Agentic AI Agents', 'Full Omnichannel', 'Revenue Optimizer', 'White Label'],
  },
];

const PlansScene: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-4">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-white text-xl md:text-3xl font-bold mb-2">
          Scales With Your <span className="text-primary">Ambition</span>
        </h2>
        <p className="text-white/50 text-sm">From free discovery to full automation</p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            className={`relative w-[220px] rounded-2xl p-5 backdrop-blur-xl border ${
              plan.featured
                ? 'bg-white/10 border-primary/40 shadow-lg shadow-primary/10'
                : 'bg-white/5 border-white/10'
            }`}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.2, type: 'spring', stiffness: 100 }}
          >
            {plan.featured && (
              <motion.div
                className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary text-[10px] font-semibold text-white flex items-center gap-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: 'spring' }}
              >
                <Sparkles className="w-3 h-3" /> Most Popular
              </motion.div>
            )}
            <div className="text-white text-sm font-bold mb-0.5">{plan.name}</div>
            <div className="text-primary text-xl font-bold mb-1">{plan.price}</div>
            <div className="text-white/40 text-[10px] mb-3">{plan.desc}</div>
            <div className="space-y-1.5">
              {plan.features.map((feature, fi) => (
                <motion.div
                  key={feature}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + i * 0.2 + fi * 0.15 }}
                >
                  <Check className="w-3 h-3 text-primary flex-shrink-0" />
                  <span className="text-white/60 text-[10px]">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PlansScene;
