/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import "./weekView.css";
import { fetchEvents, deleteEvent, updateEvent } from "../../assets/api/events";
import EventInformationModal from "../eventInfModal/eventInfModal";

const WeekView = ({ selectedDate, onDaySelect, events, setEvents }) => {
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const times = Array.from({ length: 24 }, (_, i) => {
    const hour = i < 10 ? "0" + i : i;
    const period = i < 12 ? "am" : "pm";
    return `${hour}:00 ${period}`;
  });

  const startOfWeek = new Date(selectedDate);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsData = await fetchEvents();
        setEvents(eventsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error.message, error.code);
        setLoading(false);
      }
    };
    fetchData();
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
