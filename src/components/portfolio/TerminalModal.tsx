import { useState, useRef, useEffect, useCallback, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import COMMANDS, { COMMAND_LIST, TERMINAL_PROMPT, WELCOME_LINES, type TerminalLine, type PlatformIconKey } from "./TerminalCommands";
import SiLeetcode from "./icons/SiLeetcode";
import SiCodechef from "./icons/SiCodechef";
import SiGeeksforgeeks from "./icons/SiGeeksforgeeks";
import SiGithub from "./icons/SiGithub";
import SiCodingninjas from "./icons/SiCodingninjas";
import SiGmail from "./icons/SiGmail";
import SiPhone from "./icons/SiPhone";
import SiGlobe from "./icons/SiGlobe";
import SiX from "./icons/SiX";

const PLATFORM_ICONS: Record<PlatformIconKey, React.FC<{ size?: number; className?: string }>> = {
  leetcode: SiLeetcode,
  codechef: SiCodechef,
  geeksforgeeks: SiGeeksforgeeks,
  github: SiGithub,
  codingninjas: SiCodingninjas,
  gmail: SiGmail,
  phone: SiPhone,
  globe: SiGlobe,
  x: SiX,
};

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TerminalModal = ({ isOpen, onClose }: TerminalModalProps) => {
  const [lines, setLines] = useState<TerminalLine[]>(WELCOME_LINES);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const addOutput = useCallback((newLines: TerminalLine[]) => {
    setLines((prev) => [...prev, ...newLines]);
  }, []);

  const executeCommand = useCallback(
    (cmd: string) => {
      const trimmed = cmd.trim().toLowerCase();
      setLines((prev) => [...prev, { type: "input", content: `${TERMINAL_PROMPT} ${cmd}` }]);

      if (!trimmed) return;

      setHistory((prev) => [...prev, trimmed]);
      setHistoryIdx(-1);

      if (trimmed === "clear") {
        setLines([]);
        return;
      }
      if (trimmed === "exit") {
        onClose();
        return;
      }

      const handler = COMMANDS[trimmed];
      if (handler) {
        handler(addOutput);
      } else {
        addOutput([
          { type: "output", content: "" },
          { type: "output", content: `  bash: ${trimmed}: command not found` },
          { type: "output", content: '  Type "help" for available commands.' },
          { type: "output", content: "" },
        ]);
      }
    },
    [addOutput, onClose]
  );

  // Tab completion
  const handleTab = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const current = input.trim().toLowerCase();
        if (!current) return;
        const matches = COMMAND_LIST.filter((cmd) => cmd.startsWith(current));
        if (matches.length === 1) {
          setInput(matches[0]);
        } else if (matches.length > 1) {
          addOutput([
            { type: "input", content: `${TERMINAL_PROMPT} ${input}` },
            { type: "output", content: `  ${matches.join("  ")}` },
            { type: "output", content: "" },
          ]);
        }
      }
    },
    [input, addOutput]
  );

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    handleTab(e);
    if (e.key === "Enter") {
      executeCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const newIdx = historyIdx < history.length - 1 ? historyIdx + 1 : historyIdx;
        setHistoryIdx(newIdx);
        setInput(history[history.length - 1 - newIdx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx > 0) {
        const newIdx = historyIdx - 1;
        setHistoryIdx(newIdx);
        setInput(history[history.length - 1 - newIdx]);
      } else {
        setHistoryIdx(-1);
        setInput("");
      }
    }
  };

  const renderLine = (line: TerminalLine, i: number) => {
    switch (line.type) {
      case "input":
        return <span className="text-terminal-prompt font-bold">{line.content}</span>;
      case "header":
        return <span className="text-terminal-accent font-bold">{line.content}</span>;
      case "link":
        return (
          <span className="whitespace-pre">
            {line.prefix && (
              <span className="text-terminal-text">{line.prefix}</span>
            )}
            <a
              href={line.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-terminal-link hover:text-terminal-link-hover underline underline-offset-2 decoration-terminal-link/30 hover:decoration-terminal-link-hover/60 transition-colors"
            >
              {line.content}
            </a>
          </span>
        );
      case "icon-line": {
        const IconComponent = line.iconKey ? PLATFORM_ICONS[line.iconKey] : null;
        // Split content to get the prefix (e.g., "  │  ") and the name
        const parts = line.content.split(/(?<=│\s\s)/);
        const prefix = parts.length > 1 ? parts[0] : "  │  ";
        const name = parts.length > 1 ? parts.slice(1).join("") : line.content;
        const nameElement = line.url ? (
          <a
            href={line.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold hover:underline underline-offset-2 cursor-pointer transition-opacity hover:opacity-80"
            style={{ color: line.iconColor }}
          >
            {name}
          </a>
        ) : (
          <span className="font-bold" style={{ color: line.iconColor }}>{name}</span>
        );
        return (
          <span className="text-terminal-text inline-flex items-center">
            <span className="whitespace-pre">{prefix}</span>
            {IconComponent && (
              <span className="inline-flex items-center mr-1.5" style={{ color: line.iconColor }}>
                <IconComponent size={14} />
              </span>
            )}
            {nameElement}
          </span>
        );
      }
      default:
        return <span className="text-terminal-text">{line.content}</span>;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(0, 0, 0, 0.80)", backdropFilter: "blur(8px)" }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="w-full max-w-5xl max-h-[85vh] flex flex-col md:flex-row overflow-hidden"
            style={{
              background: "#0e0e0e",
              border: "1px solid rgba(34, 197, 94, 0.15)",
              boxShadow:
                "0 0 80px 15px rgba(34, 197, 94, 0.06), 0 24px 48px rgba(0, 0, 0, 0.5)",
              borderRadius: "0px",
            }}
          >
            {/* Terminal Main */}
            <div className="flex-1 flex flex-col min-h-0">
              {/* Header - macOS style traffic lights */}
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{
                  background: "#1a1919",
                  borderBottom: "1px solid rgba(34, 197, 94, 0.1)",
                }}
              >
                <div className="flex items-center gap-3">
                  {/* Traffic lights */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={onClose}
                      className="w-3 h-3 rounded-full transition-opacity hover:opacity-80"
                      style={{ background: "#ff5f57" }}
                      title="Close"
                    />
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ background: "#febc2e" }}
                    />
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ background: "#28c840" }}
                    />
                  </div>
                  <span
                    className="font-mono text-xs font-semibold tracking-wider uppercase"
                    style={{ color: "#22c55e" }}
                  >
                    {">"}_portfolio terminal
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-sm transition-colors"
                  style={{
                    color: "#777575",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#777575")}
                >
                  <X size={14} />
                </button>
              </div>

              {/* Terminal Body */}
              <div
                className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-0.5 min-h-[320px] md:min-h-[440px] terminal-scrollbar"
                style={{ background: "#0e0e0e" }}
                onClick={() => inputRef.current?.focus()}
              >
                {lines.map((line, i) => (
                  <div key={i} className="leading-relaxed whitespace-pre" style={{ minHeight: "1.25rem" }}>
                    {renderLine(line, i)}
                  </div>
                ))}

                {/* Input line */}
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-terminal-prompt font-bold whitespace-nowrap">
                    {TERMINAL_PROMPT}
                  </span>
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    className="flex-1 bg-transparent outline-none font-mono text-sm caret-terminal-accent"
                    style={{ color: "#e2e2e2" }}
                    spellCheck={false}
                    autoComplete="off"
                  />
                  <span className="animate-pulse text-terminal-accent">▊</span>
                </div>
                <div ref={bottomRef} />
              </div>
            </div>

            {/* Command sidebar */}
            <div
              className="w-full max-h-32 md:max-h-none md:w-48 shrink-0 md:shrink md:min-h-0 flex flex-row flex-wrap md:flex-col md:flex-nowrap gap-1 p-3 pb-4 overflow-y-auto terminal-scrollbar"
              style={{
                background: "#131313",
                borderLeft: "1px solid rgba(34, 197, 94, 0.08)",
                borderTop: "1px solid rgba(34, 197, 94, 0.08)",
              }}
            >
              <span
                className="text-[10px] uppercase tracking-[0.2em] mb-2 w-full font-mono font-semibold"
                style={{ color: "#22c55e" }}
              >
                ▸ Commands
              </span>
              {COMMAND_LIST.map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => {
                    executeCommand(cmd);
                    setInput("");
                    inputRef.current?.focus();
                  }}
                  className="terminal-cmd-btn px-3 py-1.5 text-xs font-mono text-left transition-all"
                  style={{
                    color: "rgba(34, 197, 94, 0.7)",
                    background: "transparent",
                    border: "1px solid rgba(73, 72, 71, 0.2)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#22c55e";
                    e.currentTarget.style.background = "rgba(34, 197, 94, 0.06)";
                    e.currentTarget.style.borderColor = "rgba(34, 197, 94, 0.25)";
                    e.currentTarget.style.boxShadow = "0 0 12px rgba(34, 197, 94, 0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(34, 197, 94, 0.7)";
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor = "rgba(73, 72, 71, 0.2)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {cmd}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TerminalModal;
