import { motion } from "framer-motion";
import { Download, Share2 } from "lucide-react";

const CV_OPTIONS = [
  { key: "general", label: "Generalized", file: "/cv-general.pdf", downloadName: "PavanKumar_General_CV.pdf" },
  { key: "aiml", label: "AIML Specialized", file: "/cv-aiml.pdf", downloadName: "PavanKumar_AIML_CV.pdf" },
  {
    key: "android",
    label: "Android Developer",
    file: "/cv-android.pdf",
    downloadName: "PavanKumar_Android_Development_CV.pdf",
  },
] as const;

export type CVKey = (typeof CV_OPTIONS)[number]["key"];

interface CVTabsProps {
  active: CVKey;
  onChange: (key: CVKey) => void;
}

const CVTabs = ({ active, onChange }: CVTabsProps) => {
  const handleShare = async (option: (typeof CV_OPTIONS)[number]) => {
    const url = window.location.origin + option.file;
    if (navigator.share) {
      try {
        await navigator.share({ title: `Pavan Kumar - ${option.label} CV`, url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  return (
    <div
      className="shrink-0 px-4 py-3 flex flex-col gap-1.5"
      style={{ borderBottom: "1px solid hsl(var(--border))" }}
    >
      <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">Select Resume Version</span>
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {CV_OPTIONS.map((option) => {
          const isActive = active === option.key;
          return (
            <div
              key={option.key}
              className={`relative flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-colors whitespace-nowrap ${
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground/80"
              }`}
              style={{
                background: isActive ? "hsl(var(--muted))" : "hsl(var(--muted) / 0.5)",
                border: `1px solid hsl(var(--border) / ${isActive ? "1" : "0.6"})`,
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="cv-tab-active"
                  className="absolute inset-0 rounded-lg"
                  style={{ background: "hsl(var(--primary) / 0.08)", border: "1px solid hsl(var(--primary) / 0.2)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <button onClick={() => onChange(option.key)} className="relative z-10 text-sm font-medium">
                {option.label}
              </button>
              <div
                className="relative z-10 flex items-center gap-1 ml-1"
                style={{ borderLeft: "1px solid hsl(var(--border))", paddingLeft: "8px" }}
              >
                <a
                  href={option.file}
                  download={option.downloadName}
                  onClick={(e) => e.stopPropagation()}
                  className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title={`Download ${option.label} CV`}
                >
                  <Download size={13} />
                </a>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare(option);
                  }}
                  className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title={`Share ${option.label} CV`}
                >
                  <Share2 size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { CV_OPTIONS };
export default CVTabs;
