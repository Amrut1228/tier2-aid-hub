import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  step?: number;
}

export const FeatureCard = ({ icon: Icon, title, description, step }: FeatureCardProps) => {
  return (
    <Card className="relative p-6 border-border hover:border-primary transition-all duration-300">
      {step && (
        <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-lg shadow-lg">
          {step}
        </div>
      )}
      <div className="flex flex-col gap-4">
        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
          <Icon className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2 text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </Card>
  );
};
