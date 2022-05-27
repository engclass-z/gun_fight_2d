import { initializeApp, getApps } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Database, getDatabase } from 'firebase/database';
import { Firestore, getFirestore } from 'firebase/firestore';
import { FirebaseStorage, getStorage } from 'firebase/storage';

import { firebaseBucketUrl, firebaseConfig, firebaseDatabaseUrl } from '../../../config/config';

let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let database: Database | null = null;
if (firebaseConfig) {
  if (getApps().length === 0) {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app, firebaseBucketUrl);
    database = getDatabase(app, firebaseDatabaseUrl);
  }
}

export { auth };
export { db };
export { storage };
export { database };
