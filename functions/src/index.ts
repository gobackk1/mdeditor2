const functions = require('firebase-functions')
const firebaseTools = require('firebase-tools')

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

exports.recursiveDelete = functions
	.region('asia-northeast1')
	.runWith({
		timeoutSeconds: 540,
		memory: '2GB'
	})
	//@ts-ignore
	.https.onCall((data, context) => {
		if (!(context.auth && context.auth.token)) {
			throw new functions.https.HttpsError(
				'permission-denied',
				'Must be an administrative user to initiate delete'
			)
		}

		const path = data.path
		console.log(
			`User ${context.auth.uid} has requested to delete path ${path}`
		)

		return firebaseTools.firestore
			.delete(path, {
				project: process.env.GCLOUD_PROJECT,
				recursive: true,
				yes: true,
				token: functions.config().fb.token
			}).then(() => {
				return { path: path }
			})
	})
