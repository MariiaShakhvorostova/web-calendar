import { db } from "../../firebase";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import { calculateRepeatDates } from "./dateUtils";

export const createEvent = async (eventData) => {
  try {
    const eventsCollectionRef = collection(db, "events");

    const newEventRef = await addDoc(eventsCollectionRef, eventData);

    if (eventData.repeat === "Does not repeat") {
      return newEventRef.id;
    }

    const repeatDates = calculateRepeatDates(eventData.date, eventData.repeat);

    for (const date of repeatDates) {
      const repeatEventData = {
        ...eventData,
        date: date.toISOString().split("T")[0],
      };
      await addDoc(eventsCollectionRef, repeatEventData);
    }

    return newEventRef.id;
  } catch (error) {
    console.error("Error adding event to Firebase:", error.message, error.code);
    throw error;
  }
};

export const fetchEvents = async () => {
  try {
    const eventsCollectionRef = collection(db, "events");
    const querySnapshot = await getDocs(eventsCollectionRef);
    const eventsData = [];
    querySnapshot.forEach((doc) => {
      const eventData = doc.data();
      eventsData.push({ ...eventData, id: doc.id });
    });
    return eventsData;
  } catch (error) {
    console.error(
      "Error fetching events from Firebase:",
      error.message,
      error.code
    );
    throw error;
  }
};

export const deleteEvent = async (eventId) => {
  try {
    await deleteDoc(doc(db, "events", eventId));
  } catch (error) {
    console.error(
      "Error deleting event from Firebase:",
      error.message,
      error.code
    );
    throw error;
  }
};

export const updateEvent = async (eventId, eventData) => {
  try {
    const eventDoc = doc(db, "events", eventId);
    await updateDoc(eventDoc, eventData);
  } catch (error) {
    console.error(
      "Error updating event in Firebase:",
      error.message,
      error.code
    );
    throw error;
  }
};
