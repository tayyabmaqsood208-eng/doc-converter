/** Same-origin API base for local Vite proxy and single-service production. */
export const API_BASE_URL =
  ((import.meta as any).env?.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || '/api';
