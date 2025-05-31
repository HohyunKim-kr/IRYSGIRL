// utils/imageMap.ts
export const getTileImage = (value: number): string => {
    if (value === 0) return ''; // No image for empty tiles
    return `/images/${value}.png`; // Adjust path as needed
  };