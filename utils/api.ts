import axios from "axios";

export const api = axios.create({
  baseURL: "/api", // Points to your Nuxt server routes
  headers: {
    "Content-Type": "application/json",
  },
});
