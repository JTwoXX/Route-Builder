import { useState } from 'react';
import { Route, Sparkles, Trash2, Save, Download, Settings, MapPin, Truck, FolderOpen, ChevronDown, Plus, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CollapsibleSection } from '@/components/ui/collapsible-section';
import { useRouteStore } from '@/stores/routeStore';
import { StopCard } from './StopCard';
import { AddStopForm } from './AddStopForm';
import { StartLocationForm } from './StartLocationForm';
import { OptimizationPanel } from './OptimizationPanel';
import { SaveRouteDialog } from './SaveRouteDialog';

interface RoutePanelProps {
    onAddByMapClick?: () => void;
    onRouteOptimized?: () => void;
}

function RouteStatsDisplay({ stops, startLocation, optimizedDistance, optimizedDuration }: {
    stops: { latitude: number; longitude: number; serviceTime?: number }[];
    startLocation?: { latitude: number; longitude: number } | null;
    optimizedDistance?: number;
    optimizedDuration?: number;
}) {
    const hasRoute = startLocation && stops.length >= 1;

    let totalDistanceMiles = optimizedDistance;
    let travelDuration = optimizedDuration;

    if (totalDistanceMiles === undefined && hasRoute) {
        const allPoints = [
            { longitude: startLocation.longitude, latitude: startLocation.latitude },
            ...stops
        ];

        let totalDistanceKm = 0;
        for (let i = 1; i < allPoints.length; i++) {
            const dx = allPoints[i].longitude - allPoints[i - 1].longitude;
            const dy = allPoints[i].latitude - allPoints[i - 1].latitude;
            totalDistanceKm += Math.sqrt(dx * dx + dy * dy) * 111;
        }
        totalDistanceMiles = totalDistanceKm * 0.621371;
        travelDuration = Math.round(totalDistanceKm * 2);
    }

    const totalServiceTime = stops.reduce((sum, s) => sum + (s.serviceTime || 0), 0);
    const totalDuration = (travelDuration || 0) + totalServiceTime;

    if (!hasRoute) return null;

    return (
        <div className="grid grid-cols-2 gap-2 p-2 bg-muted/50 rounded-lg text-sm">
            <div>
                <span className="text-muted-foreground">Distance:</span>
                <span className="ml-1 font-medium">{(totalDistanceMiles ?? 0).toFixed(1)} mi</span>
            </div>
            <div>
                <span className="text-muted-foreground">Travel:</span>
                <span className="ml-1 font-medium">{travelDuration || 0} min</span>
            </div>
            <div>
                <span className="text-muted-foreground">Total:</span>
                <span className="ml-1 font-medium">{totalDuration} min</span>
            </div>
            <div>
                <span className="text-muted-foreground">Stop Time:</span>
                <span className="ml-1 font-medium">{totalServiceTime} min</span>
            </div>
        </div>
    );
}

