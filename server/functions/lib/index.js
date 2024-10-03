"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nearbyPlaces = exports.chargingStations = exports.helloWorld = void 0;
const https_1 = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const google_maps_services_js_1 = require("@googlemaps/google-maps-services-js");
const axios_1 = require("axios");
const client = new google_maps_services_js_1.Client({});
const handleCors = (response) => {
    response.set('Access-Control-Allow-Origin', '*');
    response.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.set('Access-Control-Allow-Headers', 'Content-Type');
};
exports.helloWorld = (0, https_1.onRequest)((request, response) => {
    handleCors(response);
    if (request.method === 'OPTIONS') {
        response.status(204).send('');
        return;
    }
    logger.info('Hello logs!', { structuredData: true });
    response.send('Hello from Firebase!');
});
exports.chargingStations = (0, https_1.onRequest)(async (request, response) => {
    handleCors(response);
    if (request.method === 'OPTIONS') {
        response.status(204).send('');
        return;
    }
    const { latitude, longitude, radius } = request.query;
    if (!latitude || !longitude) {
        response.status(400).send('Latitude and longitude are required');
        return;
    }
    logger.info('Received request with params:', { latitude, longitude, radius });
    try {
        const apiResponse = await axios_1.default.get('https://api.openchargemap.io/v3/poi/', {
            params: {
                output: 'json',
                latitude: latitude,
                longitude: longitude,
                maxdistance: 10,
                maxresults: 50,
                key: process.env.OPENCHARGER_API_KEY,
            },
        });
        logger.info('API Response:', apiResponse.data);
        const filteredStations = apiResponse.data.filter((station) => {
            var _a, _b;
            return (((_a = station.StatusType) === null || _a === void 0 ? void 0 : _a.IsOperational) === true &&
                ((_b = station.OperatorInfo) === null || _b === void 0 ? void 0 : _b.Title));
        });
        logger.info('Filtered Stations:', filteredStations);
        response.json(filteredStations);
    }
    catch (error) {
        logger.error('Error fetching charging stations:', error);
        response.status(500).send('Error fetching charging stations');
    }
});
exports.nearbyPlaces = (0, https_1.onRequest)(async (request, response) => {
    handleCors(response);
    if (request.method === 'OPTIONS') {
        response.status(204).send('');
        return;
    }
    const { latitude, longitude, radius, type } = request.query;
    if (!latitude || !longitude || !type) {
        response.status(400).send('Latitude, longitude, and type are required');
        return;
    }
    logger.info('Request with params:', { latitude, longitude, radius, type });
    try {
        const apiResponse = await client.placesNearby({
            params: {
                location: `${latitude},${longitude}`,
                radius: parseInt(radius, 10) || 1500,
                type: type,
                key: process.env.GOOGLE_API_KEY,
            },
            timeout: 1000,
        });
        logger.info('Nearby Places API Response:', apiResponse.data.results);
        response.json(apiResponse.data.results);
    }
    catch (error) {
        logger.error('Error fetching nearby places:', error);
        response.status(500).send('Error fetching nearby places');
    }
});
//# sourceMappingURL=index.js.map