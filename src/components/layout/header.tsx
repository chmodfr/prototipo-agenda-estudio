
import { Music2, FolderGit2 } from 'lucide-react';
import Link from 'next/link';

export function AppHeader() {
  return (
    <header className="py-6 px-4 md:px-8 border-b border-border/50 bg-card/20 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Music2 className="h-8 w-8 text-primary group-hover:text-primary/80 transition-colors" />
          <h1 className="text-3xl font-bold font-headline text-primary-foreground group-hover:text-primary-foreground/80 transition-colors">
            SessionSnap
          </h1>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-foreground hover:text-primary transition-colors text-sm font-medium">
            Calendar
          </Link>
          <Link href="/manage-projects" className="text-foreground hover:text-primary transition-colors text-sm font-medium flex items-center gap-1.5">
            <FolderGit2 className="h-5 w-5" />
            Manage Clients & Projects
          </Link>
        </nav>
      </div>
    </header>
  );
}
