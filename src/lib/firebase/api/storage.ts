import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { storage } from '..';

const Storage = {
  /**
   * 画像をアップロードする
   * アップロードに成功した場合、ダウンロード URL を promise で返します
   * 既に画像が存在している場合、上書き保存されます
   */
  uploadImage: async (params: { path: string; file: File }): Promise<string> => {
    if (!storage) return '';
    const { path, file } = params;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  },
};

export default Storage;
