import React from "react";
import { Link, useNavigate } from "react-router-dom";

import Icon from "components/AppIcon";
import Button from "components/ui/Button";

import { useAuth } from "context/AuthContext";
import { useTheme } from "context/ThemeContext";

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const displayName = user ? `${user?.firstName || ""} ${user?.lastName || ""}`.trim() : "";

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const recentTrips = [
    { id: "trip-1", name: "European Adventure 2026" },
    { id: "trip-2", name: "Japan Highlights" },
  ];

  return (
    <div className="bg-background">
      <div className="max-w-screen-2xl mx-auto">
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">Profile</h1>
              <p className="text-base md:text-lg text-muted-foreground font-body">Account details and preferences</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <Button
                variant="outline"
                iconName={isDark ? "Sun" : "Moon"}
                iconPosition="left"
                className="w-full sm:w-auto"
                onClick={toggleTheme}
              >
                {isDark ? "Light mode" : "Dark mode"}
              </Button>
              <Button
                variant="destructive"
                iconName="LogOut"
                iconPosition="left"
                className="w-full sm:w-auto"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-5">
            <div className="bg-card rounded-xl border border-border elevation-1 p-4 md:p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon name="User" size={28} color="var(--color-primary)" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground truncate">
                    {displayName || user?.email || "Traveler"}
                  </h2>
                  <p className="text-sm md:text-base text-muted-foreground font-body truncate">{user?.email}</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border border-border bg-background">
                    <p className="text-xs font-caption text-muted-foreground mb-1">Phone</p>
                    <p className="text-sm md:text-base font-body text-foreground">{user?.phone || "—"}</p>
                  </div>
                  <div className="p-4 rounded-lg border border-border bg-background">
                    <p className="text-xs font-caption text-muted-foreground mb-1">Country</p>
                    <p className="text-sm md:text-base font-body text-foreground">{user?.country || "—"}</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border bg-background">
                  <p className="text-xs font-caption text-muted-foreground mb-1">Member since</p>
                  <p className="text-sm md:text-base font-body text-foreground">{user?.joinedDate || "—"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-7">
            <div className="bg-card rounded-xl border border-border elevation-1 p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-4">Quick Links</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  to="/community"
                  className="p-4 rounded-lg border border-border bg-background hover:bg-muted/50 transition-smooth"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <Icon name="Users" size={20} color="var(--color-secondary)" />
                    </div>
                    <div>
                      <p className="text-sm md:text-base font-body font-medium text-foreground">Community</p>
                      <p className="text-xs md:text-sm font-caption text-muted-foreground">Find and share trips</p>
                    </div>
                  </div>
                </Link>

                <Link
                  to="/dashboard"
                  className="p-4 rounded-lg border border-border bg-background hover:bg-muted/50 transition-smooth"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon name="LayoutDashboard" size={20} color="var(--color-primary)" />
                    </div>
                    <div>
                      <p className="text-sm md:text-base font-body font-medium text-foreground">Dashboard</p>
                      <p className="text-xs md:text-sm font-caption text-muted-foreground">Your travel hub</p>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="mt-6">
                <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-3">Recent trips</h3>
                <div className="space-y-3">
                  {recentTrips?.map((trip) => (
                    <Link
                      key={trip?.id}
                      to={`/trip/${trip?.id}/itinerary`}
                      className="flex items-center justify-between gap-4 p-4 rounded-lg border border-border bg-background hover:bg-muted/50 transition-smooth"
                    >
                      <div className="min-w-0">
                        <p className="text-sm md:text-base font-body font-medium text-foreground truncate">{trip?.name}</p>
                        <p className="text-xs md:text-sm font-caption text-muted-foreground truncate">View itinerary</p>
                      </div>
                      <Icon name="ChevronRight" size={18} color="var(--color-muted-foreground)" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
