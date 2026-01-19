import { Phone } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-overberg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Scenic Overberg countryside road"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/50 to-primary/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 section-container text-center text-primary-foreground py-12">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Logo/Brand */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 mb-4">
            <span className="text-sm font-medium tracking-wide">OVERBERG TRANSPORT</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
            Easy, Reliable Rides Across the Overberg
          </h1>

          {/* Tagline */}
          <p className="text-lg sm:text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto">
            Fixed fares. Comfortable trips. Book directly.
          </p>

          {/* CTA Button */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:0719871294"
              className="btn-cta text-lg sm:text-xl inline-flex items-center justify-center gap-3 px-8 py-4"
            >
              <Phone className="h-5 w-5 sm:h-6 sm:w-6" />
              <span>Call Ethan: 071 987 1294</span>
            </a>
            <Link
              to="/booking"
              className="btn-cta text-lg sm:text-xl inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              <span>Book Online</span>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-sm text-primary-foreground/80">
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Fixed pricing
            </span>
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Local & trusted
            </span>
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Comfortable vehicles
            </span>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
