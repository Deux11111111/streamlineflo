import Hero from "@/components/Hero";
import Services from "@/components/Services";
import AuditForm from "@/components/AuditForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* AI/Workflow Background Elements */}
      <div className="absolute inset-0 bg-grid opacity-20"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-secondary/10 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-primary/20 rounded-full blur-lg animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-36 h-36 bg-secondary/15 rounded-full blur-xl animate-float"></div>
      </div>
      
      <Hero />
      <Services />
      <AuditForm />
      <Footer />
    </div>
  );
};

export default Index;
