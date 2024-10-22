"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from 'firebase-functions/v2/https';
 * import {onDocumentWritten} from 'firebase-functions/v2/firestore';
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const functions = require("firebase-functions");
const express = require("express");
const google_maps_services_js_1 = require("@googlemaps/google-maps-services-js");
const cors = require("cors");
const axios_1 = require("axios");
const app = express();
app.use(cors({ origin: ['https://localhost:5173'] }));
const client = new google_maps_services_js_1.Client({});
const GOOGLE_API_KEY = functions.config().google.apikey;
const OPENCHARGE_KEY = functions.config().openchargemap.api_key;
// Middleware och rutter
app.get('/hello', (req, res) => {
    res.send('Hello from Firebase Cloud Functions with Express!');
});
// Ny rutt för att söka laddstationer
app.get('/charging-stations', async (req, res) => {
    const { latitude, longitude, radius } = req.query;
    if (!latitude || !longitude) {
        return res.status(400).send('Latitude and longitude are required');
    }
    try {
        const response = await axios_1.default.get('https://api.openchargemap.io/v3/poi/', {
            params: {
                output: 'json',
                latitude: latitude,
                longitude: longitude,
                maxdistance: radius || 5,
                maxresults: 50,
                key: OPENCHARGE_KEY,
            },
        });
        console.log('API Response:', response.data);
        return res.json(response.data);
    }
    catch (error) {
        console.error('Error fetching charging stations:', error);
        return res.status(500).send('Error fetching charging stations');
    }
});
app.get('/nearby-places', async (req, res) => {
    const { latitude, longitude, radius, type } = req.query;
    if (!latitude || !longitude || !type) {
        return res.status(400).send('Latitude, longitude, and type are required');
    }
    console.log('request with params:', { latitude, longitude, radius, type });
    try {
        const response = await client.placesNearby({
            params: {
                location: { lat: Number(latitude), lng: Number(longitude) },
                radius: radius ? Number(radius) : 1500,
                type: type,
                key: GOOGLE_API_KEY,
            },
            timeout: 1000,
        });
        console.log('Nearby Places API Response:', response.data.results);
        return res.json(response.data.results);
    }
    catch (error) {
        console.error('Error fetching nearby places:', error);
        return res.status(500).send('Error fetching nearby places');
    }
});
exports.api = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map