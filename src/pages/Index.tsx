import Hero from "@/components/Hero";
import RateCard from "@/components/RateCard";
import ReassuranceBar from "@/components/ReassuranceBar";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <RateCard />
      <ReassuranceBar />
      <ContactForm />
      <Footer />
    </div>
  );
};

export default Index;
