import { useState } from "react";
import { Github, Linkedin, TerminalSquare, FileText, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TerminalModal from "./TerminalModal";
import CVModal from "./CVModal";
import SiLeetcode from "./icons/SiLeetcode";
import SiKaggle from "./icons/SiKaggle";
import { useIsMobile } from "@/hooks/use-mobile";

// ─── Brand colors per icon ───
const socials = [
  { icon: Github, label: "GitHub", href: "https://github.com/murthy0x05", custom: false, brandColor: "#e5e2e1" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/murthy0x05", custom: false, brandColor: "#0a66c2" },
  { label: "LeetCode", href: "https://leetcode.com/u/murthy0x05", custom: true, CustomIcon: SiLeetcode, brandColor: "#ffa116" },
  { label: "Kaggle", href: "https://kaggle.com/murthy0x05", custom: true, CustomIcon: SiKaggle, brandColor: "#20beff" },
];

const ICON_SIZE = 18;

const FloatingBar = () => {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [cvModalOpen, setCvModalOpen] = useState(false);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const isMobile = useIsMobile();

  // Build the item list with stable keys
  const items = [
    ...socials.map((s) => ({ type: "social" as const, key: s.label, ...s })),
    { type: "cv" as const, key: "Resume", brandColor: "#22c55e" },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="fixed bottom-6 left-0 right-0 mx-auto w-fit z-50"
      >
        {/* Outer glow — animated border */}
        <div className="relative p-[1px] rounded-2xl" style={{ overflow: "hidden" }}>
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background:
                "conic-gradient(from var(--border-angle, 0deg), transparent 40%, rgba(34,197,94,0.3) 50%, rgba(34,197,94,0.1) 60%, transparent 70%)",
              animation: "rotateBorder 5s linear infinite",
            }}
          />

          {/* ─── Bar body ─── */}
          <div
            className="relative rounded-[15px] px-2 py-1.5 flex items-center gap-0.5"
            style={{
              background: "rgba(14, 14, 14, 0.75)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.45), inset 0 0.5px 0 rgba(255,255,255,0.04), 0 0 40px rgba(34,197,94,0.03)",
            }}
            onMouseLeave={() => setHoveredKey(null)}
          >
            {/* ─── Icon items ─── */}
            {items.map((item) => {
              const isHovered = hoveredKey === item.key;
              const brand = item.brandColor;
              const glowRgb = hexToRgb(brand);

              if (item.type === "social") {
                return (
                  <a
                    key={item.key}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"

                    className="relative flex items-center justify-center rounded-lg transition-all duration-200"
                    style={{
                      width: 40,
                      height: 40,
                      color: isHovered ? brand : "rgba(255,255,255,0.4)",
                      background: isHovered ? `rgba(${glowRgb},0.1)` : "transparent",
                      boxShadow: isHovered ? `0 0 14px rgba(${glowRgb},0.15), inset 0 0 8px rgba(${glowRgb},0.06)` : "none",
                    }}
                    onMouseEnter={() => setHoveredKey(item.key)}
                  >
                    {item.custom ? (
                      <item.CustomIcon size={ICON_SIZE} />
                    ) : (
                      <item.icon size={ICON_SIZE} />
                    )}

                    {/* Tooltip */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.span
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          transition={{ duration: 0.12 }}
                          className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md text-[10px] font-medium whitespace-nowrap pointer-events-none"
                          style={{
                            background: "rgba(14,14,14,0.9)",
                            color: "rgba(229,226,225,0.85)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            backdropFilter: "blur(8px)",
                          }}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </a>
                );
              }

              // CV / Resume button
              return (
                <button
                  key={item.key}
                  onClick={() => setCvModalOpen(true)}
                  data-cursor="interactive"
                  className="relative flex items-center justify-center rounded-lg transition-all duration-200"
                  style={{
                    width: 40,
                    height: 40,
                    color: isHovered ? brand : "rgba(255,255,255,0.4)",
                    background: isHovered ? `rgba(${glowRgb},0.1)` : "transparent",
                    boxShadow: isHovered ? `0 0 14px rgba(${glowRgb},0.15), inset 0 0 8px rgba(${glowRgb},0.06)` : "none",
                  }}
                  onMouseEnter={() => setHoveredKey(item.key)}
                >
                  <FileText size={ICON_SIZE} />
                  <AnimatePresence>
                    {isHovered && (
                      <motion.span
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.12 }}
                        className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md text-[10px] font-medium whitespace-nowrap pointer-events-none"
                        style={{
                          background: "rgba(14,14,14,0.9)",
                          color: "rgba(229,226,225,0.85)",
                          border: "1px solid rgba(255,255,255,0.06)",
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        Resume
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}

            {/* ─── Divider ─── */}
            <div
              className="mx-1 self-center"
              style={{
                width: 1,
                height: 20,
                background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.08), transparent)",
              }}
            />

            {/* ─── Terminal ─── */}
            <button
              onClick={() => setTerminalOpen(true)}
              data-cursor="interactive"
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-lg font-mono text-xs transition-all duration-200"
              style={{
                color: "#4be277",
                background: hoveredKey === "terminal" ? "rgba(34,197,94,0.12)" : "rgba(34,197,94,0.05)",
                border: hoveredKey === "terminal" ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(34,197,94,0.1)",
                boxShadow: hoveredKey === "terminal" ? "0 0 16px rgba(34,197,94,0.1)" : "none",
              }}
              onMouseEnter={() => setHoveredKey("terminal")}
            >
              <TerminalSquare size={16} />
              <span className="hidden sm:inline">Terminal</span>
              {/* Pulsing status dot */}
              <span className="relative flex h-1.5 w-1.5">
                <span
                  className="absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{
                    background: "#22c55e",
                    animation: "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
                  }}
                />
                <span
                  className="relative inline-flex rounded-full h-1.5 w-1.5"
                  style={{ background: "#22c55e" }}
                />
              </span>
            </button>

            {/* AI Assistant – mobile only */}
            {isMobile && (
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("toggle-ai-assistant"))}
                title="AI Assistant"
                className="flex items-center justify-center rounded-lg transition-colors"
                style={{ width: 40, height: 40, color: "rgba(255,255,255,0.4)" }}
              >
                <Sparkles size={ICON_SIZE} />
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <TerminalModal isOpen={terminalOpen} onClose={() => setTerminalOpen(false)} />
      <CVModal isOpen={cvModalOpen} onClose={() => setCvModalOpen(false)} />
    </>
  );
};

// ─── Utility: hex → "r,g,b" string for rgba() ───
function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

export default FloatingBar;
