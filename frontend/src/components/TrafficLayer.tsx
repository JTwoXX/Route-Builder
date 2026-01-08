import { useEffect, useState } from 'react';
import { useMap } from '@/components/ui/map';
import { getTrafficFlowTileUrl, getTrafficIncidentsTileUrl, isTomTomConfigured } from '@/lib/api/tomtom';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Car, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrafficLayerProps {
  /** Whether the traffic flow layer is visible */
  showFlow?: boolean;
  /** Whether the traffic incidents layer is visible */
  showIncidents?: boolean;
  /** Opacity of the traffic layers (0-1) */
  opacity?: number;
}

/**
 * TrafficLayer component adds TomTom traffic layers to the map
 * Must be used inside a Map component
 */
export function TrafficLayer({
  showFlow = true,
  showIncidents = true,
  opacity = 0.7,
}: TrafficLayerProps) {
  const { map, isLoaded } = useMap();
  const FLOW_SOURCE_ID = 'tomtom-traffic-flow';
  const FLOW_LAYER_ID = 'tomtom-traffic-flow-layer';
  const INCIDENTS_SOURCE_ID = 'tomtom-traffic-incidents';
  const INCIDENTS_LAYER_ID = 'tomtom-traffic-incidents-layer';

  // Add traffic flow layer
  useEffect(() => {
    if (!isLoaded || !map || !isTomTomConfigured()) return;

    const flowTileUrl = getTrafficFlowTileUrl();
    if (!flowTileUrl) return;

    // Add traffic flow source
    if (!map.getSource(FLOW_SOURCE_ID)) {
      map.addSource(FLOW_SOURCE_ID, {
        type: 'raster',
        tiles: [flowTileUrl],
        tileSize: 256,
        attribution: '&copy; <a href="https://www.tomtom.com/">TomTom</a>',
      });
    }

    // Add traffic flow layer
    if (!map.getLayer(FLOW_LAYER_ID)) {
      // Find the first symbol layer to insert traffic below labels
      const layers = map.getStyle().layers;
      let firstSymbolId: string | undefined;
      for (const layer of layers) {
        if (layer.type === 'symbol') {
          firstSymbolId = layer.id;
          break;
        }
      }

      map.addLayer(
        {
          id: FLOW_LAYER_ID,
          type: 'raster',
          source: FLOW_SOURCE_ID,
          paint: {
            'raster-opacity': showFlow ? opacity : 0,
          },
        },
        firstSymbolId // Insert below labels
      );
    }

    return () => {
      try {
        if (map.getLayer(FLOW_LAYER_ID)) {
          map.removeLayer(FLOW_LAYER_ID);
        }
        if (map.getSource(FLOW_SOURCE_ID)) {
          map.removeSource(FLOW_SOURCE_ID);
        }
      } catch {
        // Map might be removed already
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, map]);

  // Add traffic incidents layer
  useEffect(() => {
    if (!isLoaded || !map || !isTomTomConfigured()) return;

    const incidentsTileUrl = getTrafficIncidentsTileUrl();
    if (!incidentsTileUrl) return;

    // Add traffic incidents source
    if (!map.getSource(INCIDENTS_SOURCE_ID)) {
      map.addSource(INCIDENTS_SOURCE_ID, {
        type: 'raster',
        tiles: [incidentsTileUrl],
        tileSize: 256,
        attribution: '&copy; <a href="https://www.tomtom.com/">TomTom</a>',
      });
    }

    // Add traffic incidents layer
    if (!map.getLayer(INCIDENTS_LAYER_ID)) {
      map.addLayer({
        id: INCIDENTS_LAYER_ID,
        type: 'raster',
        source: INCIDENTS_SOURCE_ID,
        paint: {
          'raster-opacity': showIncidents ? opacity : 0,
        },
      });
    }

    return () => {
      try {
        if (map.getLayer(INCIDENTS_LAYER_ID)) {
          map.removeLayer(INCIDENTS_LAYER_ID);
        }
        if (map.getSource(INCIDENTS_SOURCE_ID)) {
          map.removeSource(INCIDENTS_SOURCE_ID);
        }
      } catch {
        // Map might be removed already
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, map]);

  // Update flow layer visibility
  useEffect(() => {
    if (!isLoaded || !map || !map.getLayer(FLOW_LAYER_ID)) return;
    map.setPaintProperty(FLOW_LAYER_ID, 'raster-opacity', showFlow ? opacity : 0);
  }, [isLoaded, map, showFlow, opacity]);

  // Update incidents layer visibility
  useEffect(() => {
    if (!isLoaded || !map || !map.getLayer(INCIDENTS_LAYER_ID)) return;
    map.setPaintProperty(INCIDENTS_LAYER_ID, 'raster-opacity', showIncidents ? opacity : 0);
  }, [isLoaded, map, showIncidents, opacity]);

  return null;
}

interface TrafficControlsProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

const positionClasses = {
  'top-left': 'top-2 left-2',
  'top-right': 'top-2 right-2',
  'bottom-left': 'bottom-2 left-2',
  'bottom-right': 'bottom-10 right-2',
};

/**
 * TrafficControls component provides UI controls for the traffic layer
 * Should be placed outside the Map component but within the same container
 */
export function TrafficControls({ position = 'top-left', className }: TrafficControlsProps) {
  const [showFlow, setShowFlow] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const isConfigured = isTomTomConfigured();

  if (!isConfigured) {
    return null;
  }

  return (
    <>
      {/* Traffic Toggle Button */}
      <div
        className={cn(
          'absolute z-10 flex flex-col gap-1.5',
          positionClasses[position],
          className
        )}
      >
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'bg-background shadow-sm gap-1.5',
              (showFlow || showIncidents) && 'text-primary'
            )}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Car className="h-4 w-4" />
            Traffic
          </Button>

          {/* Dropdown */}
          {isExpanded && (
            <div className="absolute top-full left-0 mt-1 w-48 rounded-md border bg-popover p-2 shadow-md">
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showFlow}
                    onChange={(e) => setShowFlow(e.target.checked)}
                    className="rounded border-input"
                  />
                  <span className="text-sm">Traffic Flow</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showIncidents}
                    onChange={(e) => setShowIncidents(e.target.checked)}
                    className="rounded border-input"
                  />
                  <span className="text-sm">Incidents</span>
                </label>
              </div>
              <div className="mt-2 pt-2 border-t">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-3 h-1 bg-green-500 rounded" />
                  <span>Free flow</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-3 h-1 bg-yellow-500 rounded" />
                  <span>Moderate</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-3 h-1 bg-orange-500 rounded" />
                  <span>Heavy</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-3 h-1 bg-red-500 rounded" />
                  <span>Severe</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* The actual traffic layer will be controlled by a context or prop */}
    </>
  );
}

/**
 * Combined Traffic component with both layer and controls
 */
interface TrafficProps {
  controlsPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export function Traffic({ controlsPosition = 'top-left' }: TrafficProps) {
  const [showFlow, setShowFlow] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isLoaded } = useMap();
  const isConfigured = isTomTomConfigured();

  useEffect(() => {
    if (isLoaded) {
      // Give the map a moment to render the traffic tiles
      const timer = setTimeout(() => setIsLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  return (
    <>
      <TrafficLayer showFlow={showFlow} showIncidents={showIncidents} />

      {/* Traffic Control UI */}
      {isConfigured && (
        <div
          className={cn(
            'absolute z-10 flex flex-col gap-1.5',
            positionClasses[controlsPosition]
          )}
        >
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                'bg-background shadow-sm gap-1.5',
                (showFlow || showIncidents) && 'text-primary border-primary'
              )}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isLoading && (showFlow || showIncidents) ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Car className="h-4 w-4" />
              )}
              Traffic
            </Button>

            {/* Dropdown */}
            {isExpanded && (
              <div className="absolute top-full left-0 mt-1 w-48 rounded-md border bg-popover p-2 shadow-md">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-accent rounded px-1">
                    <input
                      type="checkbox"
                      checked={showFlow}
                      onChange={(e) => setShowFlow(e.target.checked)}
                      className="rounded border-input"
                    />
                    <span className="text-sm">Traffic Flow</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-accent rounded px-1">
                    <input
                      type="checkbox"
                      checked={showIncidents}
                      onChange={(e) => setShowIncidents(e.target.checked)}
                      className="rounded border-input"
                    />
                    <AlertTriangle className="h-3 w-3 text-orange-500" />
                    <span className="text-sm">Incidents</span>
                  </label>
                </div>
                <div className="mt-2 pt-2 border-t">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Legend</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-4 h-1.5 bg-green-500 rounded" />
                    <span>Free flow</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-4 h-1.5 bg-yellow-500 rounded" />
                    <span>Moderate</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-4 h-1.5 bg-orange-500 rounded" />
                    <span>Heavy</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-4 h-1.5 bg-red-600 rounded" />
                    <span>Severe / Standstill</span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t">
                  <p className="text-[10px] text-muted-foreground">
                    Powered by TomTom
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
