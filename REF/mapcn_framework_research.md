# MapCN UI Framework Research

Source: https://mapcn.vercel.app/docs/

## Overview

MapCN is a React-based map component library built on top of MapLibre GL JS, designed to work with Tailwind CSS and shadcn/ui.

## Key Features

### Technology Stack
- **Base Library**: MapLibre GL JS (open-source alternative to Mapbox GL)
- **UI Framework**: React with TypeScript
- **Styling**: Tailwind CSS
- **Component Library**: shadcn/ui integration
- **Map Tiles**: Free CARTO basemap tiles (no API key required)
- **Theme Support**: Automatic light/dark mode switching

### Installation
```bash
npx shadcn@latest add https://mapcn.vercel.app/maps/map.json
```

This installs `maplibre-gl` and adds the map component to the project.

## Core Components

### 1. Map (Root Container)
- Initializes MapLibre GL
- Provides context to child components
- Automatic theme switching (light/dark)
- Extends MapOptions from MapLibre GL

**Props:**
- `children`: ReactNode - Child components
- `styles`: Custom map styles for light/dark themes
- Extends all MapLibre MapOptions

### 2. MapControls
- Zoom in/out buttons
- Compass (reset bearing)
- Locate user button
- Fullscreen toggle

**Props:**
- `position`: "top-left" | "top-right" | "bottom-left" | "bottom-right" (default: "bottom-right")
- `showZoom`: boolean (default: true)
- `showCompass`: boolean (default: false)
- `showLocate`: boolean (default: false)
- `showFullscreen`: boolean (default: false)
- `onLocate`: Callback with user coordinates

### 3. MapMarker
- Container for marker-related components
- Handles marker positioning
- Supports click, hover, drag events

**Props:**
- `longitude`: number (required)
- `latitude`: number (required)
- `children`: ReactNode
- `onClick`, `onMouseEnter`, `onMouseLeave`: Event callbacks
- `onDragStart`, `onDrag`, `onDragEnd`: Drag callbacks
- Extends MapLibre MarkerOptions

### 4. MarkerContent
- Renders visual content of marker
- Default: blue dot marker
- Supports custom content

**Props:**
- `children`: ReactNode (custom marker content)
- `className`: Additional CSS classes

### 5. MarkerPopup
- Popup attached to marker (opens on click)
- Must be inside MapMarker

**Props:**
- `children`: ReactNode (popup content)
- `className`: CSS classes
- `closeButton`: boolean (default: false)
- Extends MapLibre PopupOptions

### 6. MarkerTooltip
- Tooltip on hover
- Auto-dismisses on hover out

**Props:**
- `children`: ReactNode (tooltip content)
- `className`: CSS classes
- `position`: "top" | "bottom"

### 7. MarkerLabel
- Text label above/below marker
- Must be inside MarkerContent

**Props:**
- `children`: ReactNode (label text)
- `className`: CSS classes
- `position`: "top" | "bottom" (default: "top")

### 8. MapPopup
- Standalone popup (no marker)
- Can be placed anywhere on map

**Props:**
- `longitude`: number (required)
- `latitude`: number (required)
- `onClose`: Callback when closed
- `children`: ReactNode
- `className`: CSS classes
- `closeButton`: boolean

### 9. MapRoute
- Renders line/route connecting coordinates
- Supports click and hover interactions

**Props:**
- `id`: string (optional, auto-generated)
- `coordinates`: [number, number][] (array of [lng, lat] pairs)
- `color`: string (default: "#4285F4")
- `width`: number (default: 3)
- `opacity`: number (default: 0.8)
- `dashArray`: [number, number] (for dashed lines)
- `onClick`, `onMouseEnter`, `onMouseLeave`: Event callbacks
- `interactive`: boolean (default: true)

### 10. MapClusterLayer
- Renders clustered point data
- Automatically groups nearby points
- Expands on click
- Supports generic type parameter for typed data

**Props:**
- `data`: Array of point features
- `clusterRadius`: number (clustering radius)
- `clusterMaxZoom`: number (max zoom for clustering)
- Custom cluster rendering options

### 11. useMap Hook
- Provides access to MapLibre map instance
- Must be used within Map component

**Returns:**
- `map`: MapLibre.Map instance
- `isLoaded`: boolean (map loaded and ready)

## Component Anatomy Example

```jsx
<Map>
  <MapMarker longitude={...} latitude={...}>
    <MarkerContent>
      <MarkerLabel />
    </MarkerContent>
    <MarkerPopup />
    <MarkerTooltip />
  </MapMarker>
  
  <MapPopup longitude={...} latitude={...} />
  <MapControls />
  <MapRoute coordinates={...} />
  <MapClusterLayer data={...} />
</Map>
```

## Advantages for Route Planning App

1. **Free and Open Source**: No licensing costs, built on MapLibre GL
2. **No API Key Required**: Uses free CARTO basemap tiles
3. **Modern Stack**: React, TypeScript, Tailwind CSS
4. **Component-Based**: Modular, reusable components
5. **Theme Support**: Built-in light/dark mode
6. **Route Visualization**: Native MapRoute component
7. **Clustering**: Built-in clustering for multiple stops
8. **Interactive**: Click, hover, drag events on all components
9. **Customizable**: Full styling control with Tailwind CSS
10. **shadcn/ui Integration**: Consistent UI components

## Recommended Usage for Route4Me Clone

- **Map Container**: Use `<Map>` as base with custom styles
- **Route Display**: Use `<MapRoute>` for optimized routes
- **Stop Markers**: Use `<MapMarker>` with custom content for delivery stops
- **Stop Details**: Use `<MarkerPopup>` for address/order details
- **Clustering**: Use `<MapClusterLayer>` for many stops
- **Controls**: Use `<MapControls>` with all buttons enabled
- **Real-time Updates**: Use `useMap` hook to update routes dynamically
- **Multi-route Display**: Multiple `<MapRoute>` components with different colors
