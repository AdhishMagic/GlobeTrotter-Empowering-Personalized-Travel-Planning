import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Icon from "components/AppIcon";
import { useAuth } from "context/AuthContext";
import { useTheme } from "context/ThemeContext";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: "LayoutDashboard" },
  { label: "Create Trip", to: "/trip/create", icon: "MapPin" },
  { label: "Community", to: "/community", icon: "Users" },
  { label: "Profile", to: "/profile", icon: "User" }
];

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-100 bg-card shadow-md transition-base">
      <div className="mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="flex items-center space-x-3 hover-lift focus-ring rounded-lg px-2 py-1"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center transition-base">
              <Icon name="Plane" size={24} color="var(--color-primary)" />
            </div>
            <span className="font-heading font-semibold text-xl text-foreground hidden sm:block">
              GlobeTrotter
            </span>
          </button>

          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "flex items-center space-x-2 px-4 py-2 rounded-lg font-caption font-medium transition-base hover-lift active-press focus-ring",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  ].join(" ")
                }
                end
              >
                <Icon name={item.icon} size={18} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-muted transition-base focus-ring active-press"
              aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            >
              <Icon name={isDark ? "Sun" : "Moon"} size={20} />
            </button>

            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-base focus-ring active-press text-foreground"
              >
                <Icon name="LogOut" size={18} />
                <span className="font-caption font-medium">Logout</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-base focus-ring active-press text-foreground"
              >
                <Icon name="LogIn" size={18} />
                <span className="font-caption font-medium">Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
