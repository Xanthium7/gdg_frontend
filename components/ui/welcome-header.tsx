"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle, Landmark, Headphones } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function WelcomeHeader() {
  const [showHelp, setShowHelp] = useState(false);

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const bubbleVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 50,
        delay: 0.4,
      },
    },
  };

  // Floating animation for background elements
  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut",
    },
  };

  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <Card className="mb-4 sm:mb-6 teal-gradient text-white border-none shadow-xl rounded-3xl overflow-hidden">
        <CardContent className="p-4 sm:p-6 relative">
          {/* Decorative floating elements */}
          <motion.div
            className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-teal-light/10 rounded-full -mt-12 -mr-12 sm:-mt-16 sm:-mr-16"
            animate={floatingAnimation}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-20 sm:w-24 h-20 sm:h-24 bg-teal-light/10 rounded-full -mb-10 -ml-10 sm:-mb-12 sm:-ml-12"
            animate={{
              ...floatingAnimation,
              transition: {
                ...floatingAnimation.transition,
                delay: 1.5,
              },
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/4 w-16 h-16 bg-teal-light/5 rounded-full -translate-y-1/2"
            animate={{
              ...floatingAnimation,
              transition: {
                ...floatingAnimation.transition,
                delay: 0.8,
              },
            }}
          />

          {/* Content */}
          <div className="flex flex-col sm:flex-row items-center sm:justify-between relative z-10">
            <motion.div
              className="flex items-center gap-3 sm:gap-4"
              variants={itemVariants}
            >
              <motion.div
                className="rounded-full bg-white/20 p-3 sm:p-4 shadow-inner"
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Landmark size={28} className="text-white" />
              </motion.div>
              <div>
                <motion.h1
                  className="text-2xl sm:text-3xl md:text-4xl font-bold"
                  variants={itemVariants}
                >
                  കേരള സർക്കാർ സഹായി
                </motion.h1>
                <motion.p
                  className="text-white/90 text-base sm:text-lg md:text-xl mt-1 font-ml-ttrevathi"
                  variants={itemVariants}
                >
                  സർക്കാർ സേവനങ്ങൾക്കുള്ള താങ്കളുടെ സ്നേഹ സഹായി
                </motion.p>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center gap-2 mt-4 sm:mt-0"
              variants={itemVariants}
            >
              <motion.button
                className="bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors"
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                onClick={toggleHelp}
                aria-label="Show help"
              >
                <HelpCircle size={20} className="text-white" />
              </motion.button>
              <motion.button
                className="bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors"
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                aria-label="Contact support"
              >
                <Headphones size={20} className="text-white" />
              </motion.button>
            </motion.div>
          </div>

          {/* Help info section */}
          <motion.div
            className={`mt-3 sm:mt-4 bg-white/10 p-3 sm:p-4 rounded-xl backdrop-blur-sm ${
              !showHelp && "h-0 p-0 mt-0 overflow-hidden"
            }`}
            animate={showHelp ? "visible" : "hidden"}
            variants={bubbleVariants}
            initial={false}
          >
            <div className="flex items-start sm:items-center gap-2 sm:gap-3">
              <HelpCircle className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 mt-1 sm:mt-0" />
              <div>
                <p className="text-sm sm:text-base font-ml-ttrevathi">
                  സർക്കാർ സേവനങ്ങൾ, രേഖകൾ, ആനുകൂല്യങ്ങൾ എന്നിവയെക്കുറിച്ചുള്ള
                  നിങ്ങളുടെ ചോദ്യങ്ങൾക്ക് സഹായിക്കാൻ എനിക്ക് കഴിയും.
                </p>
                <p className="text-xs sm:text-sm text-white/75 mt-1">
                  Ask me about documents, applications, benefits, or any
                  government service you need help with.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Always visible info section */}
          <motion.div
            className="mt-3 sm:mt-4 bg-white/10 p-3 sm:p-4 rounded-xl backdrop-blur-sm"
            variants={bubbleVariants}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          >
            <div className="flex items-start sm:items-center gap-2 sm:gap-3">
              <HelpCircle className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 mt-1 sm:mt-0" />
              <div>
                <p className="text-sm sm:text-base font-ml-ttrevathi">
                  എന്റെ സഹായത്തിന് ചുവടെയുള്ള ടെക്സ്റ്റ് ഫീൽഡിൽ സർക്കാർ
                  സേവനങ്ങളെക്കുറിച്ചുള്ള നിങ്ങളുടെ ചോദ്യങ്ങൾ ചോദിക്കുക.
                </p>
                <p className="text-xs sm:text-sm text-white/75 mt-1">
                  Type your government service questions in the text field below
                  to get assistance.
                </p>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
