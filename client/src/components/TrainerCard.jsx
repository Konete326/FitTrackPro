import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FiCheck, FiSend, FiClock, FiTrash2, FiTarget, FiBriefcase } from 'react-icons/fi';

function TrainerCard({
  trainer,
  isAssigned,
  requestStatus,
  onSendRequest,
  onViewProfile,
  onRemove,
}) {
  const shouldReduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const shouldAnimate = !shouldReduceMotion;

  const name = trainer.Profile?.Name || trainer.Username || 'Trainer';
  const bio = trainer.Profile?.Bio || (trainer.Profile?.Specialties?.length > 0 ? trainer.Profile.Specialties.slice(0, 2).join(', ') : 'Professional fitness trainer');
  const image = trainer.Profile?.ProfilePicture || null;
  const experience = trainer.Profile?.Experience || 0;
  const workouts = trainer.Stats?.TotalWorkouts || 0;
  const specialties = trainer.Profile?.Specialties || [];

  const containerVariants = {
    rest: { scale: 1, y: 0 },
    hover: shouldAnimate ? {
      scale: 1.02,
      y: -4,
      transition: { type: 'spring', stiffness: 400, damping: 28, mass: 0.6 },
    } : {},
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 400, damping: 28, mass: 0.6, staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 25, mass: 0.5 } },
  };

  const renderAction = () => {
    if (isAssigned) {
      return (
        <div className="space-y-2">
          <div className="w-full py-2.5 px-4 rounded-2xl font-semibold text-sm text-center bg-green-500/15 text-green-600 dark:text-green-400 border border-green-500/20 flex items-center justify-center gap-2">
            <FiCheck className="w-3.5 h-3.5" /> Your Trainer
          </div>
          <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="w-full text-xs text-red-500 hover:text-red-600 flex items-center justify-center gap-1 py-1 transition">
            <FiTrash2 className="w-3 h-3" /> Remove trainer
          </button>
        </div>
      );
    }
    if (requestStatus === 'Pending') {
      return (
        <div className="w-full py-2.5 px-4 rounded-2xl font-semibold text-sm text-center bg-gray-500/10 text-gray-500 dark:text-gray-400 border border-gray-500/10 flex items-center justify-center gap-2">
          <FiClock className="w-3.5 h-3.5" /> Request Pending
        </div>
      );
    }
    if (requestStatus === 'Approved') {
      return (
        <div className="w-full py-2.5 px-4 rounded-2xl font-semibold text-sm text-center bg-green-500/15 text-green-600 dark:text-green-400 border border-green-500/20 flex items-center justify-center gap-2">
          <FiCheck className="w-3.5 h-3.5" /> Approved
        </div>
      );
    }
    if (requestStatus === 'Rejected') {
      return (
        <motion.button
          whileHover={shouldAnimate ? { scale: 1.02 } : {}}
          whileTap={shouldAnimate ? { scale: 0.98 } : {}}
          onClick={(e) => { e.stopPropagation(); onSendRequest(); }}
          className="w-full py-2.5 px-4 rounded-2xl font-semibold text-sm border border-gray-200 dark:border-gray-700/60 shadow-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
        >
          <FiSend className="w-3.5 h-3.5" /> Re-send Request
        </motion.button>
      );
    }
    return (
      <motion.button
        whileHover={shouldAnimate ? { scale: 1.02 } : {}}
        whileTap={shouldAnimate ? { scale: 0.98 } : {}}
        onClick={(e) => { e.stopPropagation(); onSendRequest(); }}
        className="w-full py-2.5 px-4 rounded-2xl font-semibold text-sm bg-violet-600 text-white hover:bg-violet-700 transition-all shadow-sm flex items-center justify-center gap-2"
      >
        <FiSend className="w-3.5 h-3.5" /> Send Request
      </motion.button>
    );
  };

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial="rest"
      whileHover="hover"
      variants={containerVariants}
      onClick={onViewProfile}
      className="relative w-full h-80 rounded-3xl border border-gray-200/50 dark:border-gray-700/30 text-gray-900 dark:text-gray-100 overflow-hidden shadow-lg shadow-black/5 dark:shadow-black/20 cursor-pointer group"
    >
      {image ? (
        <motion.img
          src={image}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover"
          animate={shouldAnimate && hovered ? { scale: 1.05 } : { scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-purple-500/10 to-indigo-500/20 dark:from-violet-900/30 dark:via-purple-900/20 dark:to-indigo-900/30" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/50 via-white/20 to-transparent dark:from-gray-900/95 dark:via-gray-900/50 dark:via-gray-900/20" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white/90 via-white/50 to-transparent dark:from-gray-900/90 dark:via-gray-900/50 backdrop-blur-[1px]" />

      <motion.div
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        className="absolute bottom-0 left-0 right-0 p-5 space-y-3"
      >
        <motion.div variants={itemVariants} className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">{name}</h2>
          {trainer.Profile?.Specialties?.length > 0 && (
            <span className="shrink-0 w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center">
              <FiCheck className="w-2.5 h-2.5" />
            </span>
          )}
        </motion.div>

        <motion.p variants={itemVariants} className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-2">
          {bio}
        </motion.p>

        <motion.div variants={itemVariants} className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          {workouts > 0 && (
            <div className="flex items-center gap-1.5">
              <FiTarget className="w-3.5 h-3.5" />
              <span className="font-semibold text-gray-700 dark:text-gray-300">{workouts}</span>
              <span>workouts</span>
            </div>
          )}
          {experience > 0 && (
            <div className="flex items-center gap-1.5">
              <FiBriefcase className="w-3.5 h-3.5" />
              <span className="font-semibold text-gray-700 dark:text-gray-300">{experience}</span>
              <span>yrs exp</span>
            </div>
          )}
        </motion.div>

        {specialties.length > 0 && (
          <motion.div variants={itemVariants} className="flex flex-wrap gap-1">
            {specialties.slice(0, 2).map((s) => (
              <span key={s} className="text-xs bg-violet-500/10 text-violet-600 dark:text-violet-400 px-2 py-0.5 rounded-full">{s}</span>
            ))}
          </motion.div>
        )}

        <motion.div variants={itemVariants} onClick={(e) => e.stopPropagation()}>
          {renderAction()}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default TrainerCard;
