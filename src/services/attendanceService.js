import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";

import { db } from "../firebase";

const getTodayKey = () => {
  return new Date().toISOString().split("T")[0];
};

export const saveScanToFirebase = async (personalNumber) => {
  const today = getTodayKey();
  const now = new Date();

  const scansRef = collection(db, "scans");

  const todayScansQuery = query(
    scansRef,
    where("personalNumber", "==", personalNumber),
    where("date", "==", today)
  );

  const snapshot = await getDocs(todayScansQuery);

  const todayScans = snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate));

  if (todayScans.length >= 2) {
    return {
      success: false,
      message: "This teacher already scanned 2 times today.",
    };
  }

  const lastScan = todayScans[todayScans.length - 1];

  if (lastScan) {
    const lastScanTime = new Date(lastScan.fullDate).getTime();
    const currentTime = now.getTime();

    const differenceInSeconds = (currentTime - lastScanTime) / 1000;

    if (differenceInSeconds < 60) {
      return {
        success: false,
        message: "Please wait at least 1 minute before scanning again.",
      };
    }
  }

  const newScan = {
    personalNumber,
    type: todayScans.length === 0 ? "in" : "out",
    time: now.toLocaleTimeString(),
    date: today,
    fullDate: now.toISOString(),
    createdAt: now.toISOString(),
  };

  await addDoc(scansRef, newScan);

  return {
    success: true,
    message:
      newScan.type === "in"
        ? "Check-in saved successfully."
        : "Check-out saved successfully.",
    scan: newScan,
  };
};

export const getScansFromFirebase = async () => {
  const scansRef = collection(db, "scans");

  const scansQuery = query(scansRef, orderBy("createdAt", "desc"));

  const snapshot = await getDocs(scansQuery);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};