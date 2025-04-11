
import { createContext } from 'react';

// Define a basic hotel configuration type
export interface HotelConfig {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  tertiaryColor?: string;
  features?: {
    [key: string]: boolean;
  };
  [key: string]: any;
}

// Create context with an empty default value
export const HotelConfigContext = createContext<HotelConfig>({});
