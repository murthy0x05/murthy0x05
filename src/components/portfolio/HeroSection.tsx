import { motion } from "framer-motion";
import avatarImg from "@/assets/avatar.png";

const badges = ["AIML Engineer", "Android Developer", "Software Developer", "Artist"];

const HeroSection = () => {
  return (
    <section className="pt-16 pb-8 px-6">
      <div className="max-w-2xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-5 mb-5">
          
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Pavan
            <br />
            Kumar M
          </h1>
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-full glow-green blur-2xl opacity-20" />
            <img

              alt="Profile"
              className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover relative z-10 border-2 border-border" src={avatarImg} />
            
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-wrap justify-center gap-2">
          
          {badges.map((badge) =>
          <span
            key={badge}
            className="px-3 py-1 text-sm rounded-full border border-primary/40 bg-primary/10 text-primary">
            
              {badge}
            </span>
          )}
        </motion.div>
      </div>
    </section>);

};

export default HeroSection;