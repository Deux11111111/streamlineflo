import Hero from "@/components/Hero";
import Services from "@/components/Services";
import AuditForm from "@/components/AuditForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-background via-background to-primary/5">
        <Hero />
      </div>
      <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-background">
        <Services />
      </div>
      <div className="bg-gradient-to-br from-background via-secondary/10 to-primary/10">
        <AuditForm />
      </div>
      <div className="bg-background">
        <Footer />
      </div>
    </div>
  );
};

export default Index;
