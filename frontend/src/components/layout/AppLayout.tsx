import { useState, type ReactNode } from 'react';
import { Route, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
    children: ReactNode;
    sidebar: ReactNode;
}

export function AppLayout({ children, sidebar }: AppLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen w-full bg-background">
            {/* Sidebar */}
            <aside
                className={cn(
                    "relative flex flex-col border-r bg-card transition-all duration-300",
                    sidebarOpen ? "w-80" : "w-0"
                )}
            >
                {sidebarOpen && (
                    <div className="flex h-full flex-col overflow-hidden">
                        {/* Sidebar Header */}
                        <div className="flex items-center justify-between border-b p-4">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                                    <Route className="h-4 w-4 text-primary-foreground" />
                                </div>
                                <span className="font-semibold text-lg">Route Builder</span>
                            </div>
                            <ThemeToggle />
                        </div>

                        {/* Sidebar Content */}
                        <div className="flex-1 overflow-auto">
                            {sidebar}
                        </div>
                    </div>
                )}

                {/* Toggle Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -right-4 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full border bg-background shadow-md"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    {sidebarOpen ? (
                        <ChevronLeft className="h-4 w-4" />
                    ) : (
                        <ChevronRight className="h-4 w-4" />
                    )}
                </Button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 relative">
                {children}
            </main>
        </div>
    );
}
