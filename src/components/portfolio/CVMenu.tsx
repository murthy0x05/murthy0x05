import { motion, AnimatePresence } from "framer-motion";
import { Eye } from "lucide-react";

interface CVMenuProps {
  isOpen: boolean;
  onView: () => void;
  onClose: () => void;
}

const CVMenu = ({ isOpen, onView, onClose }: CVMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 min-w-[160px] rounded-xl bg-card border border-border shadow-lg overflow-hidden"
          style={{ boxShadow: "0 0 20px 4px hsl(142 70% 45% / 0.1)" }}
        >
          <button
            onClick={() => { onView(); onClose(); }}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-foreground/80 hover:text-primary hover:bg-primary/10 transition-colors"
          >
            <Eye size={16} />
            View CV
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CVMenu;
