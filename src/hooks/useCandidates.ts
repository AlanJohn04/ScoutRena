import { useState, useEffect } from "react";
import { collection, getDocs, setDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { mockCandidates, Candidate } from "@/data/mock-candidates";

export function useCandidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setCandidates(mockCandidates);
      setLoading(false);
      return;
    }

    const candidatesRef = collection(db, "candidates");
    
    // Seed database if empty, then listen to realtime updates
    const initAndListen = async () => {
      try {
        // Implement a timeout to fallback to mock data if Firebase hangs
        const fetchPromise = getDocs(candidatesRef);
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Firebase timeout")), 3000));
        
        const snap = await Promise.race([fetchPromise, timeoutPromise]) as any;

        if (snap.empty) {
          console.log("Seeding candidates to Firestore...");
          for (const c of mockCandidates) {
            await setDoc(doc(candidatesRef, c.id), c);
          }
        }
        
        // Listen to realtime updates
        const unsubscribe = onSnapshot(candidatesRef, (snapshot) => {
          const loaded: Candidate[] = [];
          snapshot.forEach((doc) => {
            loaded.push(doc.data() as Candidate);
          });
          setCandidates(loaded);
          setLoading(false);
        });
        
        return unsubscribe;
      } catch (error) {
        console.error("Error fetching candidates (falling back to mock):", error);
        setCandidates(mockCandidates);
        setLoading(false);
      }
    };
    
    let unsub: any;
    initAndListen().then(u => unsub = u);
    
    return () => {
      if (unsub && typeof unsub === 'function') unsub();
    };
  }, []);

  return { candidates, loading };
}
