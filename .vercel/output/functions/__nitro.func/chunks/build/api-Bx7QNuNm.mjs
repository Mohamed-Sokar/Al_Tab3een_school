import axios from 'axios';

const api = axios.create({
  baseURL: "/api",
  // Points to your Nuxt server routes
  headers: {
    "Content-Type": "application/json"
  }
});

export { api as a };
//# sourceMappingURL=api-Bx7QNuNm.mjs.map
