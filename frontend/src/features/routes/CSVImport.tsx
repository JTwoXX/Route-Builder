import { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouteStore } from '@/stores/routeStore';

interface CSVStop {
    address: string;
    name?: string;
    latitude?: number;
    longitude?: number;
    timeWindowStart?: string;
    timeWindowEnd?: string;
    priority?: string;
}

export function CSVImport() {
    const [importing, setImporting] = useState(false);
    const [result, setResult] = useState<{ success: number; failed: number } | null>(null);
    const addStop = useRouteStore((s) => s.addStop);

    const parseCSV = (text: string): CSVStop[] => {
        const lines = text.trim().split('\n');
        if (lines.length < 2) return [];

        const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
        const stops: CSVStop[] = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            const stop: CSVStop = { address: '' };

            headers.forEach((header, idx) => {
                const value = values[idx];
                if (header.includes('address')) stop.address = value;
                else if (header.includes('name')) stop.name = value;
                else if (header.includes('lat')) stop.latitude = parseFloat(value);
                else if (header.includes('lng') || header.includes('lon')) stop.longitude = parseFloat(value);
                else if (header.includes('start')) stop.timeWindowStart = value;
                else if (header.includes('end')) stop.timeWindowEnd = value;
                else if (header.includes('priority')) stop.priority = value;
            });

            if (stop.address) stops.push(stop);
        }

        return stops;
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImporting(true);
        setResult(null);

        try {
            const text = await file.text();
            const stops = parseCSV(text);

            let success = 0;
            let failed = 0;

            for (const stop of stops) {
                try {
                    // If no coordinates, generate random ones near NYC for demo
                    const lat = stop.latitude || (40.7128 + (Math.random() - 0.5) * 0.1);
                    const lng = stop.longitude || (-74.006 + (Math.random() - 0.5) * 0.1);

                    addStop({
                        address: stop.address,
                        name: stop.name,
                        latitude: lat,
                        longitude: lng,
                        timeWindowStart: stop.timeWindowStart,
                        timeWindowEnd: stop.timeWindowEnd,
                        priority: (stop.priority as 'high' | 'medium' | 'low') || 'medium',
                    });
                    success++;
                } catch {
                    failed++;
                }
            }

            setResult({ success, failed });
        } catch {
            setResult({ success: 0, failed: 1 });
        } finally {
            setImporting(false);
        }
    };

    return (
        <div className="p-4 border-t space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Import Stops
            </h4>

            <div className="relative">
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={importing}
                />
                <Button variant="outline" className="w-full" disabled={importing}>
                    <FileText className="h-4 w-4 mr-2" />
                    {importing ? 'Importing...' : 'Upload CSV File'}
                </Button>
            </div>

            {result && (
                <div className={`flex items-center gap-2 text-sm ${result.failed > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                    {result.failed > 0 ? (
                        <AlertCircle className="h-4 w-4" />
                    ) : (
                        <CheckCircle className="h-4 w-4" />
                    )}
                    Imported {result.success} stops
                    {result.failed > 0 && `, ${result.failed} failed`}
                </div>
            )}

            <p className="text-xs text-muted-foreground">
                CSV should have columns: address, name (optional), lat, lng, start_time, end_time, priority
            </p>
        </div>
    );
}
