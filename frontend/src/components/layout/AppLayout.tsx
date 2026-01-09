import { type ReactNode } from 'react';
import { Route } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

interface AppLayoutProps {
    children: ReactNode;
    sidebar: ReactNode;
}

export function AppLayout({ children, sidebar }: AppLayoutProps) {
    return (
        <div className="flex h-screen w-screen overflow-hidden bg-background">
            {/* Sidebar - fixed width */}
            <aside className="w-[360px] flex-shrink-0 flex flex-col border-r bg-card">
                {/* Sidebar Header */}
                <div className="flex items-center justify-between border-b p-3 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                            <Route className="h-3.5 w-3.5 text-primary-foreground" />
                        </div>
                        <span className="font-semibold">Route Builder</span>
                    </div>
                    <ThemeToggle />
                </div>

                {/* Sidebar Content */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                    {sidebar}
                </div>
            </aside>

            {/* Main Content - fills remaining space */}
            <main className="flex-1 relative overflow-hidden">
                {children}
            </main>
        </div>
    );
}
