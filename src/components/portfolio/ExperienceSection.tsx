import { motion } from "framer-motion";
import { Github, Linkedin, Star, Download, GitFork, Users, Rocket, Brain, Database, Zap, Code } from "lucide-react";

const experiences = [
  {
    date: "March 2026 - Present",
    role: "AI/ML Engineer (LLM Training)",
    company: "Soul AI",
    socialLinks: [
      { icon: "𝕏", href: "https://x.com/murthy0x05" },
      { icon: Github, href: "https://github.com/murthy0x05" },
      { icon: Linkedin, href: "https://www.linkedin.com/in/murthy0x05/" },
    ],
    metrics: [
      { icon: Brain, label: "Fine-tuned LLMs" },
      { icon: Database, label: "Processed 50k+ Data Points" },
      { icon: Zap, label: "Improved Model Accuracy" },
      { icon: Code, label: "Built Training Pipelines" },
      { icon: Users, label: "Collaborated with AI Team" },
    ],
    description:
      "Worked on training and fine-tuning large language models using curated datasets. Built and optimized data pipelines, improved model responses, and contributed to enhancing real-world AI applications.",
  },
];

const ExperienceSection = () => {
  return (
    <section id="experience" className="py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-bold mb-8"
        >
          <span className="text-primary mr-2">●</span> Experience
        </motion.h2>

        <div className="relative border-l border-border ml-3">
          {experiences.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="mb-10 ml-8 relative"
            >
              <div className="absolute -left-[2.35rem] top-1.5 w-2.5 h-2.5 rounded-full bg-primary glow-green-sm" />

              {/* Date + social icons row */}
              <div className="flex items-center gap-4 mb-2 flex-wrap">
                <span className="text-sm text-primary">{exp.date}</span>
                <div className="flex gap-1.5">
                  {exp.socialLinks.map((link, li) => (
                    <a
                      key={li}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {typeof link.icon === "string" ? link.icon : <link.icon size={14} />}
                    </a>
                  ))}
                </div>
              </div>

              <h3 className="text-base font-semibold">
                {exp.role} — <span className="text-muted-foreground font-normal">{exp.company}</span>
              </h3>

              {exp.metrics.length > 0 && (
                <div className="flex flex-col gap-1 my-3">
                  {exp.metrics.map((m) => (
                    <span key={m.label} className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                      {typeof m.icon === "string" ? m.icon : <m.icon size={14} className="text-primary" />}
                      {m.label}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-sm text-muted-foreground leading-relaxed">{exp.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
