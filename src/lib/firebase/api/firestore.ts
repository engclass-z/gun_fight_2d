import { doc, setDoc, Timestamp, addDoc, collection, getDoc } from 'firebase/firestore';

import { db } from '..';

/**
 * Firestore へのリクエスト
 */
const Firestore = {
  create: async <T>(path: string, params: Required<T>) => {
    if (!db) return false;
    const ref = collection(db, path);
    const date = Timestamp.fromDate(new Date());
    return addDoc(ref, { ...params, created: date, updated: date });
  },

  update: async <T>(path: string, id: string, params: T) => {
    if (!db) return false;
    const ref = doc(db, path, id);
    const updated = Timestamp.fromDate(new Date());
    return setDoc(ref, { ...params, updated }, { merge: true });
  },

  get: async <T>(path: string, id: string): Promise<T | null> => {
    if (!db) return null;
    const ref = doc(db, path, id);
    const document = getDoc(ref);
    return document.then((result) => (result.data() as T) ?? null);
  },
};

export default Firestore;
