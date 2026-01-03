import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const Footer = () => {
  const currentYear = new Date()?.getFullYear();

  const footerLinks = {
    product: [
      { label: 'Features', path: '#features' },
      { label: 'Pricing', path: '#pricing' },
      { label: 'Destinations', path: '#destinations' },
      { label: 'Community', path: '/dashboard' }
    ],
    company: [
      { label: 'About Us', path: '#about' },
      { label: 'Careers', path: '#careers' },
      { label: 'Blog', path: '#blog' },
      { label: 'Press Kit', path: '#press' }
    ],
    support: [
      { label: 'Help Center', path: '#help' },
      { label: 'Contact Us', path: '#contact' },
      { label: 'Privacy Policy', path: '#privacy' },
      { label: 'Terms of Service', path: '#terms' }
    ]
  };

  const socialLinks = [
    { icon: 'Facebook', label: 'Facebook', url: '#' },
    { icon: 'Twitter', label: 'Twitter', url: '#' },
    { icon: 'Instagram', label: 'Instagram', url: '#' },
    { icon: 'Linkedin', label: 'LinkedIn', url: '#' }
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12 mb-12">
          <div className="lg:col-span-2">
            <Link to="/landing-page" className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="Plane" size={24} color="var(--color-primary)" />
              </div>
              <span className="font-heading font-semibold text-xl text-foreground">
                GlobeTrotter
              </span>
            </Link>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6 max-w-md">
              Your all-in-one platform for planning unforgettable multi-city adventures. Centralize your travel planning and make every journey extraordinary.
            </p>
            <div className="flex items-center space-x-4">
              {socialLinks?.map((social, index) => (
                <a
                  key={index}
                  href={social?.url}
                  className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover-lift transition-base focus-ring"
                  aria-label={social?.label}
                >
                  <Icon name={social?.icon} size={20} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-caption font-semibold text-base text-foreground mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              {footerLinks?.product?.map((link, index) => (
                <li key={index}>
                  <a
                    href={link?.path}
                    className="text-sm text-muted-foreground hover:text-primary transition-base"
                  >
                    {link?.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-caption font-semibold text-base text-foreground mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks?.company?.map((link, index) => (
                <li key={index}>
                  <a
                    href={link?.path}
                    className="text-sm text-muted-foreground hover:text-primary transition-base"
                  >
                    {link?.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-caption font-semibold text-base text-foreground mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              {footerLinks?.support?.map((link, index) => (
                <li key={index}>
                  <a
                    href={link?.path}
                    className="text-sm text-muted-foreground hover:text-primary transition-base"
                  >
                    {link?.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              &copy; {currentYear} GlobeTrotter. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <a href="#privacy" className="text-sm text-muted-foreground hover:text-primary transition-base">
                Privacy
              </a>
              <a href="#terms" className="text-sm text-muted-foreground hover:text-primary transition-base">
                Terms
              </a>
              <a href="#cookies" className="text-sm text-muted-foreground hover:text-primary transition-base">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;