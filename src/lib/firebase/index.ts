import { initializeApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
import { FirebaseStorage, getStorage } from 'firebase/storage';
import { firebaseBucketUrl, firebaseConfig } from '../../../config/config';

let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
if (firebaseConfig) {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  storage = getStorage(app, firebaseBucketUrl);
}

export { db };
export { storage };
