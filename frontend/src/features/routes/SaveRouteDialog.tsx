import { useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useRouteStore } from '@/stores/routeStore';

interface SaveRouteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SaveRouteDialog({ open, onOpenChange }: SaveRouteDialogProps) {
    const currentRoute = useRouteStore((s) => s.currentRoute);
    const stops = useRouteStore((s) => s.stops);
    const saveRoute = useRouteStore((s) => s.saveRoute);

    const [name, setName] = useState(currentRoute?.name || '');

    const handleSave = () => {
        if (!name.trim()) return;
        saveRoute(name.trim());
        onOpenChange(false);
    };

    // Reset name when dialog opens
    const handleOpenChange = (open: boolean) => {
        if (open) {
            setName(currentRoute?.name || `Route ${new Date().toLocaleDateString()}`);
        }
        onOpenChange(open);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Save className="h-5 w-5" />
                        {currentRoute ? 'Update Route' : 'Save Route'}
                    </DialogTitle>
                    <DialogDescription>
                        {currentRoute
                            ? 'Update the name and save changes to this route.'
                            : 'Give your route a name to save it for later.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Route Name</label>
                        <Input
                            placeholder="Enter route name..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                            autoFocus
                        />
                    </div>

                    <div className="text-sm text-muted-foreground">
                        This route has {stops.length} stop{stops.length !== 1 ? 's' : ''}.
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={!name.trim()}>
                        <Save className="h-4 w-4 mr-2" />
                        {currentRoute ? 'Update' : 'Save'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
