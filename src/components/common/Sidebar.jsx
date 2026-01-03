import React from "react";
import { NavLink, useParams } from "react-router-dom";
import Icon from "components/AppIcon";

export default function Sidebar() {
  const { id: tripId } = useParams();
  const effectiveTripId = tripId || "trip-1";

  const items = [
    { label: "Dashboard", to: "/dashboard", icon: "LayoutDashboard" },
    { label: "Create Trip", to: "/trip/create", icon: "PlusCircle" },
    { label: "Itinerary", to: `/trip/${effectiveTripId}/itinerary`, icon: "ListTodo" },
    { label: "Calendar", to: `/trip/${effectiveTripId}/calendar`, icon: "Calendar" },
    { label: "Budget", to: `/trip/${effectiveTripId}/budget`, icon: "Wallet" },
    { label: "Community", to: "/community", icon: "Users" },
    { label: "Profile", to: "/profile", icon: "User" }
  ];

  return (
    <aside className="hidden md:block fixed top-16 left-0 bottom-0 w-64 bg-card border-r border-border">
      <nav className="p-3 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 px-3 py-2 rounded-lg font-caption font-medium transition-base focus-ring",
                isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              ].join(" ")
            }
          >
            <Icon name={item.icon} size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
