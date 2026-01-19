import { Phone, Check, RefreshCw } from "lucide-react";

const ReassuranceBar = () => {
  return (
    <section className="py-12 sm:py-16">
      <div className="section-container">
        <div className="highlight-box text-center">
          {/* Reassurance Points */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 mb-8">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent">
                <Check className="h-5 w-5 text-accent-foreground" />
              </div>
              <span className="text-lg font-medium">All-inclusive pricing. No hidden costs.</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-foreground/20">
                <RefreshCw className="h-5 w-5" />
              </div>
              <span className="text-lg font-medium">Other routes? Get a quick quote.</span>
            </div>
          </div>

          {/* CTA Button */}
          <a
            href="tel:0719871294"
            className="btn-cta bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-lg inline-flex items-center gap-3"
          >
            <Phone className="h-5 w-5" />
            <span>Call for a Quote or Booking: 071 987 1294</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ReassuranceBar;
