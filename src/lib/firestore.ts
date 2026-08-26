import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore/lite";
import { firebaseApp, isFirebaseConfigured } from "@/lib/firebase";

// Server-only — used by the contact API route to keep a searchable history
// of every submission in the Firebase console. The "lite" Firestore build
// (REST-based, no realtime listeners/local cache) is the right fit for a
// single write per request from a Worker, rather than the full SDK's
// persistent-connection client meant for long-lived browser sessions.
const SUBMISSIONS_COLLECTION = "contactSubmissions";

export type ContactSubmission = {
  name: string;
  phone: string;
  email: string;
  serviceType: string;
  frequency: string;
  address: string;
  message: string;
  ip: string;
};

/**
 * Best-effort persistence — never throws. A Firestore outage or missing
 * config should never block the email that's the actual point of the form.
 */
export async function saveContactSubmission(submission: ContactSubmission): Promise<void> {
  if (!isFirebaseConfigured) return;
  try {
    const db = getFirestore(firebaseApp);
    await addDoc(collection(db, SUBMISSIONS_COLLECTION), {
      ...submission,
      submittedAt: Timestamp.now(),
    });
  } catch (err) {
    console.error("[contact] failed to save submission to Firestore:", err);
  }
}
