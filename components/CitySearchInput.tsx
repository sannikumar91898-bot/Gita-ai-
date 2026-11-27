// components/CitySearchInput.tsx
"use client";
import { useState, useEffect } from "react";

interface City {
  name: string;
  admin1?: string;
  country: string;
  latitude: number;
  longitude: number;
}

export default function CitySearchInput({ value, onChange, placeholder, className }: any) {
  const [query, setQuery] = useState(value || "");
  const [cities, setCities] = useState<City[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length < 3) {
        setCities([]);
        return;
      }
      setIsLoading(true);
      try {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?count=5&format=json&name=${encodeURIComponent(query)}`);
        const data = await res.json();
        setCities(data.results || []);
      } catch {
        setCities([]);
      }
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        placeholder={placeholder}
        className={className}
      />
      {showDropdown && query.length >= 3 && (
        <ul className="absolute z-50 w-full mt-1 bg-[#1e1e2d] border border-slate-700 rounded-xl max-h-52 overflow-y-auto shadow-2xl">
          {isLoading ? (
            <li className="p-3 text-gray-400 text-sm">Searching...</li>
          ) : cities.length > 0 ? (
            cities.map((city, i) => (
              <li
                key={i}
                onClick={() => {
                  const fullName = `${city.name}, ${city.admin1 ? `${city.admin1}, ` : ""}${city.country}`;
                  setQuery(fullName);
                  onChange(fullName);
                  setShowDropdown(false);
                }}
                className="p-3 text-white text-sm hover:bg-slate-700 cursor-pointer border-b border-slate-800 last:border-0"
              >
                📍 {city.name}, {city.admin1 ? `${city.admin1}, ` : ""}{city.country}
              </li>
            ))
          ) : (
            <li className="p-3 text-gray-500 text-sm">No city found</li>
          )}
        </ul>
      )}
    </div>
  );
}