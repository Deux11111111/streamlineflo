import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import AuditForm from "@/components/AuditForm";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {}, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* SEO Meta Tags */}
      <Helmet>
        {/* Title & Description */}
        <title>StreamlineFlo | AI Automation to Save Time & Boost Efficiency</title>
        <meta
          name="description"
          content="StreamlineFlo helps businesses save time, reduce manual work, and boost efficiency with AI-powered workflow automation. Automate processes, optimize operations, and scale smarter."
        />
        <meta
          name="keywords"
          content="StreamlineFlo, AI automation, workflow automation, business automation, process optimization, intelligent automation, save time, boost efficiency"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://streamlineflo.com/" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="StreamlineFlo | Save Time & Boost Efficiency with AI Automation"
        />
        <meta
          property="og:description"
          content="StreamlineFlo helps businesses save time, reduce manual work, and boost efficiency with AI-powered workflow automation. Automate processes and scale smarter."
        />
        <meta property="og:url" content="https://streamlineflo.com/" />
        <meta property="og:image" content="https://streamlineflo.com/og-image.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="StreamlineFlo | Save Time & Boost Efficiency with AI Automation"
        />
        <meta
          name="twitter:description"
          content="StreamlineFlo helps businesses save time, reduce manual work, and boost efficiency with AI-powered workflow automation. Automate processes and scale smarter."
        />
        <meta name="twitter:image" content="https://streamlineflo.com/og-image.png" />
      </Helmet>

      {/* AI/Workflow Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-secondary/10 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-primary/20 rounded-full blur-lg animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-36 h-36 bg-secondary/15 rounded-full blur-xl animate-float"></div>
      </div>

      {/* Main Sections */}
      <Hero />
      <Services />
      <AuditForm />
      <Footer />
    </div>
  );
};

export default Index;
