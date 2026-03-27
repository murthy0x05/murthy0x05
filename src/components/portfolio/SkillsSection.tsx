import { motion } from "framer-motion";

const skillCategories = [
  {
    title: "Core Stack",
    skills: [
      "C",
      "C++",
      "Java 8+",
      "Python",
      "Kotlin",
      "JavaScript",
      "TypeScript",
      "Flask",
      "FastAPI",
      "MySQL",
      "PostgreSQL",
      "MongoDB",
      "DSA",
      "OOPs",
      "Operating Systems",
      "Computer Networks",
    ],
  },
  {
    title: "AI & ML Stack",
    skills: [
      "Scikit-learn",
      "TensorFlow",
      "PyTorch",
      "Keras",
      "NLTK",
      "spaCy",
      "Gensim",
      "FastText",
      "Hugging Face",
      "LangChain",
      "NumPy",
      "Pandas",
      "Matplotlib",
      "Seaborn",
    ],
  },
  {
    title: "Tools",
    skills: ["Docker", "Kubernetes", "Git", "GitHub", "Vercel", "Postman"],
  },
];

const SkillsSection = () => {
  return (
    <section id="skills" className="py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-bold mb-8"
        >
          <span className="text-primary mr-2">●</span> Skills
        </motion.h2>

        <div className="flex flex-col gap-6">
          {skillCategories.map((cat, ci) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: ci * 0.1 }}
            >
              <h3 className="text-sm font-semibold mb-3">{cat.title}</h3>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-md border border-border bg-secondary text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
