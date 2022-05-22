import { FirebaseOptions } from '@firebase/app';

/**
 * firebase
 */
export const firebaseConfig: FirebaseOptions | null = null;
// {
//   apiKey: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLM',
//   authDomain: 'xxx.firebaseapp.com',
//   projectId: 'xxx',
//   storageBucket: 'xxx.appspot.com',
//   messagingSenderId: '123456789012',
//   appId: '1:123456789012:web:abcdefghijklmnopqrstuv',
//   measurementId: 'A-BCDEFGHIJK',
// };

export const firebaseBucketUrl: string | undefined = undefined;
// gs://xxx.appspot.com

export const basicAuthConfig = {
  enabled: false, // false の場合は BASIC 認証が行われない
  user: 'sample',
  pass: 'sample',
};
