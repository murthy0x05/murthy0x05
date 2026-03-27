import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CVTabs, { CV_OPTIONS, type CVKey } from "./CVTabs";

const CVViewer = () => {
  const [active, setActive] = useState<CVKey>("general");
  const src = CV_OPTIONS.find((o) => o.key === active)!.file;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <CVTabs active={active} onChange={setActive} />
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.iframe
            key={active}
            src={src}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full absolute inset-0"
            title="CV Viewer"
            style={{ background: "rgba(255,255,255,0.03)" }}
          />
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CVViewer;
