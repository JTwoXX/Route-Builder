import { useState } from 'react';
import { Plus, MapPin, ClipboardPaste, ChevronUp, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddressAutocomplete } from '@/components/AddressAutocomplete';
import { useRouteStore } from '@/stores/routeStore';
import { geocodeAddress, type SearchSuggestion } from '@/lib/api/tomtom';

interface AddStopFormProps {
    onAddByClick?: () => void;
    defaultServiceTime?: number;
}

interface BatchResult {
    success: string[];
    failed: string[];
}

/**
 * Smart address parser that detects and handles multiple formats:
 * - Newline separated
 * - Tab separated (Excel paste)
 * - Semicolon separated
 * - Numbered lists (1. address, 2. address)
 * - Bulleted lists (- address, • address)
 */
function parseAddresses(input: string): string[] {
    if (!input.trim()) return [];

    let lines: string[];

    // Check for tab characters (Excel paste)
    if (input.includes('\t')) {
        // Split by tabs first, then by newlines
        lines = input.split(/[\t\n]+/);
    }
    // Check for semicolons (common list separator)
    else if (input.includes(';') && !input.includes('\n')) {
        lines = input.split(';');
    }
    // Check for pipe separator
    else if (input.includes('|') && !input.includes('\n')) {
        lines = input.split('|');
    }
    // Default: split by newlines
    else {
        lines = input.split('\n');
    }

    // Process each line
    return lines
        .map(line => {
            let cleaned = line.trim();

            // Remove common list prefixes:
            // - Numbered: "1.", "1)", "1:", "1-", "(1)"
            // - Bulleted: "-", "•", "*", "→", ">"
            // - Lettered: "a.", "a)", "A."
            cleaned = cleaned
                .replace(/^[\d]+[.\-):]\s*/, '')      // "1." "1)" "1:" "1-"
                .replace(/^\([\d]+\)\s*/, '')         // "(1)"
                .replace(/^[a-zA-Z][.\-)]\s*/, '')    // "a." "a)" "A."
                .replace(/^[-•*→>]\s*/, '')           // bullets
                .replace(/^[\u2022\u2023\u25E6\u2043\u2219]\s*/, '') // unicode bullets
                .trim();

            return cleaned;
        })
        .filter(line => {
            // Filter out empty lines and lines that are too short to be addresses
            if (line.length < 3) return false;

            // Filter out lines that are just numbers
            if (/^[\d\s]+$/.test(line)) return false;

            // Filter out common non-address patterns
            if (/^(address|location|stop|destination)s?:?$/i.test(line)) return false;

            return true;
        });
}

