import { Phone, MapPin, Car } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="section-container">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-foreground/10">
              <Car className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold">Overberg Transport</span>
          </div>

          {/* Tagline */}
          <p className="text-primary-foreground/80 text-lg">
            Your trusted local driver
          </p>

          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <a
              href="tel:0719871294"
              className="flex items-center gap-2 text-lg font-medium hover:text-accent transition-colors"
            >
              <Phone className="h-5 w-5" />
              Ethan: 071 987 1294
            </a>
            <Link
              to="/booking"
              className="flex items-center gap-2 text-lg font-medium hover:text-accent transition-colors"
            >
              <Car className="h-5 w-5" />
              Book Online
            </Link>
            <div className="flex items-center gap-2 text-primary-foreground/70">
              <MapPin className="h-5 w-5" />
              Serving the Overberg Region
            </div>
          </div>

          {/* Divider */}
          <div className="w-full max-w-xs h-px bg-primary-foreground/20" />

          {/* Copyright */}
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} Overberg Transport. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
