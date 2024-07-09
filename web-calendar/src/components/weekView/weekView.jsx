import React, { useState, useEffect } from "react";
import "./weekView.css";
import { fetchEvents, deleteEvent } from "../../api/events";
import EventInformationModal from "../eventInfModal/eventInfModal";
import CurrentTimeLine from "../currentTimeLine/CurrentTimeLine";

const WeekView = ({
  userId,
  selectedDate,
  onDaySelect,
  events,
  setEvents,
  onEventEdit,
  selectedCalendarIds,
  onEventCreate,
}) => {
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
  const [weekEvents, setWeekEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsData = await fetchEvents(userId);
        setEvents(eventsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error.message, error.code);
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  useEffect(() => {
    const filteredEvents = events.filter((event) =>
      selectedCalendarIds.includes(event.calendarId)
    );
    setWeekEvents(filteredEvents);
  }, [events, selectedCalendarIds]);

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

  const handleDelete = async (eventId) => {
    try {
      await deleteEvent(userId, eventId);
      setEvents(events.filter((event) => event.id !== eventId));
      setSelectedEvent(null);
    } catch (error) {
      console.error("Error deleting event:", error.message, error.code);
    }
  };

  const closeEventInformationModal = () => {
    setSelectedEvent(null);
  };

  const getBackgroundColor = (iconColor) => {
    switch (iconColor) {
      case "dark-blue":
        return "#8383bc";
      case "bright-pink":
        return "#e7a4da";
      case "bright-green":
        return "#85946f";
      case "dark-violet":
        return "#8c6c9b";
      case "green":
        return "#79a479";
      case "light-blue":
        return "#8abae9";
      case "light-green":
        return "#639f79";
      case "orange":
        return "#e0c289";
      case "pink":
        return "#ffc0cb";
      case "sea":
        return "#699d80";
      case "violet":
        return "#e8aae8";
      case "yellow":
        return "#fcfcaa";
      default:
        return "transparent";
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const todayIndex = new Date().getDay();
  const currentHour = new Date().getHours();
  const isToday = (index) => index === todayIndex;

  const handleCellClick = (dayIndex, startTime) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + dayIndex);

    const [startHour] = startTime.split(":");
    const endHour = parseInt(startHour, 10) + 1;
    const endTime = `${endHour < 10 ? "0" + endHour : endHour}:00`;

    onEventCreate(date, startTime, endTime);
  };

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
                const cellEvents = weekEvents.filter((event) => {
                  const eventDate = new Date(event.date);
                  return (
                    eventDate.getDate() === currentDate.getDate() &&
                    eventDate.getMonth() === currentDate.getMonth() &&
                    eventDate.getFullYear() === currentDate.getFullYear() &&
                    event.startTime === times[index]
                  );
                });

                return (
                  <td
                    key={dayIndex}
                    className="event-cell"
                    onClick={() => {
                      if (cellEvents.length > 0) {
                        handleEventClick(cellEvents[0]);
                      } else {
                        handleCellClick(dayIndex, times[index]);
                      }
                    }}
                  >
                    {isToday(dayIndex) && index === currentHour && (
                      <CurrentTimeLine />
                    )}
                    {cellEvents.map((event, i) => {
                      const backgroundColor = getBackgroundColor(
                        event.calendarIconColor
                      );
                      return (
                        <div
                          key={i}
                          className="event"
                          onClick={() => handleEventClick(event)}
                          style={{ backgroundColor: `${backgroundColor}4D` }}
                        >
                          {event.title}
                          <div
                            style={{
                              backgroundImage: `url(/src/assets/imgs/colors/${event.calendarIconColor}.png)`,
                              backgroundColor: backgroundColor,
                            }}
                            className="vertical-line"
                          ></div>
                        </div>
                      );
                    })}
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
          onEdit={() => onEventEdit(selectedEvent)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default WeekView;
