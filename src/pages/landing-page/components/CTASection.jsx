import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
      <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="bg-card rounded-2xl p-8 md:p-12 lg:p-16 shadow-xl border border-border text-center space-y-6 md:space-y-8">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full mb-4">
            <Icon name="Rocket" size={32} color="var(--color-primary)" />
          </div>

          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground">
            Ready to Transform Your
            <span className="block text-primary mt-2">Travel Planning?</span>
          </h2>

          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join thousands of travelers who have already discovered the easiest way to plan multi-city adventures. Start your journey today—completely free!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 pt-4">
            <Button
              variant="default"
              size="lg"
              iconName="Sparkles"
              iconPosition="right"
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto"
            >
              Start Planning Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              iconName="PlayCircle"
              iconPosition="left"
              className="w-full sm:w-auto"
            >
              Watch Demo
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 pt-8 border-t border-border">
            {[
              { icon: 'Check', label: 'No credit card required' },
              { icon: 'Check', label: 'Free forever plan' },
              { icon: 'Check', label: 'Cancel anytime' }
            ]?.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Icon name={feature?.icon} size={18} color="var(--color-success)" />
                <span className="text-sm md:text-base text-muted-foreground">
                  {feature?.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;