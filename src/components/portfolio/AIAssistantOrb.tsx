import { motion } from "framer-motion";
type OrbState = "idle" | "listening" | "processing" | "speaking";
interface AIAssistantOrbProps {
  state: OrbState;
  onClick: () => void;
}
const stateStyles: Record<OrbState, { scale: number[]; opacity: number[]; duration: number }> = {
  idle: { scale: [1, 1.05, 1], opacity: [0.6, 0.9, 0.6], duration: 3 },
  listening: { scale: [1, 1.12, 1], opacity: [0.8, 1, 0.8], duration: 6.5 },
  processing: { scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7], duration: 0.8 },
  speaking: { scale: [1, 1.1, 0.95, 1.1, 1], opacity: [0.8, 1, 0.85, 1, 0.8], duration: 1.5 },
};
const AIAssistantOrb = ({ state, onClick }: AIAssistantOrbProps) => {
  const s = stateStyles[state];
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 cursor-pointer focus:outline-none overflow-visible hidden md:block"
      style={{ width: 64, height: 64 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label="AI Assistant"
    >
      {/* Outer glow */}
      <motion.div
        className="absolute -inset-6 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-green-400 blur-xl"
        animate={{ scale: s.scale, opacity: s.opacity }}
        transition={{ repeat: Infinity, duration: s.duration, ease: "easeInOut" }}
      />
      {/* Inner orb */}
      <motion.div
        className="relative w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-green-400 shadow-[0_0_40px_rgba(59,130,246,0.6)] flex items-center justify-center overflow-visible"
        animate={state === "processing" ? { rotate: 360 } : { scale: s.scale }}
        transition={
          state === "processing"
            ? { repeat: Infinity, duration: 2, ease: "linear" }
            : { repeat: Infinity, duration: s.duration, ease: "easeInOut" }
        }
      >
        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm" />
      </motion.div>
    </motion.button>
  );
};
export default AIAssistantOrb;
