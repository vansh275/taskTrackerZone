# Geofence Event Processing Service

## Project Overview
This service is a location-based system designed to track vehicles for a taxi company. It processes real-time GPS location events to detect when vehicles enter or exit specific geographic zones and allows for querying the current zone status of a vehicle.

## Prerequisites
* **Node.js**: Ensure Node.js is installed (v18 or higher recommended).
* **npm**: Node Package Manager.

## Setup Instructions

1. **Clone the Repository**
   git clone <https://github.com/vansh275/Geofence-Event-Processing.git>
   cd Geofence-Event-Processing

2. **Install Dependencies**
   Install the required packages defined in `package.json`:
   npm install

3. **Run the Service**
   Start the server using Node.js:
   node index.js
   
   The server will start on **Port 3000**.

## API Documentation

### 1. Process Location Event
Accepts GPS coordinates from a vehicle to update its status and check for zone transitions.

* **Endpoint**: `POST /api/location`
* **Content-Type**: `application/json`
* **Body Parameters**:
    * `vehicleId` (string): Unique identifier for the vehicle.
    * `lat` (number): Latitude.
    * `lon` (number): Longitude.
* **Example Request**:
    {
      "vehicleId": "v123",
      "lat": 40.7300,
      "lon": -74.0000
    }
* **Behavior**:
    * Updates the vehicle's last known location.
    * Logs messages to the console if the vehicle enters or exits a defined zone (e.g., "Vehicle v123 entered zone Z001").

### 2. Query Vehicle Status
Retrieves the current zone identifier for a specific vehicle.

* **Endpoint**: `GET /api/:vehicleId/zonestatus`
* **Example Request**:
    GET http://localhost:3000/api/v123/zonestatus
* **Example Response**:
    {
      "vehicleId": "v123",
      "currentZone": "Z001" // or null if outside all zones
    }

## Design Decisions

In accordance with the requirements to demonstrate practical engineering judgment, the following architectural choices were made:

1. **In-Memory State Management**:
   * **Choice**: Vehicle state is stored in a Javascript `Map` (via `vehicleState.js`).
   * **Reasoning**: For the scope of this challenge, an in-memory store provides the fastest implementation and lowest latency without the overhead of setting up an external database.

2. **Modular Code Structure**:
   * **Choice**: Logic is split into `index.js` (Routes), `helperfxn.js` (Geometry), and `vehicleState.js` (State).
   * **Reasoning**: This improves readability and separates concerns between the API layer, business logic, and data layer.

3. **JSON Configuration for Zones**:
   * **Choice**: Zones are defined in `zones.json`.
   * **Reasoning**: Allows for easy modification of zone boundaries without changing the code logic.

## Assumptions

* **Zone Geometry**: Zones are rectangular and aligned with the coordinate system (defined by Southwest and Northeast corners).
* **Non-Overlapping Zones**: It is assumed that zones do not overlap. If they do, the first match found is returned.
* **Persistence**: Data persistence across server restarts is not required for this challenge.

## Future Improvements

Given more time, the following improvements would be prioritized:

1. **Persistence Layer**: Implement Redis or a database to persist vehicle state across server restarts.
2. **Spatial Indexing**: Use a spatial index (like R-Tree) or PostGIS to optimize zone lookups (`O(log n)` instead of `O(n)`).
3. **Input Validation**: Add a library like `joi` to strictly validate request bodies and coordinate ranges.
4. **Testing**: Add unit tests for the geometric helper functions.