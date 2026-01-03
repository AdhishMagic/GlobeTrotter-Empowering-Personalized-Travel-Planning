import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Icon from "components/AppIcon";
import Image from "components/AppImage";

function getApiBaseUrl() {
  const raw = import.meta.env.VITE_API_URL || "http://localhost:5000";
  return String(raw).replace(/\/+$/, "");
}

export default function SharedTrip() {
  const { shareToken } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setIsLoading(true);
      setError("");
      try {
        const baseUrl = getApiBaseUrl();
        const res = await fetch(`${baseUrl}/api/shared/${shareToken}`);
        const json = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(json?.message || "Shared trip not available");
        }
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load shared trip");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [shareToken]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-body">Loading shared trip...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 py-10">
          <div className="bg-card rounded-xl border border-border elevation-1 p-8 text-center">
            <Icon name="AlertCircle" size={44} color="var(--color-error)" className="mx-auto mb-4" />
            <h1 className="text-2xl font-heading font-bold text-foreground mb-2">Trip link not available</h1>
            <p className="text-muted-foreground font-body">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const trip = data?.trip;
  const itinerary = data?.itinerary?.daywise || [];
  const cover = trip?.coverImage;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="bg-card rounded-xl border border-border elevation-1 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative h-64 md:h-80 lg:h-[420px] overflow-hidden">
              {cover ? (
                <Image src={cover} alt={trip?.tripName || "Trip cover"} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Icon name="Image" size={44} color="var(--color-muted-foreground)" />
                </div>
              )}
            </div>

            <div className="p-6 md:p-8 lg:p-10">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                {trip?.tripName || "Shared Trip"}
              </h1>
              {(trip?.startDate || trip?.endDate) && (
                <p className="text-sm md:text-base text-muted-foreground font-body mb-4">
                  {trip?.startDate || ""}
                  {trip?.startDate && trip?.endDate ? " – " : ""}
                  {trip?.endDate || ""}
                </p>
              )}
              {trip?.description && <p className="text-muted-foreground font-body">{trip.description}</p>}
            </div>
          </div>

          <div className="border-t border-border p-6 md:p-8">
            <h2 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-4">Itinerary</h2>

            {Array.isArray(itinerary) && itinerary.length ? (
              <div className="space-y-4">
                {itinerary.map((day, idx) => (
                  <div key={idx} className="p-4 rounded-lg border border-border bg-background">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <p className="text-sm md:text-base font-body font-medium text-foreground">
                        {day?.date || ""} {day?.city ? `• ${day.city}` : ""}
                      </p>
                      <span className="text-xs font-caption text-muted-foreground">
                        {Array.isArray(day?.activities) ? `${day.activities.length} activities` : ""}
                      </span>
                    </div>

                    {Array.isArray(day?.activities) && day.activities.length ? (
                      <div className="mt-3 space-y-2">
                        {day.activities.map((a, aIdx) => (
                          <div key={aIdx} className="flex items-start justify-between gap-3">
                            <p className="text-sm text-foreground font-body">
                              {a?.startTime && a?.endTime ? `${a.startTime}-${a.endTime} ` : a?.startTime ? `${a.startTime} ` : ""}
                              {a?.activityName}
                            </p>
                            {typeof a?.cost === "number" ? (
                              <p className="text-sm text-muted-foreground font-body">${a.cost}</p>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-muted-foreground font-body">No activities for this day.</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground font-body">No itinerary available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
