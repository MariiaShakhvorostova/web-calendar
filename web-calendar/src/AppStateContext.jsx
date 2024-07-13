import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchCalendars } from "./api/calendars";
import { fetchEvents } from "./api/events";
import { auth } from "../firebase";

const AppStateContext = createContext();

export const AppStateProvider = ({ children }) => {
  const [calendars, setCalendars] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedView, setSelectedView] = useState("Week");
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedCalendarIds, setSelectedCalendarIds] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const calendarList = await fetchCalendars(user.uid);
      setCalendars(calendarList);

      const checkedCalendarIds = calendarList
        .filter((calendar) => calendar.isChecked)
        .map((calendar) => calendar.id);
      setSelectedCalendarIds(checkedCalendarIds);

      if (checkedCalendarIds.length > 0) {
        const eventsData = await fetchEvents(user.uid);
        setEvents(eventsData);
      }
    };
    fetchData();
  }, [user]);

  return (
    <AppStateContext.Provider
      value={{
        calendars,
        setCalendars,
        selectedDate,
        setSelectedDate,
        selectedView,
        setSelectedView,
        isCreateEventModalOpen,
        setIsCreateEventModalOpen,
        events,
        setEvents,
        selectedEvent,
        setSelectedEvent,
        selectedCalendarIds,
        setSelectedCalendarIds,
        user,
        setUser,
        selectedStartTime,
        setSelectedStartTime,
        selectedEndTime,
        setSelectedEndTime,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => useContext(AppStateContext);
