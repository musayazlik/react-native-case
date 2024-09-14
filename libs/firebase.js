import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

if (getApps().length === 0) {
  initializeApp(firebaseConfig);
}

// Firebase app initialization
const app = initializeApp(firebaseConfig);

// Firestore initialization
const db = getFirestore(app);

// Firebase Storage initialization
const storage = getStorage(app);

// Upload image to Firebase Storage

/*
 * @param {string} uri - Image URI
 * @param {string} path - Path to store the image
 * @param {string} name - Image name
 * @param {string} type - Image type
 * @returns {Promise<string>} - Image URL
 * */

const metadata = {
  contentType: ["image/jpeg", "image/png"],
};

const uploadToFirebase = async (file, name) => {
  const fetchResponse = await fetch(file);
  const blob = await fetchResponse.blob();
  const imageRef = ref(storage, `images/${name}`);
  const uploadTask = uploadBytesResumable(imageRef, blob);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");

            break;
        }
      },
      (error) => {
        console.log(error);
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          resolve({
            url: downloadURL,
            name: name,
          });
        });
      }
    );
  });
};

export { db, storage, uploadToFirebase };
