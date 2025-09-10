import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NewsSection from "../sections/NewsSection";
import ProjectsSection from "../sections/ProjectsSection";
import HeroSection from "../sections/HeroSection";
import DashboardSection from "../sections/DashboardSection";
import { SpeedInsights } from "@vercel/speed-insights/next"

// Main App Component
export default function App() {
  return (
    <main>
      <SpeedInsights />
      <Navbar />
      <HeroSection />
      <ProjectsSection />
      <NewsSection />
      <DashboardSection/>
      <Footer />
    </main>
  );
}
