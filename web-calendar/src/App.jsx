/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Header from "./components/header/header";
import Button from "./components/button/button";
import Datepicker from "./components/datepicker/date";
import CalendarList from "./components/calendarList/calendarList";
import CentralCalendar from "./components/centralCalendar/centralCalendar";
import CreateEventModal from "./components/createEventModal/createEventModal";
import { fetchCalendars } from "./assets/api/calendars";

import "./App.css";

function App() {
  const [calendars, setCalendars] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedView, setSelectedView] = useState("Week");
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [events, setEvents] = useState([]);

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
    setIsCreateEventModalOpen(true);
  };

  const handleEventAdded = (newEvent) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  const handleEventsChange = (newEvents) => {
    setEvents(newEvents);
  };

  return (
    <>
      <Header selectedView={selectedView} onViewChange={handleViewChange} />
      <button className="button-container">
        <Button
          type={"longer"}
          disabled={false}
          onClick={handleCreateEventModalOpen}
        >
          Create
        </Button>
      </button>
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
      />
      {isCreateEventModalOpen && (
        <CreateEventModal
          selectedDate={selectedDate}
          onClose={() => setIsCreateEventModalOpen(false)}
          onEventAdded={handleEventAdded}
          calendars={calendars}
        />
      )}
    </>
  );
}

export default App;
