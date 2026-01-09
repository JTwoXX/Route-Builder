import { useState } from 'react';
import { Trash2, GripVertical, Clock, Navigation, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { Stop } from '@/lib/types';

interface StopCardProps {
    stop: Stop;
    isSelected?: boolean;
    onSelect?: () => void;
    onRemove?: () => void;
    onUpdateServiceTime?: (minutes: number) => void;
}

export function StopCard({ stop, isSelected, onSelect, onRemove, onUpdateServiceTime }: StopCardProps) {
    const [localServiceTime, setLocalServiceTime] = useState(stop.serviceTime?.toString() || '5');

    const handleServiceTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLocalServiceTime(value);

        const minutes = parseInt(value, 10);
        if (!isNaN(minutes) && minutes >= 0) {
            onUpdateServiceTime?.(minutes);
        }
    };

    return (
        <div
            onClick={onSelect}
            className={cn(
                "group flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-all hover:bg-accent/50",
                isSelected && "border-primary bg-accent"
            )}
        >
            {/* Drag Handle */}
            <div className="flex items-center opacity-40 group-hover:opacity-100 cursor-grab">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>

            {/* Sequence Number */}
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                {stop.sequence}
            </div>

            {/* Stop Details */}
            <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                    {stop.name || stop.address || 'Unnamed Stop'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                    {stop.address}
                </p>

                {/* Service Time - Editable */}
                <div className="flex items-center gap-1 mt-1.5" onClick={(e) => e.stopPropagation()}>
                    <Timer className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    <Input
                        type="number"
                        min="0"
                        max="999"
                        value={localServiceTime}
                        onChange={handleServiceTimeChange}
                        className="h-6 w-14 px-1.5 text-xs"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <span className="text-xs text-muted-foreground">min</span>
                </div>

                {/* Time Window Badge */}
                {stop.timeWindowStart && stop.timeWindowEnd && (
                    <Badge variant="secondary" className="mt-1 text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {stop.timeWindowStart} - {stop.timeWindowEnd}
                    </Badge>
                )}

                {/* Coordinates */}
                <p className="text-xs text-muted-foreground mt-1">
                    <Navigation className="h-3 w-3 inline mr-1" />
                    {stop.latitude.toFixed(5)}, {stop.longitude.toFixed(5)}
                </p>
            </div>

            {/* Actions */}
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove?.();
                }}
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}
