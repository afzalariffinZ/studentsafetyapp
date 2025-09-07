"use client";

import dynamic from 'next/dynamic';
import { useState } from 'react';

// Dynamically import the Map component with no SSR
const IncidentMap = dynamic(() => import('./map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="text-gray-500">Loading map...</div>
    </div>
  )
});

const MapControls = dynamic(() => import('./map-controls'), {
  ssr: false
});

interface MapWrapperProps {
  height?: string;
}

export default function MapWrapper({ height = "400px" }: MapWrapperProps) {
  const [mapFilter, setMapFilter] = useState<'all' | 'emergency' | 'in-progress' | 'resolved' | 'non-emergency'>('all');
  const [showPatrols, setShowPatrols] = useState(true);

  // Handle responsive height more simply
  const getResponsiveStyle = () => {
    if (height.includes('sm:')) {
      // For responsive height strings like "400px sm:520px"
      const parts = height.split(' ');
      const baseHeight = parts[0];
      return {
        height: baseHeight,
        '@media (min-width: 640px)': {
          height: parts[1]?.replace('sm:', '') || baseHeight
        }
      };
    }
    return { height };
  };

  return (
    <div className="space-y-3">
      <MapControls 
        activeFilter={mapFilter} 
        onFilterChange={setMapFilter}
        showPatrols={showPatrols}
        onTogglePatrols={setShowPatrols}
      />
      <div 
        className="w-full rounded-lg overflow-hidden border border-gray-200"
        style={getResponsiveStyle()}
      >
        <IncidentMap filterType={mapFilter} showPatrols={showPatrols} />
      </div>
    </div>
  );
}
