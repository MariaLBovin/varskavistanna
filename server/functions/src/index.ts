/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require('firebase-functions');
const express = require('express');

// Skapa en Express-app
const app = express();

// Middleware och rutter
app.get('/hello', (req: any, res: { send: (arg0: string) => void; }) => {
  res.send('Hello from Firebase Cloud Functions with Express!');
});

// Exportera Express-appen som en Cloud Function
exports.api = functions.https.onRequest(app);


// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
