import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Brain, Target } from "lucide-react";

const Hero = () => {
  const scrollToForm = () => {
    document.getElementById("audit-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Header with Logo */}
      <header className="relative z-20 pt-8 px-6">
        <div className="container mx-auto">
          <img
            src="/logo.png"
            alt="StreamlineFlo – AI Workflow Automation Logo"
            className="h-24 md:h-32 lg:h-40 w-auto animate-scale-in"
          />
        </div>
      </header>

      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-glow opacity-60"></div>
      <div className="absolute inset-0 bg-grid opacity-10"></div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-float"></div>
      <div
        className="absolute top-40 right-32 w-32 h-32 bg-secondary/20 rounded-full blur-xl animate-float"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute bottom-20 left-1/4 w-16 h-16 bg-accent/20 rounded-full blur-xl animate-float"
        style={{ animationDelay: "4s" }}
      ></div>

      <div className="container mx-auto px-6 text-center relative z-10 flex-1 flex items-center justify-center">
        {/* Hero Content */}
        <div className="max-w-5xl mx-auto animate-slide-up">
          {/* Main SEO Heading */}
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight heading-glow">
            StreamlineFlo – AI Workflow Automation
            <span className="gradient-text block">& Business Process Automation</span>
          </h1>

          {/* Supporting SEO Subheading */}
          <h2 className="mt-4 text-2xl md:text-3xl font-semibold text-muted-foreground">
            Reduce manual tasks by 90% with intelligent automation solutions
          </h2>

          {/* SEO-Friendly Paragraph */}
          <p className="font-body text-lg md:text-xl text-muted-foreground mt-6 mb-8 max-w-3xl mx-auto leading-relaxed">
            At <strong>StreamlineFlo</strong>, we specialize in{" "}
            <strong>AI workflow automation</strong> and{" "}
            <strong>business process automation</strong> designed to optimize
            operations, cut costs, and improve efficiency. Our{" "}
            <em>AI-powered automation solutions</em> help businesses scale faster,
            reduce errors, and transform workflows for long-term growth.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-3xl mx-auto">
            <div className="flex flex-col items-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover-lift">
              <Zap className="w-8 h-8 text-primary mb-2" />
              <div className="text-2xl font-bold gradient-text">90%</div>
              <div className="font-body text-sm text-muted-foreground">
                Time Saved
              </div>
            </div>
            <div className="flex flex-col items-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover-lift">
              <Brain className="w-8 h-8 text-secondary mb-2" />
              <div className="text-2xl font-bold gradient-text">AI-Powered</div>
              <div className="font-body text-sm text-muted-foreground">
                Intelligence
              </div>
            </div>
            <div className="flex flex-col items-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover-lift">
              <Target className="w-8 h-8 text-accent mb-2" />
              <div className="text-2xl font-bold gradient-text">100%</div>
              <div className="font-body text-sm text-muted-foreground">
                ROI Focused
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex justify-center items-center">
            <Button
              size="lg"
              className="bg-gradient-primary hover:opacity-90 transition-opacity text-lg px-8 py-6 glow-primary"
              onClick={scrollToForm}
            >
              Get Free Workflow Automation Audit
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
