/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import "./weekView.css";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../firebase";
import EventInformationModal from "../eventInfModal/eventInfModal";

const WeekView = ({ selectedDate, onDaySelect }) => {
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const times = Array.from({ length: 24 }, (_, i) => {
    const hour = i < 10 ? "0" + i : i;
    const period = i < 12 ? "am" : "pm";
    return `${hour}:00 ${period}`;
  });

  const startOfWeek = new Date(selectedDate);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsCollectionRef = collection(db, "events");
      const querySnapshot = await getDocs(eventsCollectionRef);
      const eventsData = [];
      querySnapshot.forEach((doc) => {
        const eventData = doc.data();
        eventsData.push(eventData);
      });
      setEvents(eventsData);
      setLoading(false);
    };
    fetchEvents();
  }, []);

  const getWeekDates = () => {
    return weekDays.map((_, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      return date;
    });
  };

  const handleDayClick = (index) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + index);
    onDaySelect(date);
  };

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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="week-view">
      <table>
        <thead>
          <tr>
            <th></th>
            {weekDays.map((day, index) => (
              <th
                key={index}
                className={index === selectedDate.getDay() ? "today" : ""}
                onClick={() => handleDayClick(index)}
              >
                {index === selectedDate.getDay() ? (
                  <div className="today-content">
                    <div>{day}</div>
                    <div>{getWeekDates()[index].getDate()}</div>
                  </div>
                ) : (
                  <>
                    <div>{day}</div>
                    <div>{getWeekDates()[index].getDate()}</div>
                  </>
                )}
              </th>
            ))}
          </tr>
          <tr className="line">
            <td colSpan={weekDays.length + 1}></td>
          </tr>
        </thead>
        <tbody>
          {times.map((time, index) => (
            <tr key={index}>
              <td>{time}</td>
              {weekDays.map((_, dayIndex) => {
                const currentDate = getWeekDates()[dayIndex];
                const cellEvents = events.filter((event) => {
                  const eventDate = new Date(event.date);
                  return (
                    eventDate.getDate() === currentDate.getDate() &&
                    eventDate.getMonth() === currentDate.getMonth() &&
                    eventDate.getFullYear() === currentDate.getFullYear() &&
                    event.startTime === times[index]
                  );
                });

                return (
                  <td key={dayIndex} className="event-cell">
                    {cellEvents.map((event, i) => (
                      <div
                        key={i}
                        className="event"
                        onClick={() => handleEventClick(event)}
                      >
                        {event.title}
                      </div>
                    ))}
                  </td>
                );
              })}
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

export default WeekView;
