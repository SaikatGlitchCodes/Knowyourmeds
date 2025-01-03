import create from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist } from 'zustand/middleware';

export const UPLOAD_STATUS = {
  IDLE: 'IDLE',
  UPLOADING: 'UPLOADING',
  ANALYSING: 'ANALYSING',
  DONE: 'DONE',
  ERROR: 'ERROR'
};

export const useUploadStore = create(
  persist(
    (set) => ({
      status: UPLOAD_STATUS.IDLE,
      progress: 0,
      isVisible: false,
      
      setStatus: (status) => set({ status }),
      setProgress: (progress) => set({ progress }),
      show: () => set({ isVisible: true }),
      hide: () => set({ isVisible: false, status: UPLOAD_STATUS.IDLE, progress: 0 }),
    }),
    {
      name: 'upload-storage',
      storage: AsyncStorage,
      getStorage: () => AsyncStorage,
    }
  )
);