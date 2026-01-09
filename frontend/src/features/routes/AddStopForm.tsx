import { useState, useRef } from 'react';
import { Plus, MapPin, ClipboardPaste, ChevronUp, Loader2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddressAutocomplete } from '@/components/AddressAutocomplete';
import { useRouteStore } from '@/stores/routeStore';
import { geocodeAddress, type SearchSuggestion } from '@/lib/api/tomtom';

interface AddStopFormProps {
    onAddByClick?: () => void;
    defaultServiceTime?: number;
}

export function AddStopForm({ onAddByClick, defaultServiceTime = 5 }: AddStopFormProps) {
    const [address, setAddress] = useState('');
    const [batchMode, setBatchMode] = useState(false);
    const [batchAddresses, setBatchAddresses] = useState('');
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [isImportingCSV, setIsImportingCSV] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const addStop = useRouteStore((s) => s.addStop);
    const stops = useRouteStore((s) => s.stops);

    // CSV parsing helper
    const parseCSV = (text: string) => {
        const lines = text.trim().split('\n');
        if (lines.length < 2) return [];

        const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
        const stops: Array<{
            address: string;
            name?: string;
            latitude?: number;
            longitude?: number;
        }> = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            const stop: { address: string; name?: string; latitude?: number; longitude?: number } = { address: '' };

            headers.forEach((header, idx) => {
                const value = values[idx];
                if (header.includes('address')) stop.address = value;
                else if (header.includes('name')) stop.name = value;
                else if (header.includes('lat')) stop.latitude = parseFloat(value);
                else if (header.includes('lng') || header.includes('lon')) stop.longitude = parseFloat(value);
            });

            if (stop.address) stops.push(stop);
        }

        return stops;
    };

    // Handle CSV file upload
    const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsImportingCSV(true);
        try {
            const text = await file.text();
            const csvStops = parseCSV(text);
            let success = 0;

            for (const stop of csvStops) {
                const lat = stop.latitude || (40.7128 + (Math.random() - 0.5) * 0.1);
                const lng = stop.longitude || (-74.006 + (Math.random() - 0.5) * 0.1);

                addStop({
                    address: stop.address,
                    name: stop.name,
                    latitude: lat,
                    longitude: lng,
                    serviceTime: defaultServiceTime,
                });
                success++;
            }

            if (success > 0) {
                alert(`Successfully imported ${success} stops from CSV`);
            }
        } catch {
            alert('Failed to parse CSV file');
        } finally {
            setIsImportingCSV(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    // Get center coordinates to bias autocomplete results
    // Only bias when there are existing stops, otherwise search all of US
    const biasLocation = stops.length > 0
        ? {
            lat: stops.reduce((sum, s) => sum + s.latitude, 0) / stops.length,
            lon: stops.reduce((sum, s) => sum + s.longitude, 0) / stops.length,
        }
        : undefined; // No bias = search all US addresses

    // Handle selection from autocomplete
    const handleSelectSuggestion = (suggestion: SearchSuggestion) => {
        addStop({
            address: suggestion.address,
            latitude: suggestion.latitude,
            longitude: suggestion.longitude,
            serviceTime: defaultServiceTime,
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
                addStop({
                    address: result.formattedAddress,
                    latitude: result.latitude,
                    longitude: result.longitude,
                    serviceTime: defaultServiceTime,
                });
                setAddress('');
            } else {
                // If geocoding fails, show an alert
                alert('Could not find this address. Please try a more specific address or select from the suggestions.');
            }
        } finally {
            setIsGeocoding(false);
        }
    };

    const handleBatchAdd = async () => {
        if (!batchAddresses.trim()) return;

        // Split by newlines, filter empty lines
        const addresses = batchAddresses
            .split('\n')
            .map(a => a.trim())
            .filter(a => a.length > 0);

        setIsGeocoding(true);
        let successCount = 0;

        try {
            for (const addr of addresses) {
                const result = await geocodeAddress(addr);
                if (result) {
                    addStop({
                        address: result.formattedAddress,
                        latitude: result.latitude,
                        longitude: result.longitude,
                        serviceTime: defaultServiceTime,
                    });
                    successCount++;
                }
            }

            if (successCount < addresses.length) {
                alert(`Added ${successCount} of ${addresses.length} addresses. Some addresses could not be geocoded.`);
            }
        } finally {
            setBatchAddresses('');
            setBatchMode(false);
            setIsGeocoding(false);
        }
    };

    return (
        <div className="space-y-3">
            {!batchMode ? (
                <>
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <AddressAutocomplete
                            value={address}
                            onChange={setAddress}
                            onSelect={handleSelectSuggestion}
                            placeholder="Enter address..."
                            className="flex-1"
                            disabled={isGeocoding}
                            biasLocation={biasLocation}
                        />
                        <Button
                            type="submit"
                            size="icon"
                            disabled={!address.trim() || isGeocoding}
                        >
                            {isGeocoding ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Plus className="h-4 w-4" />
                            )}
                        </Button>
                    </form>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 justify-center text-muted-foreground"
                            onClick={onAddByClick}
                        >
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            Map
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 justify-center text-muted-foreground"
                            onClick={() => setBatchMode(true)}
                        >
                            <ClipboardPaste className="h-3.5 w-3.5 mr-1" />
                            Paste
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 justify-center text-muted-foreground relative"
                            disabled={isImportingCSV}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {isImportingCSV ? (
                                <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                            ) : (
                                <FileText className="h-3.5 w-3.5 mr-1" />
                            )}
                            CSV
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            onChange={handleCSVUpload}
                            className="hidden"
                        />
                    </div>
                </>
            ) : (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Paste multiple addresses</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setBatchMode(false)}
                            disabled={isGeocoding}
                        >
                            <ChevronUp className="h-4 w-4" />
                        </Button>
                    </div>
                    <textarea
                        className="w-full h-32 rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Paste addresses here, one per line...

Example:
123 Main St, New York, NY
456 Oak Ave, Brooklyn, NY
789 Elm Rd, Queens, NY"
                        value={batchAddresses}
                        onChange={(e) => setBatchAddresses(e.target.value)}
                        disabled={isGeocoding}
                    />
                    <p className="text-xs text-muted-foreground">
                        Each address will be geocoded to get precise coordinates.
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setBatchMode(false)}
                            disabled={isGeocoding}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1"
                            onClick={handleBatchAdd}
                            disabled={!batchAddresses.trim() || isGeocoding}
                        >
                            {isGeocoding ? (
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                                <Plus className="h-4 w-4 mr-1" />
                            )}
                            Add {batchAddresses.split('\n').filter(a => a.trim()).length} stops
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