export function AddStopForm({ onAddByClick, defaultServiceTime = 5 }: AddStopFormProps) {
    const [address, setAddress] = useState('');
    const [batchMode, setBatchMode] = useState(false);
    const [batchAddresses, setBatchAddresses] = useState('');
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [batchResult, setBatchResult] = useState<BatchResult | null>(null);
    const [processingStatus, setProcessingStatus] = useState('');
    const addStop = useRouteStore((s) => s.addStop);
    const stops = useRouteStore((s) => s.stops);

    // Get center coordinates to bias autocomplete results
    const biasLocation = stops.length > 0
        ? {
            lat: stops.reduce((sum, s) => sum + s.latitude, 0) / stops.length,
            lon: stops.reduce((sum, s) => sum + s.longitude, 0) / stops.length,
        }
        : { lat: 40.7128, lon: -74.006 }; // Default to NYC

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
                alert('Could not find this address. Please try a more specific address or select from the suggestions.');
            }
        } finally {
            setIsGeocoding(false);
        }
    };

    const handleBatchAdd = async () => {
        if (!batchAddresses.trim()) return;

        // Parse addresses using smart detection
        const addresses = parseAddresses(batchAddresses);

        if (addresses.length === 0) {
            setBatchResult({
                success: [],
                failed: ['No valid addresses detected in input']
            });
            return;
        }

        setIsGeocoding(true);
        setBatchResult(null);

        const success: string[] = [];
        const failed: string[] = [];

        try {
            for (let i = 0; i < addresses.length; i++) {
                const addr = addresses[i];
                setProcessingStatus(`Processing ${i + 1} of ${addresses.length}: ${addr.substring(0, 30)}...`);

                try {
                    const result = await geocodeAddress(addr);
                    if (result) {
                        addStop({
                            address: result.formattedAddress,
                            latitude: result.latitude,
                            longitude: result.longitude,
                            serviceTime: defaultServiceTime,
                        });
                        success.push(result.formattedAddress);
                    } else {
                        failed.push(addr);
                    }
                } catch {
                    failed.push(addr);
                }

                // Small delay to avoid rate limiting
                if (i < addresses.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }

            setBatchResult({ success, failed });

            // Clear input if all succeeded
            if (failed.length === 0) {
                setBatchAddresses('');
                // Auto-close after short delay on complete success
                setTimeout(() => {
                    setBatchMode(false);
                    setBatchResult(null);
                }, 2000);
            }
        } finally {
            setIsGeocoding(false);
            setProcessingStatus('');
        }
    };

    const handleCloseBatch = () => {
        setBatchMode(false);
        setBatchResult(null);
        setBatchAddresses('');
    };

    // Count detected addresses for preview
    const detectedAddresses = parseAddresses(batchAddresses);

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
                            className="flex-1 justify-start text-muted-foreground"
                            onClick={onAddByClick}
                        >
                            <MapPin className="h-4 w-4 mr-2" />
                            Click map
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1 justify-start text-muted-foreground"
                            onClick={() => setBatchMode(true)}
                        >
                            <ClipboardPaste className="h-4 w-4 mr-2" />
                            Batch paste
                        </Button>
                    </div>
                </>
            ) : (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Paste multiple addresses</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCloseBatch}
                            disabled={isGeocoding}
                        >
                            <ChevronUp className="h-4 w-4" />
                        </Button>
                    </div>

                    <textarea
                        className="w-full h-32 rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring font-mono"
                        placeholder={`Paste addresses in any format:

• One per line
• Separated by tabs (Excel)
• Separated by semicolons
• Numbered lists (1. address)

Example:
123 Main St, New York, NY
456 Oak Ave, Brooklyn, NY`}
                        value={batchAddresses}
                        onChange={(e) => {
                            setBatchAddresses(e.target.value);
                            setBatchResult(null); // Clear previous results on edit
                        }}
                        disabled={isGeocoding}
                    />

                    {/* Detected addresses preview */}
                    {batchAddresses.trim() && !batchResult && (
                        <p className="text-xs text-muted-foreground">
                            {detectedAddresses.length > 0
                                ? `Detected ${detectedAddresses.length} address${detectedAddresses.length !== 1 ? 'es' : ''}`
                                : 'No addresses detected'
                            }
                        </p>
                    )}

                    {/* Processing status */}
                    {processingStatus && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            {processingStatus}
                        </p>
                    )}

                    {/* Results feedback */}
                    {batchResult && (
                        <div className="space-y-2 text-xs">
                            {batchResult.success.length > 0 && (
                                <div className="flex items-start gap-2 text-green-600 dark:text-green-400">
                                    <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    <span>Added {batchResult.success.length} address{batchResult.success.length !== 1 ? 'es' : ''}</span>
                                </div>
                            )}
                            {batchResult.failed.length > 0 && (
                                <div className="p-2 bg-red-50 dark:bg-red-950 rounded border border-red-200 dark:border-red-800">
                                    <div className="flex items-start gap-2 text-red-600 dark:text-red-400">
                                        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium">Could not geocode {batchResult.failed.length} address{batchResult.failed.length !== 1 ? 'es' : ''}:</p>
                                            <ul className="mt-1 space-y-0.5 text-red-700 dark:text-red-300">
                                                {batchResult.failed.slice(0, 5).map((addr, i) => (
                                                    <li key={i} className="truncate">• {addr}</li>
                                                ))}
                                                {batchResult.failed.length > 5 && (
                                                    <li>...and {batchResult.failed.length - 5} more</li>
                                                )}
                                            </ul>
                                            <p className="mt-2 text-red-600 dark:text-red-400">
                                                Try adding more details (city, state, zip code)
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={handleCloseBatch}
                            disabled={isGeocoding}
                        >
                            {batchResult?.success.length ? 'Done' : 'Cancel'}
                        </Button>
                        <Button
                            className="flex-1"
                            onClick={handleBatchAdd}
                            disabled={detectedAddresses.length === 0 || isGeocoding}
                        >
                            {isGeocoding ? (
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                                <Plus className="h-4 w-4 mr-1" />
                            )}
                            Add {detectedAddresses.length} stop{detectedAddresses.length !== 1 ? 's' : ''}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
