# Route Planning Application - Complete Architecture Specification

**Project:** Route4Me Clone with Real-Time Traffic Integration  
**Author:** Manus AI  
**Date:** January 7, 2026  
**Version:** 1.0

---

## Executive Summary

This document provides a comprehensive architecture specification for building a web-based route planning and optimization application modeled after Route4Me. The system will incorporate real-time traffic data from cost-effective sources, implement flawless route optimization algorithms, and utilize a modern UI framework based on MapCN. The architecture is designed to be scalable, maintainable, and capable of handling enterprise-level routing operations.

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [System Requirements](#2-system-requirements)
3. [Technology Stack](#3-technology-stack)
4. [System Architecture](#4-system-architecture)
5. [Feature Specifications](#5-feature-specifications)
6. [Frontend Architecture](#6-frontend-architecture)
7. [Backend Architecture](#7-backend-architecture)
8. [Route Optimization Engine](#8-route-optimization-engine)
9. [Real-Time Traffic Integration](#9-real-time-traffic-integration)
10. [Database Design](#10-database-design)
11. [API Specifications](#11-api-specifications)
12. [Security Architecture](#12-security-architecture)
13. [Deployment Strategy](#13-deployment-strategy)
14. [Cost Analysis](#14-cost-analysis)
15. [Implementation Roadmap](#15-implementation-roadmap)

---

## 1. Introduction

### 1.1 Purpose

This architecture specification defines the technical design for a comprehensive route planning and optimization web application. The system aims to replicate and enhance the core functionalities of Route4Me while incorporating modern technologies and cost-effective real-time traffic data sources.

### 1.2 Scope

The application will provide end-to-end route planning capabilities including address management, multi-stop route optimization, real-time traffic integration, driver dispatch, GPS tracking, proof of delivery, and comprehensive analytics.

### 1.3 Goals

The primary goals of this architecture are to deliver a system that provides **flawless route optimization logic**, integrates **near real-time traffic patterns** using Waze-like data sources, and presents a **modern, intuitive user interface** based on the MapCN framework. The system must be cost-effective, scalable, and maintainable.

---

## 2. System Requirements

### 2.1 Functional Requirements

The application must support the following core functionalities based on Route4Me's feature set:

**Route Planning and Optimization**
- Create and optimize routes with unlimited stops
- Support multiple optimization types (shortest time, shortest distance, balanced)
- Handle various route types (round trip, end anywhere, lock last destination)
- Dynamic route reoptimization when changes occur
- Support for time windows, service times, and stop priorities
- Multi-depot routing capabilities
- Recurring route scheduling

**Address and Stop Management**
- Import addresses from multiple sources (CSV, Excel, Google Drive, Dropbox)
- Manual address entry with geocoding
- OCR address scanning from images
- Voice dictation for address input
- Address book management with custom fields
- Bulk address operations

**Vehicle and Driver Management**
- Vehicle capacity constraints (weight, volume, cube)
- Mixed fleet optimization
- Driver skills and certifications
- Driver schedules and availability
- Commercial vehicle routing with restrictions

**Real-Time Operations**
- Live GPS tracking of drivers
- Real-time route progress monitoring
- Dynamic route adjustments
- ETA calculations and sharing
- Push notifications to drivers and dispatchers

**Proof of Delivery and Field Service**
- Photo capture and attachment
- Signature capture on glass
- Barcode scanning
- Custom form fields
- Text notes and audio recordings
- Time-stamped geolocation verification

**Analytics and Reporting**
- Planned vs actual route analysis
- Driver performance metrics
- Vehicle utilization reports
- Customer service level tracking
- Historical route data analysis
- Exportable reports (CSV, PDF)

### 2.2 Non-Functional Requirements

**Performance**
- Route optimization must complete in under 60 seconds for routes with up to 200 stops
- Map rendering must be smooth at 60 FPS
- API response times must be under 200ms for 95% of requests
- Support for 1,000 concurrent users

**Scalability**
- Horizontal scaling of backend services
- Database capable of storing millions of routes and stops
- Support for 10,000+ routes per day

**Reliability**
- 99.9% uptime SLA
- Automatic failover and recovery
- Data backup and disaster recovery

**Security**
- End-to-end encryption for sensitive data
- Role-based access control (RBAC)
- API key authentication
- GDPR and data privacy compliance

---

## 3. Technology Stack

### 3.1 Frontend Stack

| Technology | Purpose | Justification |
|:-----------|:--------|:--------------|
| **React 18+** | UI Framework | Industry standard, large ecosystem, excellent performance with concurrent rendering |
| **TypeScript** | Type Safety | Reduces bugs, improves developer experience, better tooling support |
| **MapCN** | Map Components | Modern React map library built on MapLibre GL, integrates with shadcn/ui [1] |
| **MapLibre GL JS** | Map Rendering | Open-source alternative to Mapbox GL, no vendor lock-in, excellent performance |
| **shadcn/ui** | UI Components | High-quality, accessible components built on Radix UI [1] |
| **Tailwind CSS** | Styling | Utility-first CSS, rapid development, consistent design system [1] |
| **Zustand** | State Management | Lightweight, minimal boilerplate, excellent TypeScript support |
| **React Query** | Data Fetching | Powerful caching, automatic refetching, optimistic updates |
| **React Hook Form** | Form Management | Performant, flexible validation, minimal re-renders |
| **Vite** | Build Tool | Fast development server, optimized production builds |

### 3.2 Backend Stack

| Technology | Purpose | Justification |
|:-----------|:--------|:--------------|
| **Node.js 20+** | Runtime | High performance, non-blocking I/O, large ecosystem |
| **NestJS** | Backend Framework | Modular architecture, dependency injection, TypeScript-first |
| **PostgreSQL 16** | Primary Database | ACID compliance, PostGIS for geospatial queries, excellent performance |
| **PostGIS** | Geospatial Extension | Industry-standard spatial database, efficient geographic queries |
| **Redis** | Caching Layer | In-memory caching, session storage, real-time pub/sub |
| **Socket.io** | Real-Time Communication | Bidirectional communication, automatic reconnection, room support |
| **Bull** | Job Queue | Reliable job processing, scheduling, retries |
| **Prisma** | ORM | Type-safe database access, automatic migrations, excellent DX |

### 3.3 External Services

| Service | Purpose | Cost |
|:--------|:--------|:-----|
| **TomTom Traffic API** | Real-Time Traffic Data | Free tier: 2,500 requests/day [2] |
| **CARTO Basemaps** | Map Tiles | Free, no API key required [1] |
| **OpenCage Geocoding** | Address Geocoding | Free tier: 2,500 requests/day |
| **AWS S3** | File Storage | Pay-as-you-go, ~$0.023/GB/month |

### 3.4 DevOps and Infrastructure

| Technology | Purpose |
|:-----------|:--------|
| **Docker** | Containerization |
| **Kubernetes** | Container Orchestration |
| **GitHub Actions** | CI/CD Pipeline |
| **Terraform** | Infrastructure as Code |
| **Prometheus + Grafana** | Monitoring and Alerting |
| **ELK Stack** | Logging and Analytics |

---

## 4. System Architecture

### 4.1 High-Level Architecture

The system follows a microservices architecture pattern with clear separation of concerns. The architecture is designed to be cloud-native, scalable, and resilient.

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Web App    │  │  Mobile App  │  │  Driver App  │      │
│  │   (React)    │  │   (Future)   │  │   (Future)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  API Gateway (NestJS)                                  │ │
│  │  - Authentication & Authorization                      │ │
│  │  - Rate Limiting                                       │ │
│  │  - Request Routing                                     │ │
│  │  - Load Balancing                                      │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Microservices Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Auth      │  │  Optimization│  │     Data     │      │
│  │   Service    │  │   Service    │  │   Service    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Real-Time   │  │  Geocoding   │  │   Tracking   │      │
│  │   Service    │  │   Service    │  │   Service    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Analytics   │  │    Dispatch  │  │    Notification│    │
│  │   Service    │  │   Service    │  │   Service    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  PostgreSQL  │  │    Redis     │  │   AWS S3     │      │
│  │   (PostGIS)  │  │   (Cache)    │  │   (Files)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   External Services Layer                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   TomTom     │  │    CARTO     │  │  OpenCage    │      │
│  │  Traffic API │  │  Map Tiles   │  │  Geocoding   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Service Responsibilities

**Authentication Service**
- User registration and login
- JWT token generation and validation
- API key management
- Role-based access control
- Session management

**Optimization Service**
- Route optimization algorithms
- Constraint validation
- Traffic data integration
- Multi-depot routing
- Recurring route generation

**Data Service**
- CRUD operations for all entities
- Data validation and sanitization
- Bulk import/export operations
- Address book management

**Real-Time Service**
- WebSocket connection management
- Live location updates
- Push notifications
- Real-time route progress tracking

**Geocoding Service**
- Address to coordinates conversion
- Reverse geocoding
- Address validation and normalization
- Batch geocoding operations

**Tracking Service**
- GPS location storage
- Historical tracking data
- Geofence management
- Location-based alerts

**Analytics Service**
- Route performance analysis
- Driver performance metrics
- Business intelligence reports
- Data aggregation and visualization

**Dispatch Service**
- Route assignment to drivers
- Driver availability management
- Route status updates
- Communication with mobile apps

**Notification Service**
- Email notifications
- SMS notifications
- Push notifications
- Webhook integrations

---

## 5. Feature Specifications

### 5.1 Core Features Matrix

Based on the comprehensive research of Route4Me's capabilities, the following features will be implemented:

| Feature Category | Features | Priority |
|:-----------------|:---------|:---------|
| **Route Planning** | Manual route creation, Unlimited stops, Multiple depots, Recurring routes | P0 |
| **Route Optimization** | Shortest time, Shortest distance, Balanced optimization, Round trip, End anywhere, Lock last destination | P0 |
| **Constraints** | Time windows, Service times, Vehicle capacity, Max distance, Max time, Stop priority, Avoidance zones | P0 |
| **Address Management** | Manual entry, CSV/Excel import, Google Drive import, Dropbox import, OCR scanning, Voice dictation, Address book | P0 |
| **Vehicle Management** | Vehicle profiles, Capacity constraints, Mixed fleets, Commercial routing | P0 |
| **Real-Time Traffic** | TomTom traffic integration, Dynamic ETA updates, Traffic-aware routing | P0 |
| **Driver Management** | Driver profiles, Skills and certifications, Availability schedules, Performance tracking | P1 |
| **Dispatch** | Route assignment, Driver notifications, Status updates, Communication | P1 |
| **GPS Tracking** | Live location tracking, Historical tracking, Breadcrumb trail, Geofencing | P1 |
| **Proof of Delivery** | Photo capture, Signature capture, Barcode scanning, Custom forms, Time-stamped verification | P1 |
| **Mobile Apps** | iOS app, Android app, Offline mode, In-app navigation | P2 |
| **Analytics** | Route performance, Driver metrics, Customer SLA tracking, Exportable reports | P1 |
| **Integrations** | REST API, Webhooks, Third-party integrations | P2 |

### 5.2 Route Optimization Features

The optimization engine must support the following capabilities:

**Optimization Types**
- **Shortest Time with Traffic**: Minimize total travel time using real-time traffic data
- **Shortest Distance**: Minimize total distance traveled
- **Balanced**: Optimize for a balance of time and distance
- **Round Trip**: Return to starting point
- **End Anywhere**: No requirement to return to origin
- **Lock Last Destination**: Force specific stop as final destination

**Constraints**
- **Time Windows**: Hard and soft time windows for each stop
- **Service Time**: Time required at each stop
- **Vehicle Capacity**: Weight, volume, and item count limits
- **Max Stops**: Maximum number of stops per route
- **Max Distance**: Maximum route distance
- **Max Duration**: Maximum route time
- **Driver Skills**: Required skills for specific stops
- **Stop Priority**: High-priority stops scheduled first
- **Avoidance Zones**: Geographic areas to avoid
- **Turn Restrictions**: Left turn avoidance, U-turn restrictions

**Advanced Features**
- **Multi-Depot Routing**: Routes starting from different locations
- **Pickup and Delivery**: Paired stops for item transfer
- **Curbside Delivery**: Specific side-of-street requirements
- **Commercial Vehicle Routing**: Truck-specific restrictions (height, weight, hazmat)
- **Recurring Routes**: Scheduled routes for repeat customers
- **Territory Management**: Automatic territory creation and balancing

---

## 6. Frontend Architecture

### 6.1 Application Structure

The frontend follows a feature-based folder structure for better organization and scalability:

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── map/             # MapCN components
│   ├── forms/           # Form components
│   └── layout/          # Layout components
├── features/
│   ├── routes/          # Route management
│   ├── addresses/       # Address management
│   ├── vehicles/        # Vehicle management
│   ├── drivers/         # Driver management
│   ├── tracking/        # GPS tracking
│   ├── analytics/       # Analytics and reports
│   └── settings/        # User settings
├── lib/
│   ├── api/             # API client
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   └── types/           # TypeScript types
├── stores/              # Zustand stores
└── App.tsx
```

### 6.2 Key Frontend Components

**Map Component**
```typescript
import { Map, MapControls, MapRoute, MapMarker, MapClusterLayer } from '@/components/ui/map';

<Map center={[lng, lat]} zoom={11}>
  <MapControls 
    position="bottom-right"
    showZoom={true}
    showLocate={true}
    showFullscreen={true}
  />
  
  {routes.map(route => (
    <MapRoute
      key={route.id}
      coordinates={route.coordinates}
      color={route.color}
      onClick={() => handleRouteClick(route)}
    />
  ))}
  
  <MapClusterLayer
    data={stops}
    renderCluster={(count) => <ClusterMarker count={count} />}
    renderPoint={(stop) => <StopMarker stop={stop} />}
  />
</Map>
```

**Route Optimization Form**
- Address input with autocomplete
- Constraint configuration (time windows, capacity, etc.)
- Optimization type selection
- Vehicle and driver assignment
- Real-time optimization progress

**Route Dashboard**
- List of all routes with status
- Quick actions (edit, duplicate, delete, dispatch)
- Filtering and sorting
- Bulk operations

**Live Tracking View**
- Real-time driver locations on map
- Route progress indicators
- ETA calculations
- Driver communication

### 6.3 State Management

Zustand will be used for global state with the following stores:

- **authStore**: User authentication state
- **routeStore**: Current routes and optimization state
- **mapStore**: Map view state and selected features
- **uiStore**: UI state (modals, sidebars, notifications)
- **trackingStore**: Real-time tracking data

---

## 7. Backend Architecture

### 7.1 API Gateway

The API Gateway serves as the single entry point for all client requests. It is built with NestJS and provides:

- **Authentication**: JWT token validation
- **Authorization**: Role-based access control
- **Rate Limiting**: Prevent API abuse
- **Request Routing**: Forward requests to appropriate microservices
- **Response Aggregation**: Combine responses from multiple services
- **Error Handling**: Consistent error responses
- **Logging**: Request/response logging for monitoring

### 7.2 Microservices Communication

Services communicate using:
- **REST APIs**: For synchronous request/response
- **Message Queue (Redis Pub/Sub)**: For asynchronous events
- **gRPC**: For high-performance inter-service communication (future)

### 7.3 Service Details

**Optimization Service**

This is the most complex service in the system. It will be implemented as a separate microservice with the following architecture:

```
Optimization Service
├── API Layer
│   └── Optimization Controller
├── Business Logic Layer
│   ├── Optimization Engine
│   ├── Constraint Validator
│   ├── Traffic Data Integrator
│   └── Route Builder
├── Algorithm Layer
│   ├── TSP Solver (Traveling Salesperson Problem)
│   ├── VRP Solver (Vehicle Routing Problem)
│   ├── CVRP Solver (Capacitated VRP)
│   └── VRPTW Solver (VRP with Time Windows)
└── Data Access Layer
    └── Optimization Repository
```

**Key Algorithms:**
- **Nearest Neighbor Heuristic**: Fast initial solution
- **2-opt and 3-opt**: Local search improvements
- **Simulated Annealing**: Metaheuristic for escaping local optima
- **Genetic Algorithm**: Population-based optimization (for complex scenarios)
- **Clarke-Wright Savings**: For multi-route optimization

---

## 8. Route Optimization Engine

### 8.1 Optimization Algorithm

The route optimization engine is the core of the application and must provide **flawless** results. The following multi-stage approach will be used:

**Stage 1: Input Validation and Preprocessing**
1. Validate all addresses are geocoded
2. Validate constraints are feasible
3. Calculate distance matrix between all stops
4. Integrate real-time traffic data into travel time matrix

**Stage 2: Initial Solution Generation**
1. Use **Nearest Neighbor** algorithm for fast initial solution
2. Apply **Sweep Algorithm** for multi-vehicle scenarios
3. Validate initial solution meets all constraints

**Stage 3: Solution Improvement**
1. Apply **2-opt** local search to improve route order
2. Apply **3-opt** for more complex improvements
3. Use **Simulated Annealing** to escape local optima
4. Apply **Or-opt** for relocating sequences of stops

**Stage 4: Constraint Satisfaction**
1. Adjust routes to satisfy time windows
2. Balance vehicle capacities
3. Ensure driver skills match stop requirements
4. Apply avoidance zones

**Stage 5: Traffic-Aware Optimization**
1. Query TomTom Traffic API for current conditions
2. Recalculate travel times with traffic data
3. Adjust departure times to avoid congestion
4. Reoptimize if traffic significantly impacts routes

**Stage 6: Final Validation**
1. Verify all constraints are satisfied
2. Calculate final metrics (distance, time, cost)
3. Generate turn-by-turn directions
4. Return optimized routes to client

### 8.2 Optimization Performance

To ensure fast optimization times:
- **Caching**: Cache distance matrices for frequently used locations
- **Parallel Processing**: Use worker threads for independent route calculations
- **Progressive Results**: Return initial solution quickly, then improve in background
- **Timeout Handling**: Return best solution found within time limit
- **Incremental Optimization**: For route changes, only reoptimize affected portions

### 8.3 Optimization Quality Metrics

The system will track and report:
- Total distance saved vs unoptimized routes
- Total time saved vs unoptimized routes
- Constraint satisfaction rate
- Average optimization time
- Solution quality score (based on known optimal solutions for test cases)

---

## 9. Real-Time Traffic Integration

### 9.1 Traffic API Selection

Based on extensive research, **TomTom Traffic API** is the recommended choice for real-time traffic data [2]. This decision is based on:

**Cost-Effectiveness**
- Free tier: 2,500 requests per day (75,000 per month)
- Sufficient for development and early production
- Significantly cheaper than OpenWebNinja Waze API at scale

**Data Quality**
- Real-time traffic flow data
- Traffic incident information
- Historical traffic patterns
- Connected car probe data
- Roadway sensor integration

**API Capabilities**
- Traffic Flow API: Real-time speeds and travel times
- Traffic Incidents API: Accidents, road closures, construction
- Updated every minute
- Global coverage

### 9.2 Traffic Integration Architecture

```
┌─────────────────────────────────────────────────────────┐
│         Optimization Service                             │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Traffic Integration Module                        │ │
│  │  ┌──────────────┐  ┌──────────────┐               │ │
│  │  │ Traffic Data │  │   Cache      │               │ │
│  │  │   Fetcher    │──│   Manager    │               │ │
│  │  └──────────────┘  └──────────────┘               │ │
│  │  ┌──────────────┐  ┌──────────────┐               │ │
│  │  │ Travel Time  │  │   Incident   │               │ │
│  │  │  Calculator  │  │   Processor  │               │ │
│  │  └──────────────┘  └──────────────┘               │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              TomTom Traffic API                          │
│  ┌────────────────┐         ┌────────────────┐         │
│  │  Traffic Flow  │         │    Traffic     │         │
│  │      API       │         │  Incidents API │         │
│  └────────────────┘         └────────────────┘         │
└─────────────────────────────────────────────────────────┘
```

### 9.3 Traffic Data Caching Strategy

To minimize API calls and costs:

**Cache Layers**
1. **Redis Cache**: Store traffic data for 5 minutes
2. **In-Memory Cache**: Store frequently accessed segments for 1 minute
3. **Database Cache**: Store historical patterns for predictive routing

**Cache Keys**
- Traffic flow: `traffic:flow:{road_segment_id}:{timestamp}`
- Traffic incidents: `traffic:incidents:{bbox}:{timestamp}`
- Travel time: `traffic:time:{origin}:{destination}:{timestamp}`

**Cache Invalidation**
- Automatic expiration after 5 minutes
- Manual invalidation on incident updates
- Predictive prefetching for upcoming route segments

### 9.4 Fallback Strategy

If TomTom API is unavailable or quota is exceeded:
1. Use cached historical data for time of day
2. Apply average speed factors based on road type
3. Use OpenStreetMap speed limits as baseline
4. Notify user that traffic data is unavailable

### 9.5 Alternative: Hybrid Approach

For production at scale, a hybrid approach can be used:
- **Primary**: TomTom Traffic API (official traffic data)
- **Secondary**: OpenWebNinja Waze API (community-reported incidents)
- **Cost**: $0-150/month depending on volume
- **Benefit**: Best of both worlds - official data + community reports

---

## 10. Database Design

### 10.1 Database Schema

The PostgreSQL database with PostGIS extension will have the following core tables:

**Users and Authentication**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  company_name VARCHAR(255),
  role VARCHAR(50) NOT NULL, -- admin, planner, dispatcher, driver
  api_key VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Routes**
```sql
CREATE TABLE routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL, -- planned, in_progress, completed, cancelled
  optimization_type VARCHAR(50), -- shortest_time, shortest_distance, balanced
  scheduled_date DATE,
  scheduled_start_time TIME,
  total_distance_meters INTEGER,
  total_duration_seconds INTEGER,
  total_stops INTEGER,
  vehicle_id UUID REFERENCES vehicles(id),
  driver_id UUID REFERENCES drivers(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Stops**
```sql
CREATE TABLE stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID REFERENCES routes(id) ON DELETE CASCADE,
  sequence_number INTEGER NOT NULL,
  address TEXT NOT NULL,
  location GEOGRAPHY(POINT, 4326) NOT NULL, -- PostGIS geography type
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  time_window_start TIME,
  time_window_end TIME,
  service_time_seconds INTEGER DEFAULT 300,
  priority INTEGER DEFAULT 0,
  notes TEXT,
  custom_data JSONB,
  status VARCHAR(50), -- pending, arrived, completed, failed
  arrival_time TIMESTAMP,
  departure_time TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Spatial index for efficient geographic queries
CREATE INDEX idx_stops_location ON stops USING GIST(location);
```

**Vehicles**
```sql
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  license_plate VARCHAR(50),
  vehicle_type VARCHAR(50), -- car, van, truck, motorcycle
  capacity_weight_kg INTEGER,
  capacity_volume_m3 DECIMAL(10, 2),
  capacity_items INTEGER,
  max_distance_km INTEGER,
  fuel_type VARCHAR(50),
  is_commercial BOOLEAN DEFAULT false,
  height_cm INTEGER, -- for commercial routing
  width_cm INTEGER,
  length_cm INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Drivers**
```sql
CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  license_number VARCHAR(100),
  skills JSONB, -- array of skills
  availability_schedule JSONB, -- weekly schedule
  current_location GEOGRAPHY(POINT, 4326),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Tracking History**
```sql
CREATE TABLE tracking_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES drivers(id),
  route_id UUID REFERENCES routes(id),
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  speed_kmh DECIMAL(5, 2),
  heading_degrees INTEGER,
  accuracy_meters DECIMAL(6, 2),
  recorded_at TIMESTAMP DEFAULT NOW()
);

-- Index for efficient time-based queries
CREATE INDEX idx_tracking_recorded_at ON tracking_history(recorded_at DESC);
CREATE INDEX idx_tracking_location ON tracking_history USING GIST(location);
```

**Optimizations (Audit Trail)**
```sql
CREATE TABLE optimizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  input_data JSONB NOT NULL, -- stores all input parameters
  output_data JSONB, -- stores optimization results
  optimization_type VARCHAR(50),
  status VARCHAR(50), -- pending, processing, completed, failed
  processing_time_ms INTEGER,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Address Book**
```sql
CREATE TABLE address_book (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  location GEOGRAPHY(POINT, 4326),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  phone VARCHAR(50),
  email VARCHAR(255),
  notes TEXT,
  custom_fields JSONB,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Proof of Delivery**
```sql
CREATE TABLE proof_of_delivery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stop_id UUID REFERENCES stops(id),
  driver_id UUID REFERENCES drivers(id),
  signature_url VARCHAR(500),
  photo_urls JSONB, -- array of photo URLs
  notes TEXT,
  recipient_name VARCHAR(255),
  barcode_data VARCHAR(255),
  custom_form_data JSONB,
  location GEOGRAPHY(POINT, 4326),
  completed_at TIMESTAMP DEFAULT NOW()
);
```

### 10.2 Database Indexes

Critical indexes for performance:
- Spatial indexes on all geography columns
- Composite indexes on (user_id, created_at) for user data queries
- Index on route status for dashboard queries
- Index on stop sequence_number for route ordering
- Index on tracking_history recorded_at for time-series queries

### 10.3 Database Scaling

**Vertical Scaling**
- Start with PostgreSQL on a single server
- Upgrade to larger instances as needed

**Horizontal Scaling (Future)**
- Read replicas for analytics queries
- Partitioning of tracking_history table by date
- Sharding by user_id for multi-tenant isolation

---

## 11. API Specifications

### 11.1 REST API Endpoints

**Authentication**
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
GET    /api/v1/auth/me
```

**Routes**
```
GET    /api/v1/routes
POST   /api/v1/routes
GET    /api/v1/routes/:id
PUT    /api/v1/routes/:id
DELETE /api/v1/routes/:id
POST   /api/v1/routes/:id/duplicate
POST   /api/v1/routes/:id/dispatch
```

**Optimization**
```
POST   /api/v1/optimize
GET    /api/v1/optimize/:id/status
GET    /api/v1/optimize/:id/result
POST   /api/v1/optimize/:id/cancel
```

**Stops**
```
GET    /api/v1/routes/:routeId/stops
POST   /api/v1/routes/:routeId/stops
PUT    /api/v1/stops/:id
DELETE /api/v1/stops/:id
POST   /api/v1/stops/:id/resequence
```

**Vehicles**
```
GET    /api/v1/vehicles
POST   /api/v1/vehicles
GET    /api/v1/vehicles/:id
PUT    /api/v1/vehicles/:id
DELETE /api/v1/vehicles/:id
```

**Drivers**
```
GET    /api/v1/drivers
POST   /api/v1/drivers
GET    /api/v1/drivers/:id
PUT    /api/v1/drivers/:id
DELETE /api/v1/drivers/:id
GET    /api/v1/drivers/:id/location
```

**Tracking**
```
GET    /api/v1/tracking/routes/:routeId
POST   /api/v1/tracking/location
GET    /api/v1/tracking/history/:driverId
```

**Address Book**
```
GET    /api/v1/addresses
POST   /api/v1/addresses
GET    /api/v1/addresses/:id
PUT    /api/v1/addresses/:id
DELETE /api/v1/addresses/:id
POST   /api/v1/addresses/import
```

**Analytics**
```
GET    /api/v1/analytics/routes
GET    /api/v1/analytics/drivers
GET    /api/v1/analytics/performance
POST   /api/v1/analytics/export
```

### 11.2 WebSocket Events

**Real-Time Tracking**
```
// Client -> Server
emit('subscribe:route', { routeId })
emit('unsubscribe:route', { routeId })
emit('location:update', { driverId, location, timestamp })

// Server -> Client
on('location:updated', { driverId, location, timestamp })
on('route:status', { routeId, status })
on('stop:completed', { stopId, routeId })
on('eta:updated', { routeId, stopId, eta })
```

### 11.3 API Response Format

All API responses follow a consistent format:

**Success Response**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2026-01-07T10:00:00Z",
    "version": "1.0"
  }
}
```

**Error Response**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "stops",
        "message": "At least 2 stops are required"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-01-07T10:00:00Z",
    "version": "1.0"
  }
}
```

---

## 12. Security Architecture

### 12.1 Authentication and Authorization

**Authentication Methods**
- **Email/Password**: Standard user authentication with bcrypt password hashing
- **JWT Tokens**: Stateless authentication for API requests
- **API Keys**: For programmatic access and integrations
- **OAuth 2.0**: Future support for third-party authentication

**Authorization Model**
- **Role-Based Access Control (RBAC)**: Admin, Planner, Dispatcher, Driver roles
- **Resource-Level Permissions**: Users can only access their own data
- **API Key Scopes**: Limit API key permissions to specific operations

### 12.2 Data Security

**Encryption**
- **In Transit**: TLS 1.3 for all API communications
- **At Rest**: Database encryption for sensitive fields
- **Passwords**: Bcrypt with salt rounds of 12
- **API Keys**: Hashed and stored securely

**Data Privacy**
- **GDPR Compliance**: Right to access, rectify, and delete personal data
- **Data Retention**: Configurable retention policies
- **Anonymization**: Personal data anonymization for analytics

### 12.3 API Security

**Rate Limiting**
- Per user: 1000 requests per hour
- Per IP: 100 requests per minute
- Optimization endpoint: 10 requests per minute

**Input Validation**
- Schema validation using Zod
- SQL injection prevention via parameterized queries
- XSS prevention via input sanitization

**Security Headers**
- Content Security Policy (CSP)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security

---

## 13. Deployment Strategy

### 13.1 Infrastructure

**Cloud Provider**: AWS (Amazon Web Services)

**Services Used**
- **EKS (Elastic Kubernetes Service)**: Container orchestration
- **RDS (Relational Database Service)**: Managed PostgreSQL with PostGIS
- **ElastiCache**: Managed Redis for caching
- **S3**: Object storage for files and backups
- **CloudFront**: CDN for static assets
- **Route 53**: DNS management
- **ALB (Application Load Balancer)**: Load balancing
- **CloudWatch**: Monitoring and logging

### 13.2 Kubernetes Deployment

**Namespaces**
- `production`: Production environment
- `staging`: Staging environment
- `development`: Development environment

**Deployments**
- Frontend: 3 replicas with horizontal pod autoscaling
- API Gateway: 3 replicas with HPA
- Optimization Service: 2 replicas (CPU-intensive)
- Other Services: 2 replicas each

**Resource Limits**
```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

### 13.3 CI/CD Pipeline

**GitHub Actions Workflow**

1. **Code Push**: Developer pushes code to GitHub
2. **Linting**: ESLint and Prettier checks
3. **Type Checking**: TypeScript compilation
4. **Unit Tests**: Jest test suite
5. **Integration Tests**: API endpoint tests
6. **Build**: Docker image build
7. **Push**: Push to AWS ECR (Elastic Container Registry)
8. **Deploy**: Update Kubernetes deployments
9. **Smoke Tests**: Verify deployment health
10. **Rollback**: Automatic rollback on failure

### 13.4 Monitoring and Alerting

**Prometheus Metrics**
- Request rate and latency
- Error rate
- Database connection pool
- Cache hit rate
- Optimization processing time

**Grafana Dashboards**
- System overview
- API performance
- Database performance
- Business metrics (routes created, optimizations run)

**Alerts**
- High error rate (> 5%)
- High latency (> 500ms p95)
- Database connection issues
- Service downtime

---

## 14. Cost Analysis

### 14.1 Development Phase Costs

| Item | Cost | Notes |
|:-----|:-----|:------|
| TomTom Traffic API | $0 | Free tier: 2,500 req/day |
| CARTO Map Tiles | $0 | Free, no API key required |
| OpenCage Geocoding | $0 | Free tier: 2,500 req/day |
| AWS (Development) | ~$100/month | Small EC2 instances, RDS |
| **Total** | **~$100/month** | |

### 14.2 Production Phase Costs (Estimated)

**Scenario: 1,000 active users, 10,000 routes/month**

| Item | Cost | Notes |
|:-----|:-----|:------|
| AWS EKS | $73/month | Cluster management fee |
| AWS EC2 (Compute) | ~$300/month | 6 x t3.large instances |
| AWS RDS (PostgreSQL) | ~$150/month | db.t3.large with Multi-AZ |
| AWS ElastiCache (Redis) | ~$50/month | cache.t3.medium |
| AWS S3 | ~$20/month | 100 GB storage |
| AWS Data Transfer | ~$50/month | Outbound data |
| TomTom Traffic API | $0-50/month | Free tier + overage |
| OpenCage Geocoding | $0-50/month | Free tier + overage |
| **Total** | **~$693-793/month** | |

### 14.3 Scaling Costs

**Scenario: 10,000 active users, 100,000 routes/month**

| Item | Cost | Notes |
|:-----|:-----|:------|
| AWS Compute | ~$1,200/month | Auto-scaling instances |
| AWS RDS | ~$500/month | Larger instance + read replicas |
| AWS ElastiCache | ~$150/month | Cluster mode |
| TomTom Traffic API | ~$200/month | Higher volume tier |
| Other Services | ~$200/month | S3, data transfer, etc. |
| **Total** | **~$2,250/month** | |

### 14.4 Cost Optimization Strategies

1. **Caching**: Aggressive caching to reduce API calls
2. **Reserved Instances**: 40% savings on predictable workloads
3. **Spot Instances**: 70% savings for non-critical services
4. **Auto-scaling**: Scale down during off-peak hours
5. **CDN**: Reduce data transfer costs
6. **Database Optimization**: Efficient queries and indexes

---

## 15. Implementation Roadmap

### 15.1 Phase 1: MVP (Months 1-3)

**Goal**: Launch a functional route planning application with core features

**Features**
- User authentication and registration
- Manual route creation with map interface
- Basic route optimization (shortest time/distance)
- Address geocoding and validation
- Route visualization on map
- Export routes to CSV

**Deliverables**
- Frontend web application
- Backend API with core services
- PostgreSQL database with PostGIS
- Basic deployment on AWS

### 15.2 Phase 2: Advanced Optimization (Months 4-5)

**Goal**: Implement advanced optimization features and constraints

**Features**
- Time window constraints
- Vehicle capacity constraints
- Multi-depot routing
- Commercial vehicle routing
- Avoidance zones
- Route optimization profiles

**Deliverables**
- Enhanced optimization engine
- Constraint validation system
- Advanced UI for constraint configuration

### 15.3 Phase 3: Real-Time Traffic (Month 6)

**Goal**: Integrate real-time traffic data for accurate routing

**Features**
- TomTom Traffic API integration
- Traffic-aware route optimization
- Real-time ETA updates
- Traffic incident display on map
- Historical traffic patterns

**Deliverables**
- Traffic integration module
- Caching layer for traffic data
- Updated optimization algorithms

### 15.4 Phase 4: Dispatch and Tracking (Months 7-8)

**Goal**: Enable route dispatch and real-time driver tracking

**Features**
- Driver management
- Route assignment and dispatch
- Real-time GPS tracking
- Live location updates on map
- Driver mobile app (basic)

**Deliverables**
- Dispatch service
- Tracking service
- WebSocket real-time communication
- Mobile app (iOS/Android)

### 15.5 Phase 5: Proof of Delivery (Month 9)

**Goal**: Implement proof of delivery features

**Features**
- Photo capture
- Signature capture
- Barcode scanning
- Custom form fields
- Delivery confirmation

**Deliverables**
- POD service
- File storage integration (S3)
- Mobile app updates

### 15.6 Phase 6: Analytics and Reporting (Month 10)

**Goal**: Provide business intelligence and reporting

**Features**
- Route performance analytics
- Driver performance metrics
- Planned vs actual analysis
- Custom reports
- Data export

**Deliverables**
- Analytics service
- Reporting dashboards
- Export functionality

### 15.7 Phase 7: Integrations and API (Month 11)

**Goal**: Enable third-party integrations

**Features**
- Public REST API
- Webhook support
- API documentation
- SDK libraries
- Integration marketplace

**Deliverables**
- API documentation
- SDK packages (JavaScript, Python)
- Integration examples

### 15.8 Phase 8: Polish and Optimization (Month 12)

**Goal**: Optimize performance and user experience

**Features**
- Performance optimization
- UI/UX improvements
- Mobile app enhancements
- Advanced features based on user feedback

**Deliverables**
- Optimized application
- Comprehensive documentation
- Production-ready system

---

## 16. Conclusion

This architecture specification provides a comprehensive blueprint for building a Route4Me clone with modern technologies, cost-effective real-time traffic integration, and a scalable microservices architecture. The system is designed to deliver flawless route optimization while maintaining near real-time traffic awareness through the TomTom Traffic API.

The use of MapCN for the UI framework, combined with React and TypeScript, ensures a modern, maintainable frontend. The NestJS backend with PostgreSQL and PostGIS provides a robust, scalable foundation for complex routing operations.

The phased implementation roadmap allows for iterative development and early user feedback, while the modular architecture enables easy addition of new features and integrations.

---

## References

[1] MapCN Documentation. (n.d.). *Installation - mapcn*. Retrieved from https://mapcn.vercel.app/docs/installation

[2] TomTom Developer Portal. (2024). *Introduction | Traffic API | TomTom Developer Portal*. Retrieved from https://developer.tomtom.com/traffic-api/documentation/tomtom-maps/product-information/introduction

[3] Route4Me. (n.d.). *Last Mile Route Planning Software*. Retrieved from https://route4me.com/platform/route-planning-software

[4] Route4Me Support. (2026). *Mobile Subscriptions Features – Android And iPhone Route Planner Apps*. Retrieved from https://support.route4me.com/mobile-route-planner-features-and-mobile-subscriptions/

[5] Route4Me. (n.d.). *Route4Me Route Optimization API*. Retrieved from https://route4me.io/docs/

[6] OpenWeb Ninja. (n.d.). *Waze API*. Retrieved from https://www.openwebninja.com/api/waze

---

**Document Version:** 1.0  
**Last Updated:** January 7, 2026  
**Author:** Manus AI
