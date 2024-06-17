/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "./dayView.css";
import { fetchEvents, deleteEvent, updateEvent } from "../../assets/api/events";
import EventInformationModal from "../eventInfModal/eventInfModal";

const DayView = ({ selectedDate, events, setEvents }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const times = Array.from({ length: 24 }, (_, i) => {
    const hour = i < 10 ? "0" + i : i;
    const period = i < 12 ? "am" : "pm";
    return `${hour}:00 ${period}`;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsData = await fetchEvents();
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching events:", error.message, error.code);
      }
    };
    fetchData();
  });

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleDelete = async (id) => {
    try {
      await deleteEvent(id);
      setEvents(events.filter((event) => event.id !== id));
      setSelectedEvent(null);
    } catch (error) {
      console.error("Error deleting event:", error.message, error.code);
    }
  };

  const handleEdit = async (id, updatedEvent) => {
    try {
      await updateEvent(id, updatedEvent);
      setEvents(
        events.map((event) => (event.id === id ? updatedEvent : event))
      );
      setSelectedEvent(null);
    } catch (error) {
      console.error("Error updating event:", error.message, error.code);
    }
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
