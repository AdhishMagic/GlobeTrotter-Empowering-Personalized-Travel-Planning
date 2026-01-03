import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const TestimonialsSection = () => {
  const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Digital Nomad',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_159d2c8f8-1763294679735.png",
    avatarAlt: 'Professional headshot of woman with long brown hair wearing white blouse smiling warmly at camera',
    rating: 5,
    content: 'GlobeTrotter transformed how I plan my multi-city trips. The budget tracking feature alone saved me hundreds of dollars on my Southeast Asia journey. Absolutely essential for any serious traveler!'
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Travel Blogger',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1c30629a8-1763296377538.png",
    avatarAlt: 'Professional headshot of Hispanic man with short black hair in navy suit with confident smile',
    rating: 5,
    content: 'As someone who creates travel content, having all my itineraries organized in one place is game-changing. The community sharing feature helps me inspire my followers with detailed trip plans.'
  },
  {
    name: 'Emily Chen',
    role: 'Group Travel Organizer',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1b61aa668-1763294259423.png",
    avatarAlt: 'Professional headshot of Asian woman with shoulder-length black hair wearing gray blazer with friendly expression',
    rating: 5,
    content: 'Coordinating trips for 15+ people used to be a nightmare. GlobeTrotter makes it seamless with its intuitive interface and comprehensive activity management. My clients love the shared itineraries!'
  }];


  const trustSignals = [
  { icon: 'Shield', label: 'SSL Secured', color: 'var(--color-success)' },
  { icon: 'Award', label: 'Award Winning', color: 'var(--color-primary)' },
  { icon: 'Users', label: '50K+ Users', color: 'var(--color-secondary)' },
  { icon: 'Star', label: '4.9/5 Rating', color: 'var(--color-accent)' }];


  return (
    <section className="py-16 md:py-20 lg:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center space-y-4 md:space-y-6 mb-12 md:mb-16">
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground">
            Loved by Travelers
            <span className="block text-primary mt-2">Worldwide</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
            Join thousands of satisfied travelers who have transformed their planning experience with GlobeTrotter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          {testimonials?.map((testimonial, index) =>
          <div
            key={index}
            className="bg-card rounded-xl p-6 md:p-8 shadow-md hover-lift transition-base border border-border">

              <div className="flex items-center space-x-4 mb-4 md:mb-6">
                <Image
                src={testimonial?.avatar}
                alt={testimonial?.avatarAlt}
                className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover" />

                <div className="flex-1 min-w-0">
                  <h4 className="font-caption font-semibold text-base md:text-lg text-foreground truncate">
                    {testimonial?.name}
                  </h4>
                  <p className="text-sm text-muted-foreground truncate">
                    {testimonial?.role}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial?.rating)]?.map((_, i) =>
              <Icon key={i} name="Star" size={16} color="var(--color-accent)" className="fill-current" />
              )}
              </div>

              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                "{testimonial?.content}"
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 lg:gap-12 pt-8 md:pt-12 border-t border-border">
          {trustSignals?.map((signal, index) =>
          <div key={index} className="flex items-center space-x-2 md:space-x-3">
              <Icon name={signal?.icon} size={24} color={signal?.color} />
              <span className="font-caption font-medium text-sm md:text-base text-foreground">
                {signal?.label}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>);

};

export default TestimonialsSection;