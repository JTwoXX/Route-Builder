import { useState } from 'react';
import { Plus, MapPin, Search, ClipboardPaste, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouteStore } from '@/stores/routeStore';

interface AddStopFormProps {
    onAddByClick?: () => void;
    defaultServiceTime?: number;
}

export function AddStopForm({ onAddByClick, defaultServiceTime = 5 }: AddStopFormProps) {
    const [address, setAddress] = useState('');
    const [batchMode, setBatchMode] = useState(false);
    const [batchAddresses, setBatchAddresses] = useState('');
    const addStop = useRouteStore((s) => s.addStop);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!address.trim()) return;

        // For demo: generate random coordinates near NYC
        const baseLat = 40.7128;
        const baseLng = -74.006;
        const randomLat = baseLat + (Math.random() - 0.5) * 0.1;
        const randomLng = baseLng + (Math.random() - 0.5) * 0.1;

        addStop({
            address: address.trim(),
            latitude: randomLat,
            longitude: randomLng,
            serviceTime: defaultServiceTime,
        });

        setAddress('');
    };

    const handleBatchAdd = () => {
        if (!batchAddresses.trim()) return;

        // Split by newlines, filter empty lines
        const addresses = batchAddresses
            .split('\n')
            .map(a => a.trim())
            .filter(a => a.length > 0);

        const baseLat = 40.7128;
        const baseLng = -74.006;

        addresses.forEach((addr) => {
            const randomLat = baseLat + (Math.random() - 0.5) * 0.15;
            const randomLng = baseLng + (Math.random() - 0.5) * 0.15;

            addStop({
                address: addr,
                latitude: randomLat,
                longitude: randomLng,
                serviceTime: defaultServiceTime,
            });
        });

        setBatchAddresses('');
        setBatchMode(false);
    };

    return (
        <div className="space-y-3">
            {!batchMode ? (
                <>
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Enter address..."
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Button type="submit" size="icon" disabled={!address.trim()}>
                            <Plus className="h-4 w-4" />
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
                            onClick={() => setBatchMode(false)}
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
                    />
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setBatchMode(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1"
                            onClick={handleBatchAdd}
                            disabled={!batchAddresses.trim()}
                        >
                            <Plus className="h-4 w-4 mr-1" />
                            Add {batchAddresses.split('\n').filter(a => a.trim()).length} stops
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
