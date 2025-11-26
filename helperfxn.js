import ZONES from './zones.json' with {type: 'json'};
export function isPointInZone(point, zone) {
    const { sw, ne } = zone;
    const latCheck = point.lat >= sw.lat && point.lat <= ne.lat;
    const lonCheck = point.lon >= sw.lon && point.lon <= ne.lon;

    return latCheck && lonCheck;
}


export function findZone(lat, lon) {
    const point = { lat, lon };

    // Iterate through all defined zones and check for a match
    for (const zone of ZONES) {
        if (isPointInZone(point, zone)) {
            return zone.id;
        }
    }
    return null;
}
