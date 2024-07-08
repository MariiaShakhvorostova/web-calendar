import { db } from "../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { calculateRepeatDates } from "./dateUtils";

export const fetchEvents = async (userId) => {
  const q = query(collection(db, "events"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  const events = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return events;
};

export const createEvent = async (userId, eventData) => {
  if (!userId) throw new Error("User ID is required to create an event.");

  const eventsCollectionRef = collection(db, "events");
  const newEventRef = await addDoc(eventsCollectionRef, {
    ...eventData,
    userId,
  });

  if (!eventData.repeat || eventData.repeat === "Does not repeat") {
    return newEventRef.id;
  }

  const repeatDates = calculateRepeatDates(eventData.date, eventData.repeat);

  for (const date of repeatDates) {
    const repeatEventData = {
      ...eventData,
      date: date.toISOString().split("T")[0],
      userId,
    };
    await addDoc(eventsCollectionRef, repeatEventData);
  }

  return newEventRef.id;
};

export const deleteEvent = async (userId, eventId) => {
  if (!userId) throw new Error("User ID is required to delete an event.");

  const eventDoc = doc(db, "events", eventId);
  await deleteDoc(eventDoc);
};

export const updateEvent = async (userId, eventId, eventData) => {
  if (!userId) throw new Error("User ID is required to update an event.");

  const eventDoc = doc(db, "events", eventId);
  await updateDoc(eventDoc, { ...eventData, userId });
};
