import { useState } from "react";
import { Send } from "lucide-react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    route: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder - would typically send to backend
    alert(`Thank you ${formData.name}! Ethan will call you back on ${formData.phone} about your trip.`);
    setFormData({ name: "", phone: "", route: "" });
  };

  return (
    <section className="py-12 sm:py-16 bg-secondary">
      <div className="section-container">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Request a Callback
            </h3>
            <p className="text-muted-foreground">
              Leave your details and we'll get back to you shortly.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                placeholder="John Smith"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                placeholder="071 234 5678"
              />
            </div>

            <div>
              <label htmlFor="route" className="block text-sm font-medium text-foreground mb-1.5">
                Route Request
              </label>
              <input
                type="text"
                id="route"
                value={formData.route}
                onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                placeholder="e.g., Hermanus to Cape Town"
              />
            </div>

            <button
              type="submit"
              className="btn-cta w-full justify-center text-base"
            >
              <Send className="h-4 w-4" />
              Request Callback
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
