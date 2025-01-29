const admin = require('firebase-admin');
const serviceAccount = require('../firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const verifyIdToken = async (idToken) => {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      console.log(decodedToken); // Here you can access the user info and proceed with login.
    } catch (error) {
      console.error("Error verifying ID token:", error);
    }
  };

module.exports = admin;
