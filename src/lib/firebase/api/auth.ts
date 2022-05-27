import { signInAnonymously } from 'firebase/auth';

import { auth } from '..';

/**
 * Firebase Auth へのリクエスト
 */
const FirebaseAuth = {
  anonymousSignIn: async () => {
    if (!auth) return;
    const user = await signInAnonymously(auth);
    return user.user.uid;
  },
};

export default FirebaseAuth;
