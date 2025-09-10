import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NewsSection from "../sections/NewsSection";
import ProjectsSection from "../sections/ProjectsSection";
import HeroSection from "../sections/HeroSection";
import DashboardSection from "../sections/DashboardSection";

// Main App Component
export default function App() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <ProjectsSection />
      <NewsSection />
      <DashboardSection/>
      <Footer />
    </main>
  );
}
