import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Workflow, BarChart3, Clock, Cpu } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Bot,
      title: "AI Process Automation",
      description: "Intelligent automation that learns and adapts to your business processes, eliminating repetitive tasks.",
      features: ["Smart Decision Making", "Self-Learning Algorithms", "24/7 Operation"]
    },
    {
      icon: Workflow,
      title: "Workflow Optimization",
      description: "Streamline complex workflows with our advanced automation tools and custom integrations.",
      features: ["Custom Integrations", "Real-time Monitoring", "Scalable Solutions"]
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Data-driven insights to optimize performance and identify new automation opportunities.",
      features: ["Performance Metrics", "Predictive Analytics", "ROI Tracking"]
    },
    {
      icon: Clock,
      title: "Maintenance for Automations",
      description: "Comprehensive maintenance and support to ensure your automations run smoothly.",
      features: ["Proactive Monitoring", "Performance Optimization", "Expert Support"]
    },
    {
      icon: Cpu,
      title: "Custom Development",
      description: "Tailored automation solutions built specifically for your unique business requirements.",
      features: ["Bespoke Solutions", "API Development", "Legacy Integration"]
    }
  ];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6 relative">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 heading-glow">
            Our <span className="gradient-text">AI-Powered</span> Services
          </h2>
          <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive automation solutions designed to transform your business operations
            and drive unprecedented growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="card-glow hover-lift bg-card/80 backdrop-blur-sm border-border/50 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4 animate-pulse-glow">
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="font-display text-xl font-bold text-glow">{service.title}</CardTitle>
                <CardDescription className="font-body text-muted-foreground">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center font-body text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;