import { useState, useCallback, useEffect, useMemo } from 'react';
import { Map, MapControls, MapMarker, MarkerContent, MapRoute, useMap } from "@/components/ui/map";
import { AppLayout } from "@/components/layout/AppLayout";
import { RoutePanel } from "@/features/routes/RoutePanel";
import { Traffic } from "@/components/TrafficLayer";
import { useRouteStore } from "@/stores/routeStore";
import { reverseGeocode } from "@/lib/api/tomtom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import './App.css';

function StopMarker({ sequence, isSelected, priority }: { sequence: number; isSelected?: boolean; priority?: string }) {
  const priorityColors = {
    high: 'bg-red-500',
    medium: 'bg-primary',
    low: 'bg-gray-400',
  };

  const bgColor = priority ? priorityColors[priority as keyof typeof priorityColors] : 'bg-primary';

  return (
    <div
      className={`
        flex items-center justify-center w-8 h-8 rounded-full 
        font-bold text-sm shadow-lg border-2 border-white
        transition-transform hover:scale-110 text-white
        ${isSelected
          ? 'bg-blue-600 ring-2 ring-blue-300 scale-110'
          : bgColor
        }
      `}
    >
      {sequence}
    </div>
  );
}

function MapClickHandler({ enabled, onMapClick }: { enabled: boolean; onMapClick: (lat: number, lng: number) => void }) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded || !enabled) return;

    const handleClick = (e: { lngLat: { lng: number; lat: number } }) => {
      onMapClick(e.lngLat.lat, e.lngLat.lng);
    };

    map.on('click', handleClick);
    map.getCanvas().style.cursor = 'crosshair';

    return () => {
      map.off('click', handleClick);
      map.getCanvas().style.cursor = '';
    };
  }, [map, isLoaded, enabled, onMapClick]);

  return null;
}

function App() {
  const [addingByClick, setAddingByClick] = useState(false);
  const stops = useRouteStore((s) => s.stops);
  const selectedStopId = useRouteStore((s) => s.selectedStopId);
  const selectStop = useRouteStore((s) => s.selectStop);
  const addStop = useRouteStore((s) => s.addStop);
  const settings = useRouteStore((s) => s.optimizationSettings);

  const handleMapClick = useCallback(async (lat: number, lng: number) => {
    // Try to reverse geocode the clicked location
    const address = await reverseGeocode(lat, lng);

    addStop({
      address: address || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
      latitude: lat,
      longitude: lng,
    });
    setAddingByClick(false);
  }, [addStop]);

  // Calculate center from stops or default to NYC
  const center: [number, number] = useMemo(() => {
    if (stops.length > 0) {
      return [
        stops.reduce((sum, s) => sum + s.longitude, 0) / stops.length,
        stops.reduce((sum, s) => sum + s.latitude, 0) / stops.length,
      ];
    }
    return [-74.006, 40.7128];
  }, [stops]);

  // Build route coordinates for polyline
  const routeCoordinates: [number, number][] = useMemo(() => {
    const coords = stops.map(s => [s.longitude, s.latitude] as [number, number]);
    // If round trip, add first stop at end
    if (settings.roundTrip && coords.length >= 2) {
      coords.push(coords[0]);
    }
    return coords;
  }, [stops, settings.roundTrip]);

  return (
    <TooltipProvider>
      <AppLayout
        sidebar={
          <RoutePanel
            onAddByMapClick={() => setAddingByClick(!addingByClick)}
          />
        }
      >
        {/* Map Container */}
        <div className="h-full w-full relative">
          {/* Click to add indicator */}
          {addingByClick && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg text-sm font-medium animate-pulse">
              Click on the map to add a stop
            </div>
          )}

          <Map
            center={center}
            zoom={stops.length > 0 ? 12 : 11}
          >
            <MapControls position="bottom-right" showZoom showLocate showFullscreen />
            <MapClickHandler enabled={addingByClick} onMapClick={handleMapClick} />

            {/* Traffic Layer with Controls */}
            <Traffic controlsPosition="top-left" />

            {/* Route Line */}
            {routeCoordinates.length >= 2 && (
              <MapRoute
                coordinates={routeCoordinates}
                color="#3b82f6"
                width={4}
                opacity={0.8}
              />
            )}

            {/* Stop Markers */}
            {stops.map((stop) => (
              <MapMarker
                key={stop.id}
                longitude={stop.longitude}
                latitude={stop.latitude}
                onClick={() => selectStop(stop.id)}
              >
                <MarkerContent>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <StopMarker
                          sequence={stop.sequence}
                          isSelected={selectedStopId === stop.id}
                          priority={stop.priority}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-medium">Stop {stop.sequence}</p>
                      <p className="text-xs text-muted-foreground">{stop.address}</p>
                      {stop.priority && (
                        <p className="text-xs mt-1 capitalize">{stop.priority} priority</p>
                      )}
                      {stop.timeWindowStart && stop.timeWindowEnd && (
                        <p className="text-xs">{stop.timeWindowStart} - {stop.timeWindowEnd}</p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </MarkerContent>
              </MapMarker>
            ))}
          </Map>
        </div>
      </AppLayout>
    </TooltipProvider>
  );
}

export default App;
