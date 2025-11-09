import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/ServiceCard";
import { FeatureCard } from "@/components/FeatureCard";
import { 
  Wrench, 
  Droplet, 
  Scissors, 
  Wind, 
  Hammer, 
  Lightbulb,
  Search,
  Calendar,
  Star,
  Shield,
  Clock,
  MessageCircle
} from "lucide-react";
import heroImage from "@/assets/hero-services.jpg";

const Index = () => {
  const services = [
    { icon: Lightbulb, title: "Electrician", description: "Wiring, repairs, and installations" },
    { icon: Droplet, title: "Plumber", description: "Pipes, leaks, and drainage solutions" },
    { icon: Scissors, title: "Salon & Beauty", description: "Hair, makeup, and grooming services" },
    { icon: Wind, title: "AC Repair", description: "Installation and maintenance" },
    { icon: Hammer, title: "Carpenter", description: "Furniture repair and woodwork" },
    { icon: Wrench, title: "Appliance Repair", description: "Fix washing machines, fridges & more" },
  ];

  const features = [
    {
      icon: Search,
      title: "Browse Services",
      description: "Explore verified professionals across multiple categories tailored for your city",
      step: 1
    },
    {
      icon: Calendar,
      title: "Book Instantly",
      description: "Select your preferred date, time and location with just a few clicks",
      step: 2
    },
    {
      icon: Star,
      title: "Get Quality Service",
      description: "Experienced professionals arrive on time and complete the job efficiently",
      step: 3
    },
  ];

  const trustPoints = [
    { icon: Shield, title: "Verified Professionals", description: "All service providers are background-checked" },
    { icon: Star, title: "Rated & Reviewed", description: "Real feedback from customers in your community" },
    { icon: Clock, title: "On-Time Service", description: "Punctual arrivals and quick job completion" },
    { icon: MessageCircle, title: "24/7 Support", description: "Our AI assistant is always ready to help" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  Trusted by 50,000+ customers
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                Your Local Service Professionals,{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Just a Click Away
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Connect with verified electricians, plumbers, beauticians, and more in Tier 2 & 3 cities. 
                Quality service at fair prices, delivered on time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg" className="text-base">
                  Book a Service Now
                </Button>
                <Button variant="outline" size="lg" className="text-base">
                  Join as Professional
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-2xl" />
              <img 
                src={heroImage} 
                alt="Local service professionals ready to help"
                className="relative rounded-2xl shadow-2xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Popular Services in Your City
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From home repairs to personal care, find trusted professionals for every need
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              How LocalAid Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get professional help in three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Why Choose LocalAid?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Quality, trust, and convenience in every service
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustPoints.map((point, index) => (
              <FeatureCard key={index} {...point} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary to-primary-hover rounded-2xl p-12 md:p-16 text-center shadow-[var(--shadow-soft)]">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-foreground">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust LocalAid for their home service needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" className="text-base shadow-lg">
                Book Your First Service
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-base bg-primary-foreground text-primary hover:bg-primary-foreground/90 border-primary-foreground"
              >
                Become a Partner
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-foreground">LA</span>
                </div>
                <span className="text-lg font-bold text-foreground">LocalAid</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Connecting communities with trusted local professionals across Tier 2 & 3 cities.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Services</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Electrician</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Plumber</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Beauty Services</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Appliance Repair</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Partner with Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Refund Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 LocalAid. All rights reserved. Built for communities, by communities.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
