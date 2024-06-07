/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../firebase";
import "./dayView.css";
import EventInformationModal from "../eventInfModal/eventInfModal";

const DayView = ({ selectedDate }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const times = Array.from({ length: 24 }, (_, i) => {
    const hour = i < 10 ? "0" + i : i;
    const period = i < 12 ? "am" : "pm";
    return `${hour}:00 ${period}`;
  });

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsCollectionRef = collection(db, "events");
      const querySnapshot = await getDocs(eventsCollectionRef);
      const eventsData = [];
      querySnapshot.forEach((doc) => {
        const eventData = doc.data();
        eventsData.push({ ...eventData, id: doc.id });
      });
      setEvents(eventsData);
    };
    fetchEvents();
  }, [selectedDate]);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "events", id));
    setEvents(events.filter((event) => event.id !== id));
    setSelectedEvent(null);
  };

  const handleEdit = async (id, updatedEvent) => {
    const eventDoc = doc(db, "events", id);
    await updateDoc(eventDoc, updatedEvent);
    setEvents(events.map((event) => (event.id === id ? updatedEvent : event)));
    setSelectedEvent(null);
  };

  const closeEventInformationModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="day-view">
      <table>
        <thead>
          <tr>
            <th className="today">
              <div className="today-content">
                <div>
                  {selectedDate
                    ? selectedDate
                        .toLocaleDateString("en-US", { weekday: "short" })
                        .toUpperCase()
                    : ""}
                </div>
                <div>{selectedDate ? selectedDate.getDate() : ""}</div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {times.map((time, index) => (
            <tr key={index}>
              <td>{time}</td>
              <td className="event-cell">
                {events
                  .filter(
                    (event) =>
                      event.date ===
                        (selectedDate
                          ? selectedDate.toISOString().split("T")[0]
                          : "") && event.startTime === time
                  )
                  .map((event, i) => (
                    <div
                      key={i}
                      className="event"
                      onClick={() => handleEventClick(event)}
                    >
                      {event.title}
                    </div>
                  ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedEvent && (
        <EventInformationModal
          event={selectedEvent}
          onClose={closeEventInformationModal}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default DayView;
