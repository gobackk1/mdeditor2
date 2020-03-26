const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.

// @ts-ignore
exports.helloWorld = functions.https.onCall((data, context) => {
  return 'hello'
})
// @ts-ignore
exports.yeah = functions.region('asia-northeast1').https.onCall((data, context) => {
	return {
		text: 'static',
		testData: data,
		testContext: context.auth
	}
})
