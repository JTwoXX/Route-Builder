import { useState } from 'react';
import { Trash2, GripVertical, Clock, Navigation, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
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
                "group flex items-start gap-2 rounded-lg border p-2 cursor-pointer transition-all hover:bg-accent/50",
                isSelected && "border-primary bg-accent"
            )}
        >
            {/* Drag Handle */}
            <div className="flex items-center opacity-40 group-hover:opacity-100 cursor-grab pt-1">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>

            {/* Sequence Number */}
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-xs">
                {stop.sequence}
            </div>

            {/* Stop Details */}
            <div className="flex-1 min-w-0">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <p className="font-medium text-sm truncate cursor-default">
                            {stop.name || stop.address || 'Unnamed Stop'}
                        </p>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[280px]">
                        <p className="text-sm">{stop.name || stop.address || 'Unnamed Stop'}</p>
                        {stop.name && stop.address && (
                            <p className="text-xs text-muted-foreground mt-1">{stop.address}</p>
                        )}
                    </TooltipContent>
                </Tooltip>

                {stop.name && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <p className="text-xs text-muted-foreground truncate cursor-default">
                                {stop.address}
                            </p>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-[280px]">
                            <p className="text-xs">{stop.address}</p>
                        </TooltipContent>
                    </Tooltip>
                )}

                {/* Service Time - Editable */}
                <div className="flex items-center gap-1 mt-1" onClick={(e) => e.stopPropagation()}>
                    <Timer className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    <Input
                        type="number"
                        min="0"
                        max="999"
                        value={localServiceTime}
                        onChange={handleServiceTimeChange}
                        className="h-5 w-12 px-1 text-xs"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <span className="text-xs text-muted-foreground">min</span>

                    {/* Time Window Badge - inline */}
                    {stop.timeWindowStart && stop.timeWindowEnd && (
                        <Badge variant="secondary" className="ml-1 text-xs h-5 px-1">
                            <Clock className="h-2.5 w-2.5 mr-0.5" />
                            {stop.timeWindowStart}-{stop.timeWindowEnd}
                        </Badge>
                    )}
                </div>

                {/* Coordinates */}
                <p className="text-xs text-muted-foreground mt-0.5">
                    <Navigation className="h-2.5 w-2.5 inline mr-0.5" />
                    {stop.latitude.toFixed(4)}, {stop.longitude.toFixed(4)}
                </p>
            </div>

            {/* Actions */}
            <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove?.();
                }}
            >
                <Trash2 className="h-3.5 w-3.5" />
            </Button>
        </div>
    );
}
