import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Layers,
  Compass,
  Info,
} from 'lucide-react';

interface RoomSpec {
  id: string;
  name: string;
  dimensions: string;
  area: string;
  status: 'Completed' | 'In Progress' | 'Pending Finishing';
  notes: string;
  x: string; // positioning percentage for interactive blueprint
  y: string;
  w: string;
  h: string;
  color: string;
}

export const HousePlanPage: React.FC = () => {
  const { activeFloor, setActiveFloor, project } = useApp();
  const [selectedRoom, setSelectedRoom] = useState<RoomSpec | null>(null);

  const groundFloorRooms: RoomSpec[] = [
    {
      id: 'GF-01',
      name: 'Double-Height Living Hall & Foyer',
      dimensions: '18 ft × 22 ft',
      area: '396 sq.ft.',
      status: 'In Progress',
      notes: 'AAC blockwork finished. Gypsum plaster prep underway; lintel alignment passed inspection.',
      x: '5%',
      y: '10%',
      w: '45%',
      h: '48%',
      color: 'bg-emerald-50 border-emerald-300 text-emerald-900',
    },
    {
      id: 'GF-02',
      name: 'Dining & Open Courtyard',
      dimensions: '14 ft × 16 ft',
      area: '224 sq.ft.',
      status: 'In Progress',
      notes: 'Central courtyard skylight beam casting verified with 28-day curing audit.',
      x: '53%',
      y: '10%',
      w: '42%',
      h: '38%',
      color: 'bg-teal-50 border-teal-300 text-teal-900',
    },
    {
      id: 'GF-03',
      name: 'Dry & Wet Kitchen with Utility',
      dimensions: '12 ft × 16 ft',
      area: '192 sq.ft.',
      status: 'In Progress',
      notes: 'Gas line piping route and sanitary plumbing drops installed.',
      x: '53%',
      y: '51%',
      w: '42%',
      h: '40%',
      color: 'bg-amber-50 border-amber-300 text-amber-900',
    },
    {
      id: 'GF-04',
      name: 'Guest Bedroom & Ensuite',
      dimensions: '14 ft × 15 ft',
      area: '210 sq.ft.',
      status: 'Completed',
      notes: 'Masonry complete. Window sill granite coping verified.',
      x: '5%',
      y: '61%',
      w: '45%',
      h: '30%',
      color: 'bg-stone-50 border-stone-300 text-stone-800',
    },
  ];

  const firstFloorRooms: RoomSpec[] = [
    {
      id: 'FF-01',
      name: 'Master Suite & Walk-In Wardrobe',
      dimensions: '16 ft × 20 ft',
      area: '320 sq.ft.',
      status: 'In Progress',
      notes: 'OBS-01: Chasing micro-fracture currently reinforced with polymer fiber mesh.',
      x: '5%',
      y: '10%',
      w: '48%',
      h: '46%',
      color: 'bg-amber-50 border-amber-400 text-amber-900',
    },
    {
      id: 'FF-02',
      name: 'Children’s Bedroom (Bed 02)',
      dimensions: '14 ft × 16 ft',
      area: '224 sq.ft.',
      status: 'In Progress',
      notes: 'Blockwork complete. Electrical wall grooves cut and conduits routed.',
      x: '56%',
      y: '10%',
      w: '39%',
      h: '38%',
      color: 'bg-teal-50 border-teal-300 text-teal-900',
    },
    {
      id: 'FF-03',
      name: 'Family Lounge & Library Overlook',
      dimensions: '14 ft × 14 ft',
      area: '196 sq.ft.',
      status: 'In Progress',
      notes: 'Mezzanine railing starter dowels checked for structural pullout strength.',
      x: '56%',
      y: '51%',
      w: '39%',
      h: '40%',
      color: 'bg-stone-50 border-stone-300 text-stone-800',
    },
    {
      id: 'FF-04',
      name: 'Open Sunset Deck & Terrace Garden',
      dimensions: '16 ft × 12 ft',
      area: '192 sq.ft.',
      status: 'Pending Finishing',
      notes: 'Polyurethane waterproofing screed scheduled under Milestone 06.',
      x: '5%',
      y: '59%',
      w: '48%',
      h: '32%',
      color: 'bg-emerald-50 border-emerald-300 text-emerald-900',
    },
  ];

  const currentRooms = activeFloor === 'ground' ? groundFloorRooms : firstFloorRooms;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-wensure-fine-divider pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-wensure-teal">
            Architectural Drawings & Location
          </span>
          <span className="text-xs text-wensure-muted-text font-mono">
            Sheet A-04 (G+1 Layout)
          </span>
        </div>
        <h1 className="font-display text-3xl text-wensure-ink">House Plan & Map</h1>
        <p className="text-xs sm:text-sm text-wensure-muted-text mt-1">
          {project.name} ({project.city}) • Interactive architectural floor layout matched to verified stage progress.
        </p>
      </div>

      {/* Illustrative Notice */}
      <div className="p-3.5 bg-wensure-soft-stone/70 border border-wensure-fine-divider rounded flex items-center gap-2.5 text-xs text-wensure-muted-text">
        <Info className="w-4 h-4 text-wensure-teal shrink-0" />
        <span>
          <strong>Illustrative Demo Material:</strong> Floor layout is calibrated for digital progress visualization and should not be used as an approved structural construction drawing.
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 cols: Interactive Floor Plan Drawing */}
        <div className="lg:col-span-8 bg-white rounded-lg border border-wensure-fine-divider p-6 space-y-6">
          {/* Controls Bar: Floor selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-wensure-fine-divider">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-wensure-ink">Select Floor:</span>
              <div className="inline-flex rounded-md p-1 bg-wensure-soft-stone border border-wensure-fine-divider">
                <button
                  onClick={() => {
                    setActiveFloor('ground');
                    setSelectedRoom(null);
                  }}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                    activeFloor === 'ground'
                      ? 'bg-wensure-ink text-white'
                      : 'text-wensure-muted-text hover:text-wensure-ink'
                  }`}
                >
                  Ground Floor (2,200 sq.ft)
                </button>
                <button
                  onClick={() => {
                    setActiveFloor('first');
                    setSelectedRoom(null);
                  }}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                    activeFloor === 'first'
                      ? 'bg-wensure-ink text-white'
                      : 'text-wensure-muted-text hover:text-wensure-ink'
                  }`}
                >
                  First Floor (2,000 sq.ft)
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-wensure-muted-text">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Verified Passed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Active Work</span>
              </div>
            </div>
          </div>

          {/* Blueprint Canvas Surface */}
          <div className="relative w-full h-[480px] bg-stone-900 rounded-lg border-2 border-stone-800 p-6 overflow-hidden flex flex-col justify-between shadow-inner">
            {/* Grid Pattern Overlay */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }}
            />

            {/* Top Blueprint Details Header */}
            <div className="relative z-10 flex items-center justify-between text-stone-400 text-xs font-mono">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-wensure-teal" />
                <span>NORTH ORIENTED • GRID AXIS B-D / 1-4</span>
              </div>
              <span className="text-[11px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded">
                SCALE: 1:100 ARCH
              </span>
            </div>

            {/* Interactive Room Modules */}
            <div className="relative z-10 flex-1 my-4 relative">
              {currentRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  style={{
                    left: room.x,
                    top: room.y,
                    width: room.w,
                    height: room.h,
                  }}
                  className={`absolute rounded border-2 transition-all duration-200 p-3 text-left flex flex-col justify-between group cursor-pointer ${
                    room.color
                  } ${
                    selectedRoom?.id === room.id
                      ? 'ring-2 ring-wensure-teal shadow-lg scale-[1.02] z-20'
                      : 'hover:brightness-105'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold tracking-wider uppercase opacity-80">
                        {room.id}
                      </span>
                      <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-white/70">
                        {room.status}
                      </span>
                    </div>
                    <p className="font-semibold text-xs mt-1 truncate">
                      {room.name}
                    </p>
                  </div>
                  <div className="text-[10px] font-mono font-medium opacity-90">
                    {room.dimensions} ({room.area})
                  </div>
                </button>
              ))}
            </div>

            {/* Bottom Status text */}
            <div className="relative z-10 text-[11px] text-stone-400 flex items-center justify-between font-mono pt-2 border-t border-stone-800">
              <span>CLICK ANY ROOM TO INSPECT AUDIT STATUS</span>
              <span>WENSURE RESIDENCE • BANER</span>
            </div>
          </div>

          {/* Selected Room Detail Drawer / Card */}
          {selectedRoom ? (
            <div className="p-4 rounded bg-wensure-soft-stone border border-wensure-fine-divider space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-wensure-teal">
                    {selectedRoom.id} Selected Room Analysis
                  </span>
                  <h4 className="font-semibold text-sm text-wensure-ink">
                    {selectedRoom.name} ({selectedRoom.dimensions})
                  </h4>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-white border border-wensure-fine-divider text-wensure-ink">
                  {selectedRoom.status}
                </span>
              </div>
              <p className="text-xs text-wensure-muted-text leading-relaxed">
                {selectedRoom.notes}
              </p>
            </div>
          ) : (
            <div className="text-xs text-wensure-muted-text italic text-center py-2">
              Select any room module in the architectural canvas above to inspect specific quality audit notes.
            </div>
          )}
        </div>

        {/* Right 4 cols: Pune Location & Map Panel */}
        <div className="lg:col-span-4 space-y-6">
          {/* Location Panel */}
          <div className="bg-white rounded-lg border border-wensure-fine-divider p-6 space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-wensure-teal" />
              <h3 className="font-semibold text-sm text-wensure-ink uppercase tracking-wider">
                Geographic Site Location
              </h3>
            </div>

            {/* Realistic stylized map visual */}
            <div className="relative h-56 rounded bg-stone-200 overflow-hidden border border-wensure-fine-divider">
              <img
                src="https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80"
                alt="Pune City Aerial — Baner Locality"
                className="w-full h-full object-cover filter brightness-90 contrast-105"
              />
              <div className="absolute inset-0 bg-wensure-forest/30" />

              {/* Pin Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-wensure-ink text-white px-3 py-1.5 rounded-full shadow-2xl border border-wensure-teal flex items-center gap-2 text-xs font-semibold animate-bounce">
                  <span className="w-2 h-2 rounded-full bg-wensure-teal" />
                  <span>Plot 42, Baner, Pune</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-wensure-muted-text block">Plot Identification</span>
                <span className="font-medium text-wensure-ink">Plot 42, Green Glen Enclave, Baner Road</span>
              </div>
              <div>
                <span className="text-wensure-muted-text block">Municipal Ward</span>
                <span className="font-medium text-wensure-ink">Pune Municipal Corporation (PMC), Zone 3</span>
              </div>
              <div>
                <span className="text-wensure-muted-text block">Coordinates</span>
                <span className="font-mono text-stone-700">18.5590° N, 73.7868° E</span>
              </div>
              <div>
                <span className="text-wensure-muted-text block">Assigned WENSURE Field Hub</span>
                <span className="font-medium text-wensure-teal">Baner Quality Audit Command (8 mins response)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
