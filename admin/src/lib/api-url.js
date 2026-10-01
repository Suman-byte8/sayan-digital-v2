// Where the real API lives. Only ever used on the server (server components,
// server actions, the /proxy route) - the browser talks to /proxy instead.
export const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
