import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const results = [
  {
    label: "CGPA",
    value: 9.38,
    suffix: " / 10",
    decimals: 2,
    degree: "B.Tech",
    institution: "Lovely Professional University",
    location: "Jalandhar-Delhi G.T. Road, Phagwara, Punjab, India",
    years: "2023 – 2027 (ongoing)",
  },
  {
    label: "Class 12",
    value: 98.1,
    suffix: "%",
    decimals: 1,
    degree: "Higher Secondary",
    institution: "Narayana Junior College",
    location: "MR Palli Rd, Tirupati, Andhra Pradesh, India",
    years: "2021 – 2023",
  },
  {
    label: "Class 10",
    value: 99,
    suffix: "%",
    decimals: 0,
    degree: "Secondary",
    institution: "Narayana Group of Schools",
    location: "Tata Nagar, Tirupati, Andhra Pradesh, India",
    years: "2020 – 2021",
  },
];

const CountUp = ({
  target,
  decimals,
  suffix,
  start,
}: {
  target: number;
  decimals: number;
  suffix: string;
  start: boolean;
}) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!start) return;
    let frame: number;
    const duration = 1500;
    const startTime = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(eased * target);
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [start, target]);

  return (
    <span>
      {current.toFixed(decimals)}
      {suffix}
    </span>
  );
};

const AcademicResultSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-12 px-6" ref={ref}>
      <div className="max-w-2xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-bold mb-8"
        >
          <span className="text-primary mr-2">●</span> Academic Result
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {results.map((r, i) => (
            <motion.div
              key={r.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.4 }}
              className="group relative rounded-lg border border-border bg-card overflow-hidden hover:border-primary/40 hover:shadow-[0_0_15px_hsl(var(--primary)/0.1)] transition-all duration-300"
              style={{ minHeight: "120px" }}
            >
              {/* Front face – score */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 transition-all duration-300 group-hover:opacity-0 group-hover:translate-y-2">
                <p className="text-xs font-mono text-muted-foreground mb-2 tracking-wider uppercase">
                  {r.label}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  <CountUp
                    target={r.value}
                    decimals={r.decimals}
                    suffix={r.suffix}
                    start={inView}
                  />
                </p>
              </div>

              {/* Back face – details */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                <p className="text-xs font-mono text-primary mb-1 tracking-wider uppercase">
                  {r.degree}
                </p>
                <p className="text-sm font-semibold text-foreground leading-tight">
                  {r.institution}
                </p>
                <p className="text-xs text-muted-foreground mt-1 leading-tight">
                  {r.location}
                </p>
                <p className="text-xs font-mono text-muted-foreground mt-2">
                  {r.years}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AcademicResultSection;
