/**
 * Watch-party venue map (Home, both locales). Renders a Leaflet/OSM map with
 * ALL venues marked by default; the 📍 buttons in the list focus a venue, and
 * the "find closest to me" control locates the nearest one — via browser
 * geolocation when granted, else a typed address geocoded with Nominatim.
 */
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Venue {
  name: string;
  lat: number;
  lng: number;
}

interface Strings {
  addrPlaceholder: string;
  addrGo: string;
  searching: string;
  notFound: string;
  closest: string;
  you: string;
}

const VENUE_STYLE: L.CircleMarkerOptions = {
  radius: 9,
  color: '#3ec1ff',
  weight: 2,
  fillColor: '#3ec1ff',
  fillOpacity: 0.55,
};
const YOU_STYLE: L.CircleMarkerOptions = {
  radius: 8,
  color: '#ffb92e',
  weight: 2,
  fillColor: '#ffb92e',
  fillOpacity: 0.9,
};

/** Great-circle distance in km (haversine). */
function distanceKm(a: L.LatLngLiteral, b: L.LatLngLiteral): number {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLng = (b.lng - a.lng) * rad;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

export function initVenueMap(): void {
  const el = document.querySelector<HTMLElement>('[data-venue-map]');
  if (!el) return;
  const venues: Venue[] = JSON.parse(el.dataset.venues!);
  const t: Strings = JSON.parse(el.dataset.strings!);
  if (venues.length === 0) return;

  const map = L.map(el, { scrollWheelZoom: false });
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
  }).addTo(map);

  const markers = venues.map((v) =>
    L.circleMarker([v.lat, v.lng], VENUE_STYLE)
      .addTo(map)
      .bindPopup(`<strong>${escapeHtml(v.name)}</strong>`),
  );
  const allBounds = L.latLngBounds(venues.map((v) => [v.lat, v.lng] as [number, number]));
  const fitAll = () => map.fitBounds(allBounds, { padding: [32, 32] });
  fitAll();
  // The stylesheet may land after init, resizing the container — re-measure.
  window.addEventListener('load', () => {
    map.invalidateSize();
    fitAll();
  });

  /* ── list 📍 buttons focus their venue ─────────────────────────────── */
  const pins = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-venue]'));
  const pressPin = (active: HTMLButtonElement | null) =>
    pins.forEach((p) => p.setAttribute('aria-pressed', String(p === active)));
  pins.forEach((pin) =>
    pin.addEventListener('click', () => {
      const v = venues[Number(pin.dataset.venue)];
      if (!v) return;
      map.flyTo([v.lat, v.lng], Math.max(map.getZoom(), 14));
      markers[Number(pin.dataset.venue)]?.openPopup();
      pressPin(pin);
      el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }),
  );

  /* ── find closest: geolocation first, typed address as fallback ────── */
  const findBtn = document.querySelector<HTMLButtonElement>('[data-find-closest]');
  const addrForm = document.querySelector<HTMLFormElement>('[data-addr-form]');
  const addrInput = document.querySelector<HTMLInputElement>('[data-addr-input]');
  const status = document.querySelector<HTMLElement>('[data-find-status]');
  let youMarker: L.CircleMarker | null = null;

  const setStatus = (msg: string) => {
    if (status) status.textContent = msg;
  };

  const showClosest = (you: L.LatLngLiteral) => {
    let best = 0;
    let bestKm = Infinity;
    venues.forEach((v, i) => {
      const km = distanceKm(you, v);
      if (km < bestKm) {
        bestKm = km;
        best = i;
      }
    });
    youMarker?.remove();
    youMarker = L.circleMarker([you.lat, you.lng], YOU_STYLE)
      .addTo(map)
      .bindTooltip(t.you, { permanent: true, direction: 'bottom', offset: [0, 8] });
    const v = venues[best]!;
    const km = bestKm < 10 ? bestKm.toFixed(1) : Math.round(bestKm).toString();
    setStatus(`${t.closest}: ${v.name} (${km} km)`);
    markers[best]!.openPopup();
    pressPin(pins[best] ?? null);
    map.fitBounds(
      L.latLngBounds([
        [you.lat, you.lng],
        [v.lat, v.lng],
      ]),
      { padding: [48, 48] },
    );
  };

  const revealAddressForm = () => {
    if (!addrForm) return;
    addrForm.hidden = false;
    addrInput?.focus();
  };

  findBtn?.addEventListener('click', () => {
    if (!navigator.geolocation) {
      revealAddressForm();
      return;
    }
    setStatus(t.searching);
    navigator.geolocation.getCurrentPosition(
      (pos) => showClosest({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {
        // Denied or unavailable — fall back to a typed address.
        setStatus('');
        revealAddressForm();
      },
      { timeout: 8000, maximumAge: 300000 },
    );
  });

  addrForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const q = addrInput?.value.trim();
    if (!q) return;
    setStatus(t.searching);
    try {
      // Bias results toward the venues' area without hard-bounding them.
      const b = allBounds.pad(2);
      const url =
        'https://nominatim.openstreetmap.org/search?format=json&limit=1' +
        `&viewbox=${b.getWest()},${b.getNorth()},${b.getEast()},${b.getSouth()}` +
        `&q=${encodeURIComponent(q)}`;
      const res = await fetch(url, { headers: { accept: 'application/json' } });
      const hits: Array<{ lat: string; lon: string }> = res.ok ? await res.json() : [];
      const hit = hits[0];
      if (!hit) {
        setStatus(t.notFound);
        return;
      }
      showClosest({ lat: Number(hit.lat), lng: Number(hit.lon) });
    } catch {
      setStatus(t.notFound);
    }
  });
}
