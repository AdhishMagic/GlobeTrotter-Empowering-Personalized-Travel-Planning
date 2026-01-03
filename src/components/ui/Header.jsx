import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Plan Trip', path: '/create-new-trip', icon: 'MapPin' },
    { label: 'Budget', path: '/budget-summary', icon: 'Wallet' }
  ];

  const isActivePath = (path) => {
    if (path === '/create-new-trip') {
      return location?.pathname === '/create-new-trip' || 
             location?.pathname === '/add-cities' || 
             location?.pathname === '/activity-search';
    }
    return location?.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-100 bg-card shadow-md transition-base">
        <div className="mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link 
              to="/dashboard" 
              className="flex items-center space-x-3 hover-lift focus-ring rounded-lg px-2 py-1"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center transition-base">
                <Icon name="Plane" size={24} color="var(--color-primary)" />
              </div>
              <span className="font-heading font-semibold text-xl text-foreground hidden sm:block">
                GlobeTrotter
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-2">
              {navigationItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-caption font-medium transition-base hover-lift active-press focus-ring ${
                    isActivePath(item?.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={item?.icon} size={18} />
                  <span>{item?.label}</span>
                </Link>
              ))}
            </nav>

            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-base focus-ring active-press"
              aria-label="Toggle mobile menu"
            >
              <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={24} />
            </button>
          </div>
        </div>
      </header>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="absolute inset-0 bg-background"
            onClick={toggleMobileMenu}
          />
          <nav className="absolute top-16 left-0 right-0 bg-card shadow-lg animate-slide-down">
            <div className="px-4 py-6 space-y-2">
              {navigationItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  onClick={toggleMobileMenu}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-caption font-medium transition-base active-press ${
                    isActivePath(item?.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={item?.icon} size={20} />
                  <span>{item?.label}</span>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
