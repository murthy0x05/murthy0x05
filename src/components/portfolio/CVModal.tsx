import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CVWindowHeader } from "./CVWindowHeader";
import CVViewer from "./CVViewer";

interface CVModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CVModal = ({ isOpen, onClose }: CVModalProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleClose = () => {
    setIsFullscreen(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-4 p-0"
          onClick={handleClose}
          style={{
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          {/* Subtle spotlight glow */}
          <div
            className="absolute pointer-events-none"
            style={{
              width: "600px",
              height: "600px",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "radial-gradient(circle, hsl(142 70% 45% / 0.06) 0%, transparent 70%)",
            }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 24 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className={`relative flex flex-col overflow-hidden ${
              isFullscreen
                ? "w-full h-full rounded-xl"
                : "w-full max-w-4xl h-[85vh] sm:h-[88vh] max-sm:h-full max-sm:max-w-full max-sm:rounded-none rounded-2xl"
            }`}
            style={{
              background: "hsl(var(--card) / 0.85)",
              border: isFullscreen ? "none" : "1px solid hsl(var(--border))",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "0 25px 60px rgba(0,0,0,0.3), 0 0 0 1px hsl(var(--border) / 0.3) inset",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <CVWindowHeader
              isFullscreen={isFullscreen}
              onClose={handleClose}
              onToggleFullscreen={() => setIsFullscreen((v) => !v)}
            />
            <CVViewer />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CVModal;
