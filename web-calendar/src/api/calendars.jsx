import { db } from "../../firebase";
import {
  collection,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  query,
  where,
  writeBatch,
} from "firebase/firestore";

export const fetchCalendars = async () => {
  const calendarCollection = collection(db, "calendars");
  const calendarSnapshot = await getDocs(calendarCollection);
  return calendarSnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
};

export const createCalendar = async (calendar) => {
  const id = Date.now().toString();
  const calendarDoc = doc(db, "calendars", id);
  await setDoc(calendarDoc, { ...calendar, id });
  return { ...calendar, id };
};

export const deleteCalendar = async (id) => {
  const calendarDoc = doc(db, "calendars", id);

  const eventsQuery = query(
    collection(db, "events"),
    where("calendarId", "==", id)
  );
  const eventsSnapshot = await getDocs(eventsQuery);
  const batch = writeBatch(db);
  eventsSnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  await deleteDoc(calendarDoc);
};

export const updateCalendar = async (calendar) => {
  const calendarDoc = doc(db, "calendars", calendar.id);
  await updateDoc(calendarDoc, calendar);
  return calendar;
};

export const updateCalendarCheckbox = async (id, isChecked) => {
  const calendarDoc = doc(db, "calendars", id);
  await updateDoc(calendarDoc, { isChecked });
};
