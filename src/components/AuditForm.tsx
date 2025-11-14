import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, ArrowRight } from "lucide-react";
import emailjs from '@emailjs/browser';

// 👇 PUT YOUR EMAILJS CREDENTIALS HERE
const EMAILJS_SERVICE_ID = 'service_uf4mka8';
const EMAILJS_TEMPLATE_ID = 'template_pq7ii6s';
const EMAILJS_PUBLIC_KEY = 'WjT4D4l5GOzfZPMao';

const AuditForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send email using EmailJS
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          company: formData.company,
          to_name: 'StreamlineFlo Team', // You can customize this
        },
        EMAILJS_PUBLIC_KEY
      );

      toast({
        title: "Audit Request Submitted!",
        description: "We'll contact you within 24 hours to schedule your free workflow audit.",
      });
      
      setFormData({ name: "", email: "", company: "" });
    } catch (error) {
      console.error('EmailJS error:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="audit-form" className="py-24 relative">
      <div className="container mx-auto px-6 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 heading-glow">
              Get Your <span className="gradient-text">Free</span> Workflow Audit
            </h2>
            <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover hidden automation opportunities in your business. Our experts will 
              analyze your workflows and provide actionable insights - completely free.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Benefits */}
            <div className="space-y-6 animate-scale-in">
              <h3 className="font-display text-2xl font-bold mb-6 text-glow">What You'll Get:</h3>
              <div className="space-y-4">
                {[
                  "Comprehensive workflow analysis",
                  "Custom automation recommendations",
                  "ROI projections and cost savings",
                  "Implementation roadmap",
                  "Priority automation opportunities"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <Sparkles className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                    <span className="font-body text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 rounded-2xl bg-gradient-primary/10 border border-primary/20">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-primary">No commitment required.</strong> This audit is 
                  completely free with no strings attached. We'll provide valuable insights 
                  regardless of whether you choose to work with us.
                </p>
              </div>
            </div>

            {/* Form */}
            <Card className="card-glow bg-card/90 backdrop-blur-sm border-border/50 animate-scale-in">
              <CardHeader className="text-center">
                <CardTitle className="font-display text-2xl font-bold text-glow">Book Your Free Audit</CardTitle>
                <CardDescription className="font-body">
                  Takes less than 2 minutes. We'll contact you within 24 hours.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="bg-background/50 border-border/50 focus:border-primary"
                      placeholder="John Smith"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Business Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="bg-background/50 border-border/50 focus:border-primary"
                      placeholder="john@company.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name *</Label>
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      value={formData.company}
                      onChange={handleInputChange}
                      required
                      className="bg-background/50 border-border/50 focus:border-primary"
                      placeholder="Your Company Inc."
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-primary hover:opacity-90 transition-opacity text-lg py-6 glow-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Submitting..."
                    ) : (
                      <>
                        Book Free Audit
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By submitting this form, you agree to receive communications from StreamlineFlo. 
                    We respect your privacy and will never share your information.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuditForm;
