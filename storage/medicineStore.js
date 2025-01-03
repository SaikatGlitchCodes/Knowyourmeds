import AsyncStorage from '@react-native-async-storage/async-storage';
import create from 'zustand';
import { persist } from 'zustand/middleware';

export const useMedicineStore = create(
  persist(
    (set, get) => ({
      medicines: [], // Array to store multiple medicines

      // Add a new medicine
      addMedicine: (medicine) => {
        set((state) => ({
          medicines: [...state.medicines, medicine],
        }));
      },

      // Update a specific medicine by name (or another unique field if needed)
      updateMedicine: (medicineName, updatedFields) => {
        set((state) => ({
          medicines: state.medicines.map((medicine) =>
            medicine.medicine === medicineName
              ? { ...medicine, ...updatedFields }
              : medicine
          ),
        }));
      },

      // Delete a medicine by name (or another unique field)
      deleteMedicine: (medicineName) => {
        set((state) => ({
          medicines: state.medicines.filter((medicine) => medicine.medicine !== medicineName),
        }));
      },
    }),
    {
      name: 'medicine-storage', // Unique name for the storage
      storage: AsyncStorage, // Use AsyncStorage for React Native
      getStorage: () => AsyncStorage, // Explicitly specify storage for async
    }
  )
);
