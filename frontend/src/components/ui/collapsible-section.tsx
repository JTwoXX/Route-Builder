import { useState, type ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CollapsibleSectionProps {
    title: string;
    icon?: ReactNode;
    defaultExpanded?: boolean;
    children: ReactNode;
    className?: string;
}

export function CollapsibleSection({
    title,
    icon,
    defaultExpanded = false,
    children,
    className,
}: CollapsibleSectionProps) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    return (
        <div className={cn("border-b", className)}>
            <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-accent/50 transition-colors text-left"
            >
                <ChevronRight
                    className={cn(
                        "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 flex-shrink-0",
                        isExpanded && "rotate-90"
                    )}
                />
                {icon && <span className="text-muted-foreground flex-shrink-0">{icon}</span>}
                <span className="font-medium text-sm">{title}</span>
            </button>
            <div
                className={cn(
                    "overflow-hidden transition-all duration-200",
                    isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                )}
            >
                <div className="px-3 pb-2">
                    {children}
                </div>
            </div>
        </div>
    );
}
