import { FolderOpen, Trash2, Calendar, MapPin, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRouteStore } from '@/stores/routeStore';
import type { Route } from '@/lib/types';

export function SavedRoutesList() {
    const routes = useRouteStore((s) => s.routes);
    const currentRoute = useRouteStore((s) => s.currentRoute);
    const loadRoute = useRouteStore((s) => s.loadRoute);
    const deleteRoute = useRouteStore((s) => s.deleteRoute);
    const newRoute = useRouteStore((s) => s.newRoute);

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium flex items-center gap-2">
                        <FolderOpen className="h-4 w-4" />
                        Saved Routes
                    </h3>
                    <Button variant="outline" size="sm" onClick={newRoute}>
                        <Plus className="h-3 w-3 mr-1" />
                        New
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                    {routes.length} saved route{routes.length !== 1 ? 's' : ''}
                </p>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-2">
                    {routes.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-20" />
                            <p className="text-sm">No saved routes</p>
                            <p className="text-xs mt-1">Save a route to see it here</p>
                        </div>
                    ) : (
                        routes.map((route) => (
                            <RouteCard
                                key={route.id}
                                route={route}
                                isActive={currentRoute?.id === route.id}
                                onLoad={() => loadRoute(route)}
                                onDelete={() => deleteRoute(route.id)}
                                formatDate={formatDate}
                            />
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}

function RouteCard({
    route,
    isActive,
    onLoad,
    onDelete,
    formatDate,
}: {
    route: Route;
    isActive: boolean;
    onLoad: () => void;
    onDelete: () => void;
    formatDate: (date: Date) => string;
}) {
    return (
        <div
            className={`group p-3 rounded-lg border cursor-pointer transition-all hover:bg-accent/50 ${isActive ? 'border-primary bg-accent' : ''
                }`}
            onClick={onLoad}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{route.name}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {route.stops.length} stops
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(route.updatedAt)}
                        </span>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                >
                    <Trash2 className="h-3 w-3" />
                </Button>
            </div>

            {isActive && (
                <div className="mt-2 text-xs text-primary font-medium">
                    Currently editing
                </div>
            )}
        </div>
    );
}
