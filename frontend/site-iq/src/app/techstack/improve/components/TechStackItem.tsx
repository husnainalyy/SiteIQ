import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { TechStack } from '../types';

interface TechStackItemProps {
  tech: TechStack;
  title: string;
  index: number;
  delay?: number;
}

export const TechStackItem: React.FC<TechStackItemProps> = ({ tech, title, index, delay = 0 }) => {
  if (!tech || !tech.reason) {
    return null;
  }

  return (
    <motion.div
      key={title}
      className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay + (index * 0.1) }}
      whileHover={{ y: -5 }}
    >
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 flex items-center justify-center mr-4 shadow-md">
          <span className="text-white font-semibold text-lg">{title[0]}</span>
        </div>
        <h4 className="text-2xl font-semibold text-gray-800 dark:text-white">{title}</h4>
      </div>
      
      <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">{tech.reason}</p>
      
      {tech.stack && tech.stack.length > 0 && (
        <div className="space-y-4">
          <div>
            <h5 className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-3">Recommended Technologies</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tech.stack.map((item, i) => (
                <div 
                  key={i} 
                  className="flex items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
                >
                  <Check size={16} className="text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}; 