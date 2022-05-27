import { FirebaseOptions } from '@firebase/app';

/**
 * firebase
 */
export const firebaseConfig: FirebaseOptions | null = {
  apiKey: 'AIzaSyDRbKZOGIOHFbdLWOe0fbxS5bZ5ObOv4mY',
  authDomain: 'gun-fight-196f5.firebaseapp.com',
  projectId: 'gun-fight-196f5',
  storageBucket: 'gun-fight-196f5.appspot.com',
  messagingSenderId: '145619516197',
  appId: '1:145619516197:web:b8cf7daf8526efe1f478cc',
};

export const firebaseBucketUrl: string | undefined = undefined;
// gs://xxx.appspot.com

export const firebaseDatabaseUrl: string | undefined =
  'https://gun-fight-196f5-default-rtdb.firebaseio.com/';

export const basicAuthConfig = {
  enabled: false, // false の場合は BASIC 認証が行われない
  user: 'sample',
  pass: 'sample',
};
