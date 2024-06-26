import React, { useState, useEffect } from "react";
import Header from "./components/header/header";
import Button from "./components/button/button";
import Datepicker from "./components/datepicker/date";
import CalendarList from "./components/calendarList/calendarList";
import CentralCalendar from "./components/centralCalendar/centralCalendar";
import CreateEventModal from "./components/createEventModal/createEventModal";
import "./App.css";
import { fetchCalendars } from "./api/calendars";
import { fetchEvents } from "./api/events";

function App() {
  const [calendars, setCalendars] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedView, setSelectedView] = useState("Week");
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedCalendarIds, setSelectedCalendarIds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const calendarList = await fetchCalendars();
      setCalendars(calendarList);
      const eventsData = await fetchEvents();
      setEvents(eventsData);
    };
    fetchData();
  }, []);

  const handleEditCalendar = (updatedCalendar) => {
    setCalendars((prevCalendars) =>
      prevCalendars.map((calendar) =>
        calendar.id === updatedCalendar.id ? updatedCalendar : calendar
      )
    );
  };

  const handleDeleteCalendar = (calendarId) => {
    setCalendars((prevCalendars) =>
      prevCalendars.filter((calendar) => calendar.id !== calendarId)
    );
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.calendarId !== calendarId)
    );
  };

  const handleAddCalendar = (newCalendar) => {
    setCalendars((prevCalendars) => [...prevCalendars, newCalendar]);
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const handleViewChange = (newView) => {
    setSelectedView(newView);
  };

  const handleTodayClick = () => {
    const today = new Date();
    setSelectedDate(today);
    setSelectedView("Day");
  };

  const handleCreateEventModalOpen = () => {
    setSelectedEvent(null);
    setIsCreateEventModalOpen(true);
  };

  const handleEventAdded = (newEvent) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
    setIsCreateEventModalOpen(false);
  };

  const handleEventUpdated = (updatedEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
    setIsCreateEventModalOpen(false);
  };

  const handleEventEdit = (event) => {
    setSelectedEvent(event);
    setIsCreateEventModalOpen(true);
  };

  const handleCalendarSelect = ({ id, isChecked }) => {
    setSelectedCalendarIds((prevSelected) =>
      isChecked
        ? [...prevSelected, id]
        : prevSelected.filter((calendarId) => calendarId !== id)
    );
  };

  const filteredEvents =
    selectedCalendarIds.length > 0
      ? events.filter((event) => selectedCalendarIds.includes(event.calendarId))
      : events;

  return (
    <>
      <Header
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedView={selectedView}
        onViewChange={handleViewChange}
        onTodayClick={handleTodayClick}
      />
      <div className="button-container">
        <Button
          type={"longer"}
          disabled={false}
          onClick={handleCreateEventModalOpen}
        >
          Create
        </Button>
      </div>
      <Datepicker value={selectedDate} onChange={handleDateChange} />
      <CalendarList
        calendars={calendars}
        onEdit={handleEditCalendar}
        onDelete={handleDeleteCalendar}
        onAdd={handleAddCalendar}
        onCalendarSelect={handleCalendarSelect}
        setEvents={setEvents}
      />
      <CentralCalendar
        date={selectedDate}
        view={selectedView}
        events={filteredEvents}
        setEvents={setEvents}
        onEventEdit={handleEventEdit}
        selectedCalendarIds={selectedCalendarIds}
      />
      {isCreateEventModalOpen && (
        <CreateEventModal
          selectedDate={selectedDate}
          onClose={() => setIsCreateEventModalOpen(false)}
          onEventAdded={handleEventAdded}
          onEventUpdated={handleEventUpdated}
          initialEventData={selectedEvent}
          calendars={calendars}
        />
      )}
    </>
  );
}

export default App;
