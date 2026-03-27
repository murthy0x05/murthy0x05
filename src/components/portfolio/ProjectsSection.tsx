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
import torrentIcon from "@/assets/bittorrent-project-icon.svg";
import creditRiskIcon from "@/assets/ml-credit-risk-project-icon.svg";
import phantomNotesIcon from "@/assets/phantom-notes-project-icon.svg";

const projects: {
  name: string;
  icon: string;
  description: string;
  impact: string;
  links: { linkedin?: string; github?: string; demo?: string; discord?: string };
  metrics?: { icon: React.ElementType; label: string }[];
}[] = [
  {
    name: "KafkaX",
    icon: kafkaIcon,
    description:
      "Engineered a Kafka-inspired event streaming platform in Java, replicating core components like brokers, producers, and consumers.",
    impact: "Built a Kafka-like system from scratch to enable real-time, scalable data streaming.",
    links: {
      linkedin: "https://www.linkedin.com/in/murthy0x05/",
      github: "https://github.com/murthy0x05/apache-kafka-using-kafka-protocol",
      demo: "https://github.com/murthy0x05",
    },
    metrics: [
      { icon: Code, label: "Java LLD" },
      { icon: Database, label: "Kafka Protocol" },
      { icon: Zap, label: "Reduced Latency" },
    ],
  },
  {
    name: "TorrentX",
    icon: torrentIcon,
    description:
      "Implemented a peer-to-peer file sharing protocol inspired by BitTorrent in Java, enabling decentralized file transfer between multiple nodes.",
    impact: "Eliminates reliance on centralized servers by enabling efficient, distributed file sharing across peers.",
    links: {
      linkedin: "https://www.linkedin.com/in/murthy0x05/",
      github: "https://github.com/murthy0x05/apache-kafka-using-kafka-protocol",
      demo: "https://github.com/murthy0x05",
    },
    metrics: [
      { icon: Network, label: "P2P System" },
      { icon: ArrowLeftRight, label: "Chunk Transfer" },
      { icon: Cpu, label: "Custom Protocol" },
      { icon: Zap, label: "Parallel Sync" },
    ],
  },
  {
    name: "Credit Risk Analyzer",
    icon: creditRiskIcon,
    description:
      "Developed a machine learning model to assess credit risk by analyzing financial and behavioral customer data.",
    impact: "Helps predict loan defaults and supports better financial decision-making using data-driven insights.",
    links: {
      linkedin: "https://www.linkedin.com/in/murthy0x05/",
      github: "https://github.com/murthy0x05/apache-kafka-using-kafka-protocol",
      demo: "https://github.com/murthy0x05",
    },
    metrics: [
      { icon: Brain, label: "ML Model" },
      { icon: Database, label: "Data Analysis" },
      { icon: LineChart, label: "Risk Prediction" },
    ],
  },
  {
    name: "Phantom Notes",
    icon: phantomNotesIcon,
    description:
      "Built an AI-powered chatbot that enables interactive learning while automatically generating structured notes from conversations for future reference.",
    impact:
      "Enhances learning efficiency by combining real-time interaction with persistent, AI-generated knowledge retention.",
    links: {
      linkedin: "https://www.linkedin.com/in/murthy0x05/",
      github: "https://github.com/murthy0x05/apache-kafka-using-kafka-protocol",
      demo: "https://github.com/murthy0x05",
    },
    metrics: [
      { icon: Brain, label: "LLM Chat" },
      { icon: FileText, label: "Auto Notes" },
      { icon: Zap, label: "Real-time Learning" },
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
