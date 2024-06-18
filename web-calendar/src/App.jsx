/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Header from "./components/header/header";
import Button from "./components/button/button";
import Datepicker from "./components/datepicker/date";
import CalendarList from "./components/calendarList/calendarList";
import CentralCalendar from "./components/centralCalendar/centralCalendar";
import CreateEventModal from "./components/createEventModal/createEventModal";
import "./App.css";
import { fetchCalendars } from "./api/calendars";

function App() {
  const [calendars, setCalendars] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedView, setSelectedView] = useState("Week");
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const calendarList = await fetchCalendars();
      setCalendars(calendarList);
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
      <Header selectedView={selectedView} onViewChange={handleViewChange} />
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
      />
      <CentralCalendar
        date={selectedDate}
        view={selectedView}
        events={events}
        setEvents={setEvents}
        onEventEdit={handleEventEdit}
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
