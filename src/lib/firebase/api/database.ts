import { ref, set, onValue } from 'firebase/database';

import { database } from '..';

/**
 * Realtime Database へのリクエスト
 */
const FirebaseDatabase = {
  write: async (path: string, value: { [key: string]: any }) => {
    if (!database) return;
    await set(ref(database, path), value);
  },

  listen: (path: string, callback: (value: any) => void) => {
    if (!database) return null;
    onValue(ref(database, path), (snapshot) => callback(snapshot.val()));
  },
};

export default FirebaseDatabase;
