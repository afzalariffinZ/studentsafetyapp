"use client";

import { Button } from "@/components/ui/button";

interface MapControlsProps {
  activeFilter: 'all' | 'emergency' | 'in-progress' | 'resolved' | 'non-emergency';
  onFilterChange: (filter: 'all' | 'emergency' | 'in-progress' | 'resolved' | 'non-emergency') => void;
  showPatrols?: boolean;
  onTogglePatrols?: (v: boolean) => void;
}

export default function MapControls({ activeFilter, onFilterChange, showPatrols = true, onTogglePatrols }: MapControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
      <div className="flex flex-wrap items-center gap-1 sm:gap-2">
        <Button
          variant={activeFilter === 'all' ? 'default' : 'outline'}
          onClick={() => onFilterChange('all')}
          size="sm"
          className={`text-xs sm:text-sm ${activeFilter === 'all' ? 'bg-primary text-white' : ''}`}
        >
          <span className="hidden sm:inline">All Reports</span>
          <span className="sm:hidden">All</span>
        </Button>
        <Button
          variant={activeFilter === 'emergency' ? 'destructive' : 'outline'}
          onClick={() => onFilterChange('emergency')}
          size="sm"
          className={`text-xs sm:text-sm ${activeFilter === 'emergency' ? 'bg-red-600 text-white' : ''}`}
        >
          <span className="hidden sm:inline">Emergency Only</span>
          <span className="sm:hidden">Emergency</span>
        </Button>
        <Button
          variant={activeFilter === 'in-progress' ? 'default' : 'outline'}
          onClick={() => onFilterChange('in-progress')}
          size="sm"
          className={`text-xs sm:text-sm ${activeFilter === 'in-progress' ? 'bg-yellow-500 text-white' : ''}`}
        >
          <span className="hidden sm:inline">In Progress</span>
          <span className="sm:hidden">Progress</span>
        </Button>
        <Button
          variant={activeFilter === 'resolved' ? 'default' : 'outline'}
          onClick={() => onFilterChange('resolved')}
          size="sm"
          className={`text-xs sm:text-sm ${activeFilter === 'resolved' ? 'bg-green-600 text-white' : ''}`}
        >
          Resolved
        </Button>
        <Button
          variant={activeFilter === 'non-emergency' ? 'default' : 'outline'}
          onClick={() => onFilterChange('non-emergency')}
          size="sm"
          className={`text-xs sm:text-sm ${activeFilter === 'non-emergency' ? 'bg-primary text-white' : ''}`}
        >
          <span className="hidden sm:inline">Non-Emergency</span>
          <span className="sm:hidden">Non-Emerg</span>
        </Button>
      </div>
      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 sm:ml-auto">{' '}
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input type="checkbox"
            checked={showPatrols}
            onChange={(e) => onTogglePatrols?.(e.target.checked)}
          />
          Show patrol cars
        </label>
      </div>
    </div>
  );
}
