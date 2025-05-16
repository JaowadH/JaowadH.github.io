// functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true}); // Ensures Access-Control-Allow-Origin reflects the request's origin

admin.initializeApp(); // Initialize Firebase Admin SDK

const db = admin.firestore();

exports.submitContactForm = functions.https.onRequest((request, response) => {
  // Pass the request and response to the cors handler
  cors(request, response, async () => {
    // Explicitly handle OPTIONS preflight requests for CORS
    if (request.method === "OPTIONS") {
      response.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS"); // Specify allowed methods
      response.set("Access-Control-Allow-Headers", "Content-Type"); // Specify allowed headers
      response.set("Access-Control-Max-Age", "3600"); // Optional: Cache preflight response for 1 hour
      response.status(204).send(""); // Respond with 204 No Content for OPTIONS
      return; // Important to end execution here for OPTIONS
    }

    // Handle actual POST request
    if (request.method !== "POST") {
      // If not OPTIONS or POST, then Method Not Allowed
      return response.status(405).send("Method Not Allowed");
    }

    try {
      const {name, email, message} = request.body;

      if (!name || !email || !message) {
        // Send a JSON response for errors too, for consistency
        return response.status(400).json({error: "Missing required fields."});
      }

      const submission = {
        name: name,
        email: email,
        message: message,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      };

      const writeResult = await db
        .collection("contactSubmissions")
        .add(submission);

      console.log("Form submission successful:", writeResult.id);
      // Send a JSON response for success
      return response.status(200).json({
        message: "Form submitted successfully!",
        submissionId: writeResult.id,
      });
    } catch (error) {
      console.error("Error submitting form in function:", error);
      // Send a JSON response for server errors
      return response
        .status(500)
        .json({error: "Server error processing request. Please try again."});
    }
  });
});
// <<< MAKE SURE THERE IS A BLANK LINE AFTER THIS LINE (Press Enter once) >>>
