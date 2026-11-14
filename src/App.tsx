import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AboutSection from "@/components/AboutSection";
import ExperienceEducationSection from "@/components/ExperienceEducationSection";
import ExpertiseSection from "@/components/ExpertiseSection";
import Header from "@/components/Header";
import PortfolioSections from "@/components/PortfolioSections";
import ToolsStrip from "@/components/ToolsStrip";
import Home from "@/pages/Home";
import { AdminRoutes } from "@/admin";
import { fetchPortfolio, type PortfolioPayload } from "@/lib/portfolio";

const PortfolioHome = () => {
  const [portfolio, setPortfolio] = useState<PortfolioPayload | null>(null);

  useEffect(() => {
    let alive = true;
    fetchPortfolio().then((data) => {
      if (alive) setPortfolio(data);
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <main className="relative bg-[var(--hero-bottom)] font-body text-white">
      <Header />
      <Home profile={portfolio?.profile ?? null} />
      <ToolsStrip tools={portfolio?.tools} />
      <AboutSection
        profile={portfolio?.profile ?? null}
        stats={portfolio?.aboutStats ?? null}
      />
      <ExperienceEducationSection
        experiences={portfolio?.experiences ?? null}
        education={portfolio?.education ?? null}
      />
      <ExpertiseSection skills={portfolio?.skills ?? null} />
      <PortfolioSections portfolio={portfolio} />
    </main>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PortfolioHome />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
