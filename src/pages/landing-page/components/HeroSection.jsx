import React from 'react';
import { useNavigate } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1579749223028-1a158f45a1b2"
          alt="Aerial view of winding coastal road along turquoise ocean with lush green mountains and scattered white clouds in bright daylight"
          className="w-full h-full object-cover opacity-20" />

        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        <div className="text-center space-y-6 md:space-y-8 lg:space-y-10">
          <div className="inline-flex items-center space-x-3 bg-primary/10 px-4 md:px-6 py-2 md:py-3 rounded-full">
            <Icon name="Sparkles" size={20} color="var(--color-primary)" />
            <span className="font-caption font-medium text-sm md:text-base text-primary">
              Your Journey Starts Here
            </span>
          </div>

          <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight max-w-4xl mx-auto">
            Plan Your Perfect
            <span className="block text-primary mt-2">Multi-City Adventure</span>
          </h1>

          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
            Stop juggling notes, chats, and spreadsheets. GlobeTrotter centralizes your entire travel planning experience into one beautiful, intuitive platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 pt-4 md:pt-6">
            <Button
              variant="default"
              size="lg"
              iconName="Rocket"
              iconPosition="right"
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto">

              Get Started Free
            </Button>
            <Button
              variant="outline"
              size="lg"
              iconName="LogIn"
              iconPosition="right"
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto">

              Sign In
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 lg:gap-12 pt-8 md:pt-12">
            {[
            { icon: 'Users', label: '50K+ Travelers', color: 'var(--color-primary)' },
            { icon: 'MapPin', label: '200+ Destinations', color: 'var(--color-secondary)' },
            { icon: 'Star', label: '4.9/5 Rating', color: 'var(--color-accent)' }]?.
            map((stat, index) =>
            <div key={index} className="flex items-center space-x-2 md:space-x-3">
                <Icon name={stat?.icon} size={20} color={stat?.color} />
                <span className="font-caption font-medium text-sm md:text-base text-foreground">
                  {stat?.label}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <Icon name="ChevronDown" size={32} className="text-muted-foreground" />
      </div>
    </section>);

};

export default HeroSection;