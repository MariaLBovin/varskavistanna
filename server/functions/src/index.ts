/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from 'firebase-functions/v2/https';
 * import {onDocumentWritten} from 'firebase-functions/v2/firestore';
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const functions = require('firebase-functions');
const express = require('express');
const {Client} = require('@googlemaps/google-maps-services-js');
const cors = require('cors');


const app = express();
app.use(cors({origin: ['https://localhost:5173']}));


const client = new Client({});

const GOOGLE_API_KEY = functions.config().google.apikey;

// Middleware och rutter
app.get('/hello', (req: any, res: { send: (arg0: string) => void; }) => {
  res.send('Hello from Firebase Cloud Functions with Express!');
});

// Ny rutt för att söka laddstationer
app.get('/charging-stations', async (
  req: {query: { latitude: string; longitude: string; radius: string; }; },
  res: {json: (arg0: any) => void; status: (arg0: number) =>
    { (): any; new(): any; send: {(arg0: string): void; new(): any; }; }; }
) => {
  const {latitude, longitude, radius} = req.query;

  if (!latitude || !longitude) {
    return res.status(400).send('Latitude and longitude are required');
  }
  console.log('Received request with params:', {latitude, longitude, radius});

  try {
    const response = await client.placesNearby({
      params: {
        location: `${latitude},${longitude}`,
        radius: radius || '1500',
        type: 'electric_vehicle_charging_station',
        key: GOOGLE_API_KEY,
      },
      timeout: 1000,
    });

    console.log('API Response:', response.data.results);

    res.json(response.data.results);
  } catch (error) {
    console.error('Error fetching charging stations:', error);
    res.status(500).send('Error fetching charging stations');
  }
});


exports.api = functions.https.onRequest(app);

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info('Hello logs!', {structuredData: true});
//   response.send('Hello from Firebase!');
// });
