import { motion } from 'motion/react';
import { Stethoscope } from 'lucide-react';

interface PreloaderProps {
  onLoadingComplete?: () => void;
  key?: string;
}

export default function Preloader({ onLoadingComplete }: PreloaderProps) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
      onAnimationComplete={() => onLoadingComplete?.()}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden"
    >
      <div className="flex flex-col items-center">
        {/* Logo/Icon Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            ease: "easeOut" 
          }}
          className="w-20 h-20 bg-blue-600 rounded-[24px] flex items-center justify-center shadow-2xl shadow-blue-200 mb-8"
        >
          <Stethoscope className="text-white w-10 h-10" />
        </motion.div>

        {/* Brand Name */}
        <div className="relative mb-4">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl font-sans font-bold text-blue-900 tracking-tight"
          >
            Hello Doctor
          </motion.h2>
          
          {/* Expanding Line */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeInOut" }}
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-0.5 bg-blue-400 opacity-50"
          />
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="text-blue-600/60 font-medium text-sm tracking-[0.2em] uppercase mt-2"
        >
          Your Health, Our Priority
        </motion.p>
      </div>

      {/* Subtle Background Elements */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
        className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-200 rounded-full blur-[100px] pointer-events-none"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ 
          duration: 5, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-blue-100 rounded-full blur-[120px] pointer-events-none"
      />
    </motion.div>
  );
}
