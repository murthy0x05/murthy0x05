import { Minimize2, Maximize2 } from "lucide-react";

interface CVWindowHeaderProps {
  isFullscreen: boolean;
  onClose: () => void;
  onToggleFullscreen: () => void;
}

const CVWindowHeader = ({ isFullscreen, onClose, onToggleFullscreen }: CVWindowHeaderProps) => {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 shrink-0 select-none"
      style={{
        background: "hsl(var(--muted) / 0.6)",
        borderBottom: "1px solid hsl(var(--border))",
      }}
    >
      {/* Traffic lights */}
      <div className="flex items-center gap-2">
        <button
          onClick={onClose}
          className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-110 transition-all group relative"
          title="Close"
        >
          <span className="absolute inset-0 flex items-center justify-center text-[8px] text-black/60 opacity-0 group-hover:opacity-100 font-bold">
            ✕
          </span>
        </button>
        <button
          onClick={onClose}
          className="w-3 h-3 rounded-full bg-[#febc2e] hover:brightness-110 transition-all group relative"
          title="Minimize"
        >
          <span className="absolute inset-0 flex items-center justify-center text-[8px] text-black/60 opacity-0 group-hover:opacity-100 font-bold">
            −
          </span>
        </button>
        <button
          onClick={onToggleFullscreen}
          className="w-3 h-3 rounded-full bg-[#28c840] hover:brightness-110 transition-all group relative"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          <span className="absolute inset-0 flex items-center justify-center text-[7px] text-black/60 opacity-0 group-hover:opacity-100 font-bold">
            ⤢
          </span>
        </button>
      </div>

      {/* Title */}
      <span className="text-sm font-medium text-foreground/70 tracking-wide">
        CV Preview
      </span>

      {/* Fullscreen toggle */}
      <button
        onClick={onToggleFullscreen}
        className="p-1.5 rounded-md text-foreground/40 hover:text-foreground/80 hover:bg-foreground/10 transition-colors"
        title={isFullscreen ? "Restore" : "Maximize"}
      >
        {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
      </button>
    </div>
  );
};

export { CVWindowHeader };
