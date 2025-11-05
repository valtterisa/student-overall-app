import React from "react";

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseStyles = (hex: string | null): React.CSSProperties => {
  // Check if hex is null or empty
  if (!hex) {
    return { backgroundColor: '#ffffff' }; // Fallback to black if null or invalid hex
  }

  // Check for background-image (e.g., gradient)
  const backgroundImageMatch = hex.match(/background-image:\s*([^;]+);/);
  if (backgroundImageMatch) {
    return { backgroundImage: backgroundImageMatch[1] }; // Extract background image (e.g., gradient)
  }

  // Check for background-color
  const backgroundColorMatch = hex.match(/background:\s*([^;]+);/);
  if (backgroundColorMatch) {    
    return { background: backgroundColorMatch[1] }; // Extract background color
  }

  // If no match found, return a fallback (black) background
  return { backgroundColor: '#ffffff' };
};

export function capitalizeFirstLetter(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}