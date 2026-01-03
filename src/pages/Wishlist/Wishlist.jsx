import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Icon from "components/AppIcon";
import Button from "components/ui/Button";
import Image from "components/AppImage";

import { useAuth } from "context/AuthContext";
import { listWishlistItems, saveWishlistMap, loadWishlistMap } from "utils/wishlist";

export default function Wishlist() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id;

  const [refreshKey, setRefreshKey] = useState(0);

  const items = useMemo(() => {
    // refreshKey forces recompute after removals.
    void refreshKey;
    return listWishlistItems(userId)
      .slice()
      .sort((a, b) => String(b?.savedAt || "").localeCompare(String(a?.savedAt || "")));
  }, [userId, refreshKey]);

  const handleRemove = (tripId) => {
    const map = loadWishlistMap(userId);
    delete map[String(tripId)];
    saveWishlistMap(userId, map);
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="bg-background">
      <div className="max-w-screen-2xl mx-auto">
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">Wishlist</h1>
              <p className="text-base md:text-lg text-muted-foreground font-body">Items you saved to view later</p>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <Button
                variant="outline"
                iconName="LayoutDashboard"
                iconPosition="left"
                className="w-full md:w-auto"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </Button>
              <Button
                variant="default"
                iconName="Users"
                iconPosition="left"
                className="w-full md:w-auto"
                onClick={() => navigate("/community")}
              >
                Browse trips
              </Button>
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="bg-card rounded-xl border border-border elevation-1 p-6 md:p-8 text-center">
            <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Icon name="Heart" size={28} color="var(--color-accent)" />
            </div>
            <h2 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-2">No saved trips yet</h2>
            <p className="text-sm md:text-base text-muted-foreground font-body mb-5">
              Tap the heart on any trip in Community (or any activity) to add it here.
            </p>
            <Button variant="default" iconName="Users" iconPosition="left" onClick={() => navigate("/community")}
              >Browse Community</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {items.map((trip) => (
              <div key={trip.id} className="bg-card rounded-xl overflow-hidden elevation-1 border border-border">
                {trip.image ? (
                  <div className="relative h-44 overflow-hidden">
                    <Image src={trip.image} alt={trip.imageAlt} className="w-full h-full object-cover" />
                  </div>
                ) : null}

                <div className="p-4 md:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-lg font-heading font-semibold text-foreground truncate">{trip.title}</h3>
                      {trip.description ? (
                        <p className="text-sm text-muted-foreground font-body line-clamp-2 mt-1">{trip.description}</p>
                      ) : null}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Trash2"
                      className="flex-shrink-0"
                      onClick={() => handleRemove(trip.id)}
                      aria-label="Remove from wishlist"
                      title="Remove"
                    />
                  </div>

                  <div className="flex flex-wrap gap-3 mt-4 text-sm text-muted-foreground font-caption">
                    {trip.type !== "activity" && trip.cities != null ? (
                      <span className="inline-flex items-center gap-1">
                        <Icon name="MapPin" size={14} color="var(--color-primary)" />
                        {trip.cities} {trip.cities === 1 ? "city" : "cities"}
                      </span>
                    ) : null}
                    {trip.duration != null ? (
                      <span className="inline-flex items-center gap-1">
                        <Icon name="Calendar" size={14} color="var(--color-secondary)" />
                        {trip.duration}
                      </span>
                    ) : null}
                    {trip.budget != null ? (
                      <span className="inline-flex items-center gap-1">
                        <Icon name="DollarSign" size={14} color="var(--color-accent)" />
                        ${trip.budget}
                      </span>
                    ) : null}
                    {trip.type === "activity" && trip.category ? (
                      <span className="inline-flex items-center gap-1">
                        <Icon name="Tag" size={14} color="var(--color-primary)" />
                        {trip.category}
                      </span>
                    ) : null}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="default"
                      size="sm"
                      fullWidth
                      iconName="Eye"
                      iconPosition="left"
                      onClick={() => navigate(trip.type === "activity" ? "/activity-search" : "/community")}
                    >
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      iconName={trip.type === "activity" ? "Search" : "Users"}
                      onClick={() => navigate(trip.type === "activity" ? "/activity-search" : "/community")}
                      className="flex-shrink-0"
                      aria-label={trip.type === "activity" ? "Browse activities" : "Browse community"}
                      title={trip.type === "activity" ? "Browse" : "Browse"}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
