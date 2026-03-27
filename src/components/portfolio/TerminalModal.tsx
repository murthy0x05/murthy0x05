import { useState, useRef, useEffect, useCallback, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import COMMANDS, { COMMAND_LIST, type TerminalLine } from "./TerminalCommands";

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TerminalModal = ({ isOpen, onClose }: TerminalModalProps) => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "output", content: '  Type "help" to see available commands.' },
    { type: "output", content: "" },
  ]);
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
      setLines((prev) => [...prev, { type: "input", content: `~$ ${cmd}` }]);

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
          { type: "output", content: `  Command not found: ${trimmed}` },
          { type: "output", content: '  Type "help" for available commands.' },
          { type: "output", content: "" },
        ]);
      }
    },
    [addOutput, onClose]
  );

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-4xl max-h-[80vh] flex flex-col md:flex-row rounded-xl border border-primary/40 overflow-hidden bg-card"
            style={{
              boxShadow: "0 0 60px 10px hsl(142 70% 45% / 0.1)",
            }}
          >
            {/* Terminal */}
            <div className="flex-1 flex flex-col min-h-0">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-primary/20 bg-secondary/50">
                <div className="flex items-center gap-2">
                  <span className="text-primary font-mono text-sm font-semibold">
                    {">"}_Portfolio Terminal
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div
                className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-0.5 min-h-[300px] md:min-h-[400px]"
                onClick={() => inputRef.current?.focus()}
              >
                {lines.map((line, i) => (
                  <div key={i}>
                    {line.type === "input" ? (
                      <span className="text-primary">{line.content}</span>
                    ) : line.type === "link" ? (
                      <a
                        href={line.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline"
                      >
                        {line.content}
                      </a>
                    ) : (
                      <span className="text-primary/80">{line.content}</span>
                    )}
                  </div>
                ))}

                {/* Input line */}
                <div className="flex items-center gap-1 text-primary">
                  <span>~$</span>
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    className="flex-1 bg-transparent outline-none font-mono text-sm text-primary caret-primary"
                    spellCheck={false}
                    autoComplete="off"
                  />
                  <span className="animate-pulse">▊</span>
                </div>
                <div ref={bottomRef} />
              </div>
            </div>

            {/* Command buttons panel */}
            <div className="w-full md:w-44 border-t md:border-t-0 md:border-l border-primary/20 bg-secondary/30 p-3 flex flex-row md:flex-col flex-wrap gap-1.5 overflow-y-auto">
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 w-full">
                Commands
              </span>
              {COMMAND_LIST.map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => {
                    executeCommand(cmd);
                    setInput("");
                    inputRef.current?.focus();
                  }}
                  className="px-3 py-1.5 rounded-md text-xs font-mono text-primary/80 hover:text-primary bg-secondary/60 hover:bg-primary/10 border border-border hover:border-primary/30 transition-all text-left"
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
