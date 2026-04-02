import { getAuth, type Auth } from "firebase/auth";
import { firebaseApp } from "./client";

let authInstance: Auth | null = null;

export function getClientAuth() {
  if (typeof window === "undefined") {
    throw new Error("Auth is only available in the browser.");
  }
  if (!authInstance) {
    authInstance = getAuth(firebaseApp);
  }
  return authInstance;
}

