import { useState } from 'react';
import { Home, X, Loader2, RotateCcw, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddressAutocomplete } from '@/components/AddressAutocomplete';
import { useRouteStore } from '@/stores/routeStore';
import { geocodeAddress, type SearchSuggestion } from '@/lib/api/tomtom';

export function StartLocationForm() {
    const [address, setAddress] = useState('');
    const [isGeocoding, setIsGeocoding] = useState(false);
    const startLocation = useRouteStore((s) => s.startLocation);
    const setStartLocation = useRouteStore((s) => s.setStartLocation);
    const roundTrip = useRouteStore((s) => s.optimizationSettings.roundTrip);
    const setOptimizationSettings = useRouteStore((s) => s.setOptimizationSettings);

    // Handle selection from autocomplete
    const handleSelectSuggestion = (suggestion: SearchSuggestion) => {
        setStartLocation({
            address: suggestion.address,
            latitude: suggestion.latitude,
            longitude: suggestion.longitude,
        });
        setAddress('');
    };

    // Handle manual form submission (geocode the address)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!address.trim()) return;

        setIsGeocoding(true);
        try {
            const result = await geocodeAddress(address);
            if (result) {
                setStartLocation({
                    address: result.formattedAddress,
                    latitude: result.latitude,
                    longitude: result.longitude,
                });
                setAddress('');
            } else {
                alert('Could not find this address. Please try a more specific address.');
            }
        } finally {
            setIsGeocoding(false);
        }
    };

    const handleClear = () => {
        setStartLocation(null);
    };

    return (
        <div className="space-y-3">
            <h3 className="font-medium text-sm flex items-center gap-2">
                <Home className="h-4 w-4" />
                Start Location
            </h3>

            {startLocation ? (
                <div className="flex items-center gap-2 p-2 rounded-lg border bg-primary/5 border-primary/20">
                    <Home className="h-4 w-4 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{startLocation.address}</p>
                        <p className="text-xs text-muted-foreground">
                            {startLocation.latitude.toFixed(5)}, {startLocation.longitude.toFixed(5)}
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={handleClear}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <AddressAutocomplete
                        value={address}
                        onChange={setAddress}
                        onSelect={handleSelectSuggestion}
                        placeholder="Enter depot/start address..."
                        className="flex-1"
                        disabled={isGeocoding}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        variant="outline"
                        disabled={!address.trim() || isGeocoding}
                    >
                        {isGeocoding ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Home className="h-4 w-4" />
                        )}
                    </Button>
                </form>
            )}

            {/* Round Trip / One Way Toggle */}
            <div className="flex gap-1 p-1 bg-muted rounded-lg">
                <button
                    type="button"
                    onClick={() => setOptimizationSettings({ roundTrip: true })}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        roundTrip
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    <RotateCcw className="h-3 w-3" />
                    Round Trip
                </button>
                <button
                    type="button"
                    onClick={() => setOptimizationSettings({ roundTrip: false })}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        !roundTrip
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    <ArrowRight className="h-3 w-3" />
                    One Way
                </button>
            </div>

            <p className="text-xs text-muted-foreground">
                {!startLocation
                    ? 'Set the starting point for route optimization'
                    : roundTrip
                        ? 'Route will return to start location'
                        : 'Route ends at the last stop'
                }
            </p>
        </div>
    );
}
