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

    const handleSelectSuggestion = (suggestion: SearchSuggestion) => {
        setStartLocation({
            address: suggestion.address,
            latitude: suggestion.latitude,
            longitude: suggestion.longitude,
        });
        setAddress('');
    };

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
        <div className="space-y-1.5">
            {startLocation ? (
                <div className="flex items-center gap-2 p-1.5 rounded border bg-primary/5 border-primary/20">
                    <Home className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{startLocation.address}</p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 text-muted-foreground hover:text-destructive"
                        onClick={handleClear}
                    >
                        <X className="h-3 w-3" />
                    </Button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="flex gap-1.5">
                    <AddressAutocomplete
                        value={address}
                        onChange={setAddress}
                        onSelect={handleSelectSuggestion}
                        placeholder="Enter start address..."
                        className="flex-1"
                        disabled={isGeocoding}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        variant="outline"
                        disabled={!address.trim() || isGeocoding}
                        className="h-8 w-8"
                    >
                        {isGeocoding ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                            <Home className="h-3.5 w-3.5" />
                        )}
                    </Button>
                </form>
            )}

            {/* Round Trip / One Way Toggle */}
            <div className="flex gap-0.5 p-0.5 bg-muted rounded text-xs">
                <button
                    type="button"
                    onClick={() => setOptimizationSettings({ roundTrip: true })}
                    className={`flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded transition-colors ${
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
                    className={`flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded transition-colors ${
                        !roundTrip
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    <ArrowRight className="h-3 w-3" />
                    One Way
                </button>
            </div>
        </div>
    );
}
