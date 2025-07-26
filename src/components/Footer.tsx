import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-16 bg-background border-t border-border/50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <img 
              src="/lovable-uploads/709100ab-f590-4ead-92c2-c97a43e48597.png" 
              alt="StreamlineFlo Logo" 
              className="h-12 w-auto mb-4"
            />
            <p className="text-muted-foreground mb-6 max-w-md">
              Transforming businesses through intelligent automation. We help companies 
              streamline their workflows with cutting-edge AI technology.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="w-4 h-4 mr-3 text-primary" />
                hello@streamlineflo.com
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="w-4 h-4 mr-3 text-primary" />
                +1 (555) 123-4567
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mr-3 text-primary" />
                Global Remote Team
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>AI Process Automation</li>
              <li>Workflow Optimization</li>
              <li>Analytics & Insights</li>
              <li>Custom Development</li>
              <li>Support & Maintenance</li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>About Us</li>
              <li>Case Studies</li>
              <li>Blog</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 StreamlineFlo. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;