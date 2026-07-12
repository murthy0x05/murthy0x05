import { motion } from "framer-motion";
import {
  Github,
  ExternalLink,
  Linkedin,
  Star,
  Users,
  Download,
  Code,
  Database,
  Zap,
  Cpu,
  Network,
  ArrowLeftRight,
  Brain,
  LineChart,
  FileText,
} from "lucide-react";
import { SiDiscord } from "./icons/SiDiscord";
import kafkaIcon from "@/assets/kafka-project-icon.svg";

const projects: {
  name: string;
  icon: string;
  description: string;
  impact: string;
  links: { linkedin?: string; github?: string; demo?: string; discord?: string };
  metrics?: { icon: React.ElementType; label: string }[];
}[] = [
    {
      name: "Yntern",
      icon: "🤖",
      description:
        "Engineered an end-to-end AI agent for automated candidate discovery, matching, and engagement, integrating semantic search and conversational outreach simulations.",
      impact: "Reduces manual screening effort by 38% and generates ranked shortlists, maintaining privacy via a Trusted Execution Environment.",
      links: {
        github: "https://github.com/murthy0x05",
        demo: "https://huggingface.co/murthy0x05",
      },
      metrics: [
        { icon: Code, label: "Python" },
        { icon: Brain, label: "LLMs & LangChain" },
        { icon: Database, label: "Vector DB" },
      ],
    },
    {
      name: "KudosDev",
      icon: "🏆",
      description:
        "Spearheaded a full-stack platform enabling developers to showcase achievements, earn peer recognition, and establish verifiable professional identities.",
      impact: "Facilitates developer engagement and seamless user experiences across a scalable PostgreSQL-backed architecture.",
      links: {
        github: "https://github.com/murthy0x05",
        demo: "https://murthy0x05.me",
      },
      metrics: [
        { icon: Code, label: "React & TypeScript" },
        { icon: Cpu, label: "Node.js" },
        { icon: Database, label: "PostgreSQL" },
      ],
    },
    {
      name: "RichPerson",
      icon: "🎙️",
      description:
        "Designed a voice chatbot pipeline combining STT, Wav2Vec2-based ASR, LLM inference, and TTS for low-latency Hindi conversations.",
      impact: "Reduces phoneme error rate by approx. 18% and maintains ~99.9% availability through a dual-LLM fallback strategy.",
      links: {
        github: "https://github.com/murthy0x05",
        demo: "https://huggingface.co/murthy0x05",
      },
      metrics: [
        { icon: Code, label: "Python" },
        { icon: Brain, label: "Wav2Vec2 & LLM" },
        { icon: Zap, label: "Real-time Inference" },
      ],
    },
    {
      name: "ApacheX",
      icon: kafkaIcon,
      description:
        "Crafted a distributed messaging system inspired by Apache Kafka, supporting producer-consumer communication, topic management, and persistent storage.",
      impact: "Achieved 35–40% higher throughput than a baseline socket-based queue through protocol-level and storage optimizations.",
      links: {
        github: "https://github.com/murthy0x05/apache-kafka-using-kafka-protocol",
        demo: "https://github.com/murthy0x05",
      },
      metrics: [
        { icon: Code, label: "Java LLD" },
        { icon: Network, label: "Distributed Systems" },
        { icon: ArrowLeftRight, label: "TCP Sockets" },
      ],
    },
  ];

const ProjectsSection = () => {
  return (
    <section id="projects" className="py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-bold mb-8"
        >
          <span className="text-primary mr-2">●</span> Projects
        </motion.h2>

        <div className="flex flex-col gap-8">
          {projects.map((project, i) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="border-b border-border pb-8 last:border-b-0"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  {project.icon.startsWith("/") || project.icon.startsWith("data:") || project.icon.includes(".svg") ? (
                    <img src={project.icon} alt={project.name} className="w-5 h-5" />
                  ) : (
                    <span className="text-xl">{project.icon}</span>
                  )}
                  <h3 className="text-lg font-bold">{project.name}</h3>
                </div>
                <div className="flex gap-1.5">
                  {project.links.linkedin && (
                    <a
                      href={project.links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Linkedin size={16} />
                    </a>
                  )}
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Github size={16} />
                    </a>
                  )}
                  {project.links.demo && (
                    <a
                      href={project.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                  {project.links.discord && (
                    <a
                      href={project.links.discord}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <SiDiscord size={16} />
                    </a>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-2 leading-relaxed">{project.description}</p>

              {/* Metrics */}
              {project.metrics && project.metrics.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-2">
                  {project.metrics.map((m) => (
                    <span key={m.label} className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <m.icon size={12} className="text-primary" />
                      {m.label}
                    </span>
                  ))}
                </div>
              )}

              {/* Impact */}
              <p className="text-xs text-muted-foreground/70 leading-relaxed">{project.impact}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
