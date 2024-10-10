export const firebaseCredentials = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
}

export const lexCredentials = {
    region: process.env.REACT_APP_LEX_REGION,
    accessKeyId: process.env.REACT_APP_LEX_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_LEX_SECRET_ACCESS_KEY,
}