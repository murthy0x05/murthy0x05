import { useEffect, useRef, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Minimal, refined custom cursor.
 * - Small dot (5px) with a subtle green glow
 * - On interactive elements: dot expands into a soft ring
 * - No particle trails, no grid glow — clean & understated
 * - Desktop only
 */

const DOT_SIZE = 5;
const RING_SIZE = 40;
const LERP = 0.18;

const CursorEffect = () => {
  const isMobile = useIsMobile();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const mouse = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const hovering = useRef<"default" | "interactive">("default");
  const rafId = useRef<number>(0);
  const visible = useRef(false);

  const getHoverType = useCallback((el: HTMLElement | null): "default" | "interactive" => {
    if (!el) return "default";
    const tag = el.tagName.toLowerCase();
    if (["a", "button", "input", "textarea", "select"].includes(tag)) return "interactive";
    if (el.closest("a, button, [role='button'], [data-cursor='interactive']")) return "interactive";
    if (el.getAttribute("data-cursor") === "interactive") return "interactive";
    return "default";
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      if (!visible.current) {
        visible.current = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }

      // Position dot immediately
      dot.style.transform = `translate(${e.clientX - DOT_SIZE / 2}px, ${e.clientY - DOT_SIZE / 2}px)`;

      // Detect hover type
      const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      hovering.current = getHoverType(target);
    };

    const onMouseLeave = () => {
      visible.current = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const animate = () => {
      // Smooth ring follow
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * LERP;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * LERP;

      const isInteractive = hovering.current === "interactive";

      // Ring size & position
      const size = isInteractive ? RING_SIZE : 0;
      ring.style.width = `${size}px`;
      ring.style.height = `${size}px`;
      ring.style.transform = `translate(${ringPos.current.x - size / 2}px, ${ringPos.current.y - size / 2}px)`;
      ring.style.borderColor = isInteractive ? "rgba(34,197,94,0.35)" : "rgba(34,197,94,0)";
      ring.style.background = isInteractive ? "rgba(34,197,94,0.04)" : "transparent";

      // Dot shrinks slightly on interactive hover
      const dotS = isInteractive ? 4 : DOT_SIZE;
      dot.style.width = `${dotS}px`;
      dot.style.height = `${dotS}px`;

      rafId.current = requestAnimationFrame(animate);
    };

    // Global cursor hide
    const style = document.createElement("style");
    style.id = "custom-cursor-style";
    style.textContent = `*, *::before, *::after { cursor: none !important; }`;
    document.head.appendChild(style);

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(rafId.current);
      const el = document.getElementById("custom-cursor-style");
      if (el) el.remove();
    };
  }, [isMobile, getHoverType]);

  if (isMobile) return null;

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          width: DOT_SIZE,
          height: DOT_SIZE,
          borderRadius: "50%",
          background: "#22c55e",
          boxShadow: "0 0 6px rgba(34,197,94,0.4)",
          opacity: 0,
          willChange: "transform",
          transition: "width 0.25s ease, height 0.25s ease, opacity 0.3s ease",
        }}
      />
      {/* Ring — only appears on interactive hover */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          width: 0,
          height: 0,
          borderRadius: "50%",
          border: "1.5px solid rgba(34,197,94,0)",
          background: "transparent",
          opacity: 0,
          willChange: "transform, width, height",
          transition:
            "width 0.35s cubic-bezier(.23,1,.32,1), height 0.35s cubic-bezier(.23,1,.32,1), border-color 0.3s, background 0.3s, opacity 0.3s",
        }}
      />
    </>
  );
};

export default CursorEffect;
