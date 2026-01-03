import { jsPDF } from "jspdf";

async function fetchJson(url, token) {
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = data?.message || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  return data;
}

export async function fetchTripPackage({ baseUrl, token, tripId }) {
  const root = String(baseUrl).replace(/\/+$/, "");

  const [tripRes, citiesRes, activitiesRes, itineraryRes, budgetRes] = await Promise.all([
    fetchJson(`${root}/api/trips/${tripId}`, token),
    fetchJson(`${root}/api/trips/${tripId}/cities`, token),
    fetchJson(`${root}/api/trips/${tripId}/activities`, token),
    fetchJson(`${root}/api/trips/${tripId}/itinerary`, token),
    fetchJson(`${root}/api/trips/${tripId}/budget`, token),
  ]);

  // APIs return { success, ... } for most endpoints
  const trip = tripRes?.trip ?? tripRes?.data ?? tripRes?.trip ?? tripRes;
  const cities = citiesRes?.cities ?? citiesRes?.data ?? citiesRes;
  const activities = activitiesRes?.activities ?? activitiesRes?.data ?? activitiesRes;
  const itinerary = itineraryRes?.itinerary ?? itineraryRes?.data ?? itineraryRes;
  const budget = budgetRes?.budget ?? budgetRes?.data ?? budgetRes;

  return {
    exportedAt: new Date().toISOString(),
    trip,
    cities,
    activities,
    itinerary,
    budget,
  };
}

export function activitiesToCsv(pkg) {
  const rows = Array.isArray(pkg?.activities) ? pkg.activities : [];
  const header = [
    "activityName",
    "category",
    "activityDate",
    "startTime",
    "endTime",
    "cityId",
    "cost",
    "notes",
  ];

  const esc = (v) => {
    const s = v === null || v === undefined ? "" : String(v);
    const needs = /[\n\r,\"]/g.test(s);
    const out = s.replace(/\"/g, '""');
    return needs ? `"${out}"` : out;
  };

  const lines = [header.join(",")];
  for (const a of rows) {
    lines.push(
      [
        a.activityName,
        a.category,
        a.activityDate,
        a.startTime,
        a.endTime,
        a.cityId,
        a.cost,
        a.notes,
      ]
        .map(esc)
        .join(",")
    );
  }

  return lines.join("\n");
}

function wrapText(doc, text, maxWidth) {
  return doc.splitTextToSize(String(text || ""), maxWidth);
}

export function tripPackageToPdf(pkg) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 48;
  const maxWidth = pageWidth - margin * 2;

  let y = margin;

  const title = pkg?.trip?.tripName || pkg?.trip?.trip_name || "Trip Plan";
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(title, margin, y);
  y += 22;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const dateLine = `Exported: ${new Date(pkg?.exportedAt || Date.now()).toLocaleString()}`;
  doc.text(dateLine, margin, y);
  y += 18;

  const start = pkg?.trip?.startDate || pkg?.trip?.start_date;
  const end = pkg?.trip?.endDate || pkg?.trip?.end_date;
  if (start || end) {
    doc.text(`Dates: ${start || ""}${start && end ? " – " : ""}${end || ""}`, margin, y);
    y += 16;
  }

  const desc = pkg?.trip?.description;
  if (desc) {
    const lines = wrapText(doc, desc, maxWidth);
    doc.text(lines, margin, y);
    y += lines.length * 14 + 8;
  }

  const cities = Array.isArray(pkg?.cities) ? pkg.cities : [];
  if (cities.length) {
    doc.setFont("helvetica", "bold");
    doc.text("Cities", margin, y);
    y += 16;
    doc.setFont("helvetica", "normal");
    for (const c of cities.slice(0, 20)) {
      const name = c.cityName || c.city_name || "";
      const country = c.country || "";
      const line = `• ${name}${country ? ", " + country : ""}`;
      const lines = wrapText(doc, line, maxWidth);
      doc.text(lines, margin, y);
      y += lines.length * 14;
      if (y > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
      }
    }
    y += 6;
  }

  const itinerary = pkg?.itinerary?.daywise || pkg?.itinerary?.dayWise || [];
  if (Array.isArray(itinerary) && itinerary.length) {
    doc.setFont("helvetica", "bold");
    doc.text("Itinerary (Daywise)", margin, y);
    y += 16;
    doc.setFont("helvetica", "normal");

    for (const day of itinerary.slice(0, 50)) {
      const header = `${day.date || ""}${day.city ? " • " + day.city : ""}`;
      doc.setFont("helvetica", "bold");
      doc.text(wrapText(doc, header, maxWidth), margin, y);
      y += 14;
      doc.setFont("helvetica", "normal");

      const acts = Array.isArray(day.activities) ? day.activities : [];
      for (const a of acts.slice(0, 12)) {
        const time = a.startTime && a.endTime ? `${a.startTime}-${a.endTime} ` : a.startTime ? `${a.startTime} ` : "";
        const line = `  - ${time}${a.activityName || ""}`;
        const lines = wrapText(doc, line, maxWidth);
        doc.text(lines, margin, y);
        y += lines.length * 14;
        if (y > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          y = margin;
        }
      }
      y += 6;
      if (y > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
      }
    }
  }

  return doc;
}
