import { Github, Linkedin, Mail } from "lucide-react";
import { motion } from "framer-motion";
import SiLeetcode from "./icons/SiLeetcode";
import SiKaggle from "./icons/SiKaggle";

const socials = [
  { label: "GitHub", href: "https://github.com", custom: false, icon: Github },
  { label: "LinkedIn", href: "https://linkedin.com", custom: false, icon: Linkedin },
  { label: "LeetCode", href: "https://leetcode.com", custom: true, CustomIcon: SiLeetcode },
  { label: "Kaggle", href: "https://kaggle.com", custom: true, CustomIcon: SiKaggle },
  { label: "Email", href: "mailto:hello@example.com", custom: false, icon: Mail },
];

const SocialBar = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.5 }}
      className="fixed right-4 top-1/2 -translate-y-1/2 z-50 glass rounded-2xl p-2 flex flex-col gap-1 hidden md:flex"
    >
      {socials.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          title={social.label}
          className="group relative p-3 rounded-xl text-muted-foreground hover:text-primary transition-colors"
        >
          {social.custom ? <social.CustomIcon size={20} /> : <social.icon size={20} />}
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 rounded-md bg-card text-xs text-foreground border border-border opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {social.label}
          </span>
        </a>
      ))}
    </motion.div>
  );
};

export default SocialBar;
