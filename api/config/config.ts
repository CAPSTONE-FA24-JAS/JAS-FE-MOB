// src/api/config.ts
import { EXPO_PUBLIC_API_URL } from "@env";

const API_URL = EXPO_PUBLIC_API_URL || "http://localhost:7251";
console.log("API_URL:", API_URL); // Check if API_URL is defined

if (!API_URL) {
  throw new Error("API_URL is not defined. Check your .env file.");
}

export const apiConfig = {
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
};
