import { MapPin, ArrowRight } from "lucide-react";

const routes = [
  { from: "Hermanus", to: "Stanford", price: "R250" },
  { from: "Hermanus", to: "Gansbaai", price: "R350" },
  { from: "Hermanus", to: "Caledon", price: "R400" },
  { from: "Gansbaai", to: "Cape Agulhas (Struisbaai)", price: "R300" },
  { from: "Caledon", to: "Bredasdorp", price: "R320" },
  { from: "Bredasdorp", to: "Arniston", price: "R280" },
  { from: "Hermanus", to: "Elgin/Grabouw", price: "R450" },
];

const RateCard = () => {
  return (
    <section className="py-16 sm:py-20 bg-slate-light" id="rates">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent mb-4">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-medium">Popular Routes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Our Popular Fixed-Rate Trips
          </h2>
          <p className="text-muted-foreground text-lg">One-Way Fares</p>
        </div>

        {/* Rate Table */}
        <div className="max-w-3xl mx-auto">
          <table className="rate-table">
            <thead>
              <tr>
                <th>Route</th>
                <th className="text-right">Fixed Fare</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((route, index) => (
                <tr key={index}>
                  <td>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-foreground">{route.from}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="font-medium text-foreground">{route.to}</span>
                    </div>
                  </td>
                  <td className="text-right">
                    <span className="font-bold text-accent text-lg">{route.price}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Note */}
        <p className="text-center text-muted-foreground text-sm mt-6">
          Prices are per trip, not per person. All routes work both ways.
        </p>
      </div>
    </section>
  );
};

export default RateCard;
