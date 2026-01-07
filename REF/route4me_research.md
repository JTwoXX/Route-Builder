# Route4Me Research - Feature Analysis

## Core Features Identified

### Route Planning & Optimization
- **Patented route optimization engine** - Industry standard for speed and accuracy
- **Real-time adjustments** - Dynamic route optimization that instantly reoptimizes when changes occur
- **Flexible business rules** - Customizable constraints for unique logistics needs
- **Multiple stop route planning** - Optimize routes with unlimited stops
- **Route visualization** - Interactive maps showing optimized routes

### Constraints & Business Rules
- Time Windows
- Max Stops per route
- Max Distance per route
- Max Time per route
- Vehicle Capacity constraints
- Mixed Fleets support
- Max Drivers & Vehicles
- Avoidance Zones
- Turn Avoidance
- Stop Priority
- Curbside delivery
- And many more...

### Advanced Capabilities
- **Commercial Truck Routing** - Plan safe routes for commercial vehicles
- **Mixed Vehicles Routing** - Optimize multiple vehicle types at once
- **Curbside Delivery** - Set exact locations for unusual stops
- **Pickup And Dropoff** - Pair stops for item receipt and delivery
- **Recurring Routing** - Simplify scheduling for repeat customers
- **Max Cube Per Route** - Load vehicles to capacity every time
- **Smartzone Routing** - Automated territory creation and optimization

### Fleet Management
- Overview of entire operation with multiple routes and drivers
- Re-assign drivers and vehicles
- Move addresses between routes
- Track route progress in real-time
- Connected to Mobile Apps for instant notifications

### Dynamic Adjustments
- Add extra stops on the fly
- Update addresses in real-time
- Handle unexpected delays
- Instant reoptimization when changes are made

## URLs to Explore Further
- Platform overview: https://route4me.com/platform/route-planning-software
- Mobile features: https://support.route4me.com/mobile-route-planner-features-and-mobile-subscriptions/
- Route management: https://support.route4me.com/route-planner-routes-list/
- API documentation: https://route4me.com (API section)


## Mobile App Features (from support.route4me.com)

### Add Addresses and Import Route Data
- Add Addresses to Routes Manually
- OCR Address Scanner
- Add Addresses with Voice Dictation
- Select Addresses from Device Contacts
- Use Route4Me Address Book
- Import Files with Addresses and Route Data
- Google Drive Route File Import (CSV & XLS)
- Dropbox Route File Import (CSV & XLS)
- Upload Route Files from Device (CSV & XLS)
- Use Current Location Address

### Plan Multi-Stop Routes
- Plan Multi-Stop Routes (Map and Manually Sequence Multi-Stop Routes)
- Schedule Routes
- Dynamic Route Start Time

### Optimize and Sequence Multi-Stop Routes
- Optimize Routes (Map and Automatically Sequence Multi-Stop Routes)
- Unlimited Route Optimizations
- Unlimited Stops Sequencing
- Round Trip Route Optimization
- Lock Last Destination Route Optimization
- End Anywhere Route Optimization
- Disable Route Optimization and End Anywhere
- Disable Route Optimization and Round Trip
- Default Route Optimization Settings Profile

### Route Directions Optimization
- Shortest Time Route Directions Optimization
- Shortest Time with Current Traffic Directions Optimization
- Routes Map
- Change Route Optimization Settings
- Update Route Directions Settings
- Reschedule Planned Routes
- Export Route Files (CSV and Google Spreadsheets)
- Duplicate Routes
- Share Routes
- Delete Routes

### Stops Management
- Insert Stops into Planned Routes
- Change Route Stops Sequence
- Edit Route Stops Addresses and Information
- Route Stops Service Times
- Route Stops Custom Data
- Open Route Stops on the Map
- Delete Route Stops


## API Documentation Summary (from route4me.io/docs)

### API Overview
- **100% RESTful** routing engine with portable algorithm backends
- Solves complex routing problems in a single HTTP request
- Regularly updated API documentation
- Language bindings: C#, VB.NET, Python, Java, Node, C++, Ruby, PHP, Go, Erlang, Perl, cURL, VBScript

### Core API Capabilities

#### Optimizations API
- Create optimization problems with collections of addresses
- Considers all addresses and constraints (time windows, vehicle capacity, etc.)
- Solves optimization to generate multiple routes
- Callback URL support for async optimization completion
- Support for separate depots section
- Optimization states: 1-6 (including OPTIMIZED=4, ERROR=5)

#### Route Parameters
- Time windows
- Vehicle capacity constraints
- Driver schedules
- Multiple depots support
- Turn restrictions
- Avoidance zones

### API Resources Managed
- Address books
- Members (users)
- Drivers
- Vehicles
- Tracking data
- Avoidance zones
- Notes and attachments
- Orders

### HTTP Methods
- GET: Retrieving resources
- PUT: Updating resources
- POST: Creating resources
- DELETE: Deleting resources

### Authentication
- Unique API key per account
- API key found in My Account > API section
- Demo API key has restrictions (predefined coordinates only)

### Response Format
- JSON-encoded responses (some XML)
- Contains: success flag, message, response data

Source: https://route4me.io/docs/
