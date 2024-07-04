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

function AppContent() {
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

      const checkedCalendarIds = calendarList
        .filter((calendar) => calendar.isChecked)
        .map((calendar) => calendar.id);
      setSelectedCalendarIds(checkedCalendarIds);

      if (checkedCalendarIds.length > 0) {
        const eventsData = await fetchEvents();
        setEvents(eventsData);
      }
    };
    fetchData();
  }, []);

  const handleCalendarSelect = async ({ id, isChecked }) => {
    const updatedSelectedCalendarIds = isChecked
      ? [...selectedCalendarIds, id]
      : selectedCalendarIds.filter((calendarId) => calendarId !== id);

    setSelectedCalendarIds(updatedSelectedCalendarIds);

    const newEvents = await fetchEvents();
    setEvents(
      newEvents.filter((event) =>
        updatedSelectedCalendarIds.includes(event.calendarId)
      )
    );
  };

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
        selectedCalendarIds={selectedCalendarIds}
      />
      <CentralCalendar
        date={selectedDate}
        view={selectedView}
        events={events}
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

export default AppContent;
