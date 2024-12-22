import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import * as Crypto from 'expo-crypto';

export const takePhoto = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [9, 16],
        quality: 1,
      });
      const newUuid = Crypto.randomUUID();
      setUuid(newUuid); // Save UUID in state
      console.log('Photo result:', result);

      if (!result.canceled && result.assets.length > 0) {
        const { uri } = result.assets[0];
        setPhoto(uri);
        console.log('Photo URI:', uri);
      } else {
        console.log('User cancelled photo action');
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };

export const uploadImage = async () => {
    if (!photo) {
      setMessage('No photo to upload');
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      const response = await fetch(photo);
      const blob = await response.blob();

      const storage = getStorage();
      const storageRef = ref(storage, uuid);

      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.error('Upload failed:', error);
          setMessage('Upload failed: ' + error.message);
          setUploading(false);
        },
        () => {
          setUploading(false);
          setMessage('Upload successful!');
          console.log('Upload successful');
        }
      );
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage('Upload failed: ' + error.message);
      setUploading(false);
    }

  };
