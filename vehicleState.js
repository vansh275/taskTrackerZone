const vehicleStateMap = new Map();
export function getState(vehicleId) {
    return vehicleStateMap.get(vehicleId) || null;
}

export function updateState(vehicleId, newZoneId) {
    const newState = {
        zoneId: newZoneId,
    };
    vehicleStateMap.set(vehicleId, newState);
    return newState;
}

export function getCurrentZone(vehicleId) {
    const state = getState(vehicleId);
    return state ? state.zoneId : null;
}
