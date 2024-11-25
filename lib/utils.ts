import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

