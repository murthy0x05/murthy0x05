import { useState, useRef, useCallback } from "react";
import { Github, Linkedin, TerminalSquare, FileText, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import TerminalModal from "./TerminalModal";
import CVModal from "./CVModal";
import SiLeetcode from "./icons/SiLeetcode";
import SiKaggle from "./icons/SiKaggle";
import { useIsMobile } from "@/hooks/use-mobile";

const socials = [
  { icon: Github, label: "GitHub", href: "https://github.com/murthy0x05", custom: false },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/murthy0x05", custom: false },
  { label: "LeetCode", href: "https://leetcode.com/u/murthy0x05", custom: true, CustomIcon: SiLeetcode },
  { label: "Kaggle", href: "https://kaggle.com/murthy0x05", custom: true, CustomIcon: SiKaggle },
];

const DOCK_ICON_SIZE = 20;
const BASE_SCALE = 1;
const HOVER_SCALE = 1.35;
const NEIGHBOR_SCALE = 1.15;

const FloatingBar = () => {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [cvModalOpen, setCvModalOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const isMobile = useIsMobile();

  const getScale = useCallback(
    (index: number) => {
      if (isMobile || hoveredIndex === null) return BASE_SCALE;
      const diff = Math.abs(index - hoveredIndex);
      if (diff === 0) return HOVER_SCALE;
      if (diff === 1) return NEIGHBOR_SCALE;
      return BASE_SCALE;
    },
    [hoveredIndex, isMobile],
  );

  const getTranslateY = useCallback(
    (index: number) => {
      if (isMobile || hoveredIndex === null) return 0;
      const diff = Math.abs(index - hoveredIndex);
      if (diff === 0) return -6;
      if (diff === 1) return -2;
      return 0;
    },
    [hoveredIndex, isMobile],
  );

  // Total items: socials (0-3), CV (4), divider skipped, terminal (5)
  const allItems = [
    ...socials.map((s, i) => ({ type: "social" as const, index: i, ...s })),
    { type: "cv" as const, index: socials.length },
  ];

  const terminalIndex = socials.length + 1;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="fixed bottom-6 left-0 right-0 mx-auto w-fit z-50 gap-1 rounded-2xl px-4 py-2.5 flex-row flex items-center justify-center"
        style={{
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.6), 0 0 25px rgba(0,255,150,0.1)",
        }}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {allItems.map((item) => {
          const scale = getScale(item.index);
          const ty = getTranslateY(item.index);

          if (item.type === "social") {
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                title={item.label}
                className="group relative p-3 rounded-xl text-white/70 hover:text-primary transition-colors"
                style={{
                  transform: `scale(${scale}) translateY(${ty}px)`,
                  transition: "transform 200ms ease-out",
                }}
                onMouseEnter={() => setHoveredIndex(item.index)}
              >
                {item.custom ? <item.CustomIcon size={DOCK_ICON_SIZE} /> : <item.icon size={DOCK_ICON_SIZE} />}
                <span className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-black/80 text-xs text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none backdrop-blur-sm">
                  {item.label}
                </span>
              </a>
            );
          }

          // CV button
          return (
            <button
              key="cv"
              onClick={() => setCvModalOpen(true)}
              title="CV"
              className="group relative p-3 rounded-xl text-white/70 hover:text-primary transition-colors"
              style={{
                transform: `scale(${scale}) translateY(${ty}px)`,
                transition: "transform 200ms ease-out",
              }}
              onMouseEnter={() => setHoveredIndex(item.index)}
            >
              <FileText size={DOCK_ICON_SIZE} />
              <span className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-black/80 text-xs text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none backdrop-blur-sm">
                CV
              </span>
            </button>
          );
        })}

        {/* Divider */}
        <div className="w-px h-6 bg-white/15 mx-1 self-center" />

        {/* Terminal */}
        <button
          onClick={() => setTerminalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/40 transition-all font-mono text-sm"
          style={{
            transform: `scale(${getScale(terminalIndex)}) translateY(${getTranslateY(terminalIndex)}px)`,
            transition: "transform 200ms ease-out",
          }}
          onMouseEnter={() => setHoveredIndex(terminalIndex)}
        >
          <TerminalSquare size={18} />
          <span className="hidden sm:inline">Terminal</span>
        </button>

        {/* AI Assistant – mobile only */}
        {isMobile && (
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("toggle-ai-assistant"))}
            title="AI Assistant"
            className="p-3 rounded-xl text-white/70 hover:text-primary transition-colors"
          >
            <Sparkles size={DOCK_ICON_SIZE} />
          </button>
        )}
      </motion.div>

      <TerminalModal isOpen={terminalOpen} onClose={() => setTerminalOpen(false)} />
      <CVModal isOpen={cvModalOpen} onClose={() => setCvModalOpen(false)} />
    </>
  );
};

export default FloatingBar;
