import express from 'express';
import { findZone } from './helperfxn.js';
import { getState, updateState, getCurrentZone } from './vehicleState.js';

const app = express();
app.use(express.json());
const PORT = 3000;

app.post('/api/location', (req, res) => {
    console.log("location");
    const { vehicleId, lon, lat } = req.body;
    console.log(vehicleId, " ", lon, " ", lat);
    if (!vehicleId || lon === undefined || lat === undefined) {
        return res.status(400).json({ error: 'Missing required parameters: vehicleId, lat, lon, or timestamp' });
    }
    try {
        const newZoneId = findZone(lat, lon);
        const oldState = getState(vehicleId);
        const oldZoneId = oldState ? oldState.zoneId : null;

        let message = '';
        if (oldZoneId !== newZoneId) {
            if (newZoneId && !oldZoneId) {
                //Out->In
                message = `Vehicle ${vehicleId} entered zone ${newZoneId}`;
            }
            else if (!newZoneId && oldZoneId) {
                //In->Out
                message = `Vehicle ${vehicleId} exited zone ${oldZoneId}`;
            }
            else if (newZoneId && oldZoneId) {
                //still In
                message = `Vehicle ${vehicleId} moved from ${oldZoneId} to  ${newZoneId}`;
            }
            else if (!newZoneId && !oldZoneId) {
                //still Out
                message = `Vehicle ${vehicleId} still outside the zone`;
            }
            console.log(message);

        }

        updateState(vehicleId, newZoneId);

        return res.status(200).json({
            status: 'Processed',
            curZone: newZoneId
        });

    }
    catch (error) {
        console.log(`Error processing event for ${vehicleId}:`, error);
        return res.status(500).json({ error: 'Internal server error while processing event' });
    }
})
app.get('/api/:vehicleId/zonestatus', (req, res) => {
    console.log("status");
    const { vehicleId } = req.params;
    const currentZone = getCurrentZone(vehicleId);

    if (currentZone === null) {
        return res.status(404).json({ error: `Vehicle ${vehicleId} not found or never reported its location.` });
    }
    return res.status(200).json({
        vehicleId: vehicleId,
        currentZone: currentZone
    });
})


app.listen(PORT, () => {
    console.log(`Listening at ${PORT}`);
})