function RouteSelector() {
    const [showList, setShowList] = useState(false);
    const currentRoute = useRouteStore((s) => s.currentRoute);
    const routes = useRouteStore((s) => s.routes);
    const loadRoute = useRouteStore((s) => s.loadRoute);
    const newRoute = useRouteStore((s) => s.newRoute);
    const stops = useRouteStore((s) => s.stops);

    return (
        <div className="border-b">
            <div
                className="p-3 flex items-center justify-between cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => setShowList(!showList)}
            >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                    <FolderOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                        <p className="font-medium text-sm truncate">
                            {currentRoute ? currentRoute.name : 'Unsaved Route'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {stops.length} stop{stops.length !== 1 ? 's' : ''} • {routes.length} saved
                        </p>
                    </div>
                </div>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${showList ? 'rotate-180' : ''}`} />
            </div>

            {showList && (
                <div className="border-t bg-muted/30">
                    <div className="p-2 max-h-48 overflow-auto">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start mb-1 text-primary"
                            onClick={() => { newRoute(); setShowList(false); }}
                        >
                            <Plus className="h-3 w-3 mr-2" />
                            New Route
                        </Button>

                        {routes.length === 0 ? (
                            <p className="text-xs text-muted-foreground text-center py-2">No saved routes</p>
                        ) : (
                            routes.map((route) => (
                                <Button
                                    key={route.id}
                                    variant={currentRoute?.id === route.id ? "secondary" : "ghost"}
                                    size="sm"
                                    className="w-full justify-start text-left"
                                    onClick={() => { loadRoute(route); setShowList(false); }}
                                >
                                    <span className="truncate">{route.name}</span>
                                    <span className="ml-auto text-xs text-muted-foreground">{route.stops.length}</span>
                                </Button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export function RoutePanel({ onAddByMapClick, onRouteOptimized }: RoutePanelProps) {
    const [saveDialogOpen, setSaveDialogOpen] = useState(false);

    const stops = useRouteStore((s) => s.stops);
    const currentRoute = useRouteStore((s) => s.currentRoute);
    const startLocation = useRouteStore((s) => s.startLocation);
    const selectedStopId = useRouteStore((s) => s.selectedStopId);
    const isOptimizing = useRouteStore((s) => s.isOptimizing);
    const optimizedDistance = useRouteStore((s) => s.optimizedDistance);
    const optimizedDuration = useRouteStore((s) => s.optimizedDuration);
    const selectStop = useRouteStore((s) => s.selectStop);
    const removeStop = useRouteStore((s) => s.removeStop);
    const updateStop = useRouteStore((s) => s.updateStop);
    const clearStops = useRouteStore((s) => s.clearStops);
    const optimizeRouteStore = useRouteStore((s) => s.optimizeRoute);

    const handleOptimizeRoute = async () => {
        await optimizeRouteStore();
        onRouteOptimized?.();
    };

    return (
        <>
            <div className="flex h-full flex-col">
                <RouteSelector />

                <Tabs defaultValue="stops" className="flex flex-1 flex-col overflow-hidden">
                    <div className="px-3 py-2">
                        <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="stops" className="text-xs">
                            <MapPin className="h-3 w-3 mr-1" />
                            Stops
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="text-xs">
                            <Settings className="h-3 w-3 mr-1" />
                            Settings
                        </TabsTrigger>
                        <TabsTrigger value="vehicles" className="text-xs">
                            <Truck className="h-3 w-3 mr-1" />
                            Fleet
                        </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="stops" className="flex-1 overflow-hidden flex flex-col m-0">
                        {/* Scrollable content area */}
                        <div className="flex-1 overflow-hidden flex flex-col">
                            <ScrollArea className="flex-1">
                                {/* Collapsible: Start Location */}
                                <CollapsibleSection
                                    title="Start Location"
                                    icon={<Home className="h-3.5 w-3.5" />}
                                    defaultExpanded={true}
                                >
                                    <StartLocationForm />
                                </CollapsibleSection>

                                {/* Collapsible: Add Stops */}
                                <CollapsibleSection
                                    title="Add Stops"
                                    icon={<Route className="h-3.5 w-3.5" />}
                                    defaultExpanded={false}
                                >
                                    <AddStopForm onAddByClick={onAddByMapClick} />
                                </CollapsibleSection>

                                {/* Stops List */}
                                <div className="border-b">
                                    <div className="px-3 py-2 flex items-center justify-between bg-muted/30">
                                        <span className="text-sm font-medium">
                                            {stops.length} stop{stops.length !== 1 ? 's' : ''}
                                        </span>
                                        {stops.length > 0 && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-destructive hover:text-destructive h-7 text-xs"
                                                onClick={clearStops}
                                            >
                                                <Trash2 className="h-3 w-3 mr-1" />
                                                Clear
                                            </Button>
                                        )}
                                    </div>

                                    <div className="p-3 space-y-2">
                                        {stops.length === 0 ? (
                                            <div className="text-center py-6 text-muted-foreground">
                                                <Route className="h-10 w-10 mx-auto mb-2 opacity-20" />
                                                <p className="text-sm">No stops added yet</p>
                                                <p className="text-xs mt-1">Expand "Add Stops" above</p>
                                            </div>
                                        ) : (
                                            stops.map((stop) => (
                                                <StopCard
                                                    key={stop.id}
                                                    stop={stop}
                                                    isSelected={selectedStopId === stop.id}
                                                    onSelect={() => selectStop(stop.id)}
                                                    onRemove={() => removeStop(stop.id)}
                                                    onUpdateServiceTime={(minutes) => updateStop(stop.id, { serviceTime: minutes })}
                                                />
                                            ))
                                        )}
                                    </div>
                                </div>
                            </ScrollArea>
                        </div>

                        {/* Pinned Stats & Actions - Always visible */}
                        <div className="border-t bg-card p-3 space-y-2 flex-shrink-0">
                            <RouteStatsDisplay
                                stops={stops}
                                startLocation={startLocation}
                                optimizedDistance={optimizedDistance ?? undefined}
                                optimizedDuration={optimizedDuration ?? undefined}
                            />

                            <Button
                                className="w-full"
                                size="sm"
                                onClick={handleOptimizeRoute}
                                disabled={isOptimizing || !startLocation || stops.length === 0}
                            >
                                <Sparkles className="h-4 w-4 mr-2" />
                                {isOptimizing ? 'Optimizing...' : !startLocation ? 'Set Start Location' : stops.length === 0 ? 'Add Stops' : 'Optimize Route'}
                            </Button>

                            {stops.length > 0 && (
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        size="sm"
                                        onClick={() => setSaveDialogOpen(true)}
                                    >
                                        <Save className="h-3 w-3 mr-1" />
                                        {currentRoute ? 'Update' : 'Save'}
                                    </Button>
                                    <Button variant="outline" className="flex-1" size="sm">
                                        <Download className="h-3 w-3 mr-1" />
                                        Export
                                    </Button>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="settings" className="flex-1 overflow-auto m-0 flex flex-col justify-start">
                        <OptimizationPanel />
                    </TabsContent>

                    <TabsContent value="vehicles" className="flex-1 overflow-auto m-0 p-3 flex flex-col justify-start">
                        <VehiclesList />
                    </TabsContent>
                </Tabs>
            </div>

            <SaveRouteDialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen} />
        </>
    );
}

function VehiclesList() {
    const vehicles = [
        { id: 'v1', name: 'Delivery Van 1', type: 'van', capacityWeight: 1000, color: '#3b82f6' },
        { id: 'v2', name: 'Truck A', type: 'truck', capacityWeight: 5000, color: '#10b981' },
        { id: 'v3', name: 'Compact Car', type: 'car', capacityWeight: 200, color: '#f59e0b' },
    ];

    return (
        <div className="space-y-2">
            <h3 className="font-medium text-sm flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Fleet Vehicles
            </h3>
            <div className="space-y-2">
                {vehicles.map((v) => (
                    <div
                        key={v.id}
                        className="flex items-center gap-3 p-2 rounded-lg border bg-card"
                    >
                        <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: v.color || '#3b82f6' }}
                        />
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{v.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {v.type} • {v.capacityWeight ? `${v.capacityWeight}kg` : 'No capacity set'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
