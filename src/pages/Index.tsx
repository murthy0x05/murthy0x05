import { lazy, Suspense } from "react";
import HeroSection from "@/components/portfolio/HeroSection";
import AcademicResultSection from "@/components/portfolio/AcademicResultSection";
import ProjectsSection from "@/components/portfolio/ProjectsSection";
import ActivitySection from "@/components/portfolio/ActivitySection";
import ExperienceSection from "@/components/portfolio/ExperienceSection";
import SkillsSection from "@/components/portfolio/SkillsSection";
import ContactSection from "@/components/portfolio/ContactSection";
import Footer from "@/components/portfolio/Footer";
import FloatingBar from "@/components/portfolio/FloatingBar";
import ThemeToggle from "@/components/portfolio/ThemeToggle";
import CursorEffect from "@/components/portfolio/CursorEffect";

const AIAssistant = lazy(() => import("@/components/portfolio/AIAssistantPanel"));

const Index = () => {
  return (
    <div className="min-h-screen bg-background grid-bg pb-20">
      <CursorEffect />
      <ThemeToggle />
      <HeroSection />
      <ProjectsSection />
      <ActivitySection />
      <ExperienceSection />
      <AcademicResultSection />
      <SkillsSection />
      <ContactSection />
      <Footer />
      <FloatingBar />
      <Suspense fallback={null}>
        <AIAssistant />
      </Suspense>
    </div>
  );
};

export default Index;
