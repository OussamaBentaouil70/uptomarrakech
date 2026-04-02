"use client";

import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
  locations: string[];
  roomOptions: number[];
  selectedLocation?: string;
  selectedRooms?: string;
};

export function AccommodationFilters({
  locations,
  roomOptions,
  selectedLocation,
  selectedRooms,
}: Props) {
  const router = useRouter();
  const maxRooms = Math.max(1, ...roomOptions);
  const selectedRoomsNumber = Number(selectedRooms || 0);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(window.location.search);
    if (!value || value === "all") next.delete(key);
    else next.set(key, value);
    router.push(`/accommodation?${next.toString()}`);
  };

  return (
    <div className="ui-surface-soft mb-6 grid gap-5 p-4 md:grid-cols-[1.2fr_1fr]">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">Location</p>
        <Select
          value={selectedLocation ?? "all"}
          onValueChange={(v) => setParam("location", v ?? "all")}
        >
          <SelectTrigger className="h-11 w-full rounded-xl border-border/80 bg-white/90">
            <SelectValue placeholder="Filter by location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All locations</SelectItem>
            {locations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">Rooms</p>
          <button
            type="button"
            onClick={() => setParam("rooms", "")}
            className="text-xs text-zinc-500 transition-colors hover:text-zinc-800"
          >
            Reset
          </button>
        </div>
        <div className="rounded-xl border border-border/80 bg-white/90 p-3">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-zinc-600">Minimum rooms</span>
            <span className="font-semibold text-zinc-900">
              {selectedRoomsNumber > 0 ? `${selectedRoomsNumber}+` : "Any"}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={maxRooms}
            value={selectedRoomsNumber}
            onChange={(e) => setParam("rooms", e.target.value)}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-200 accent-zinc-900"
          />
          <div className="mt-1 flex justify-between text-xs text-zinc-500">
            <span>Any</span>
            <span>{maxRooms}+</span>
          </div>
        </div>
      </div>
    </div>
  );
}

