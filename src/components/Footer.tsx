import { Mail, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border/50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Contact Info */}
          <div className="flex items-center space-x-8">
            <a 
              href="mailto:hello@streamlineflo.com" 
              className="flex items-center space-x-3 text-muted-foreground hover:text-primary transition-colors group"
            >
              <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <span className="font-body text-sm">hello@streamlineflo.com</span>
            </a>
            
            <a 
              href="https://www.linkedin.com/in/adrian-zaporojan-9358642a9/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-3 text-muted-foreground hover:text-primary transition-colors group"
            >
              <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Linkedin className="w-5 h-5 text-primary" />
              </div>
              <span className="font-body text-sm">Connect on LinkedIn</span>
            </a>
          </div>

          {/* Copyright */}
          <p className="font-body text-sm text-muted-foreground">
            © 2024 StreamlineFlo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;