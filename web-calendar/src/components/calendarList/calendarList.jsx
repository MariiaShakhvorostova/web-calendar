/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import EditCalendarModal from "../editCalendarModel/editCalendarModel";
import "./calendarList.css";
import Checkbox from "../checkbox/checkbox";
import Button from "../button/button";
import Modal from "../modal/modal";

import {
  fetchCalendars,
  createCalendar,
  updateCalendar,
  deleteCalendar,
  updateCalendarCheckbox,
} from "../../api/calendars";

const CalendarList = ({ onCalendarSelect }) => {
  const [calendars, setCalendars] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCalendar, setCurrentCalendar] = useState({
    id: null,
    title: "",
    color: "",
    isChecked: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      const calendarList = await fetchCalendars();
      setCalendars(calendarList);
    };

    fetchData();
  }, []);

  const handleEditClick = (calendar) => {
    setCurrentCalendar(calendar);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (calendar) => {
    setCurrentCalendar(calendar);
    setIsDeleteModalOpen(true);
  };

  const handleSave = async (updatedCalendar) => {
    let newCalendar;
    if (updatedCalendar.id) {
      newCalendar = await updateCalendar(updatedCalendar);
    } else {
      newCalendar = await createCalendar(updatedCalendar);
    }
    setIsEditModalOpen(false);
    setCurrentCalendar({ id: null, title: "", color: "", isChecked: false });
    setCalendars((prevCalendars) => {
      const existingCalendarIndex = prevCalendars.findIndex(
        (cal) => cal.id === newCalendar.id
      );
      if (existingCalendarIndex !== -1) {
        const updatedCalendars = [...prevCalendars];
        updatedCalendars[existingCalendarIndex] = newCalendar;
        return updatedCalendars;
      } else {
        return [...prevCalendars, newCalendar];
      }
    });
  };

  const handleAddClick = () => {
    setCurrentCalendar({ id: null, title: "", color: "", isChecked: false });
    setIsEditModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    await deleteCalendar(currentCalendar.id);
    setIsDeleteModalOpen(false);
    setCurrentCalendar({ id: null, title: "", color: "", isChecked: false });
    setCalendars((prevCalendars) =>
      prevCalendars.filter((cal) => cal.id !== currentCalendar.id)
    );
  };

  const handleCheckboxChange = async (id, isChecked) => {
    await updateCalendarCheckbox(id, isChecked);
    setCalendars((prevCalendars) =>
      prevCalendars.map((cal) => (cal.id === id ? { ...cal, isChecked } : cal))
    );
  };

  const handleCalendarClick = (calendar) => {
    console.log("Clicked calendar:", calendar);
    onCalendarSelect(calendar);
  };

  return (
    <div className="calendar-list">
      <div className="h2-button">
        <h2>My calendars</h2>
        <button className="add-button" onClick={handleAddClick}></button>
      </div>
      {calendars.map((calendar) => (
        <div
          key={calendar.id}
          className="calendar-item"
          onClick={() => handleCalendarClick(calendar)}
        >
          <Checkbox
            backgroundImage={`/src/assets/imgs/colors/${calendar.color}.png`}
            isChecked={calendar.isChecked}
            onChange={(isChecked) =>
              handleCheckboxChange(calendar.id, isChecked)
            }
          />
          <span>{calendar.title}</span>
          <div className="buttons-group">
            <div className="calendar-actions">
              <img
                src="/src/assets/imgs/delete.png"
                alt="Delete"
                className="delete-icon"
                onClick={() => handleDeleteClick(calendar)}
              />
              <img
                src="/src/assets/imgs/Iconedit-pen.png"
                alt="Edit"
                className="edit-icon"
                onClick={() => handleEditClick(calendar)}
              />
            </div>
          </div>
        </div>
      ))}
      {isEditModalOpen && (
        <EditCalendarModal
          calendar={currentCalendar}
          onSave={handleSave}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
      {isDeleteModalOpen && (
        <Modal
          title="Delete calendar"
          content={`Are you sure you want to delete ${currentCalendar.title}? You'll no longer have access to this calendar and its events.`}
          onClose={() => setIsDeleteModalOpen(false)}
          actions={
            <>
              <Button
                type="secondary"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="primary" onClick={handleDeleteConfirm}>
                Delete
              </Button>
            </>
          }
        />
      )}
    </div>
  );
};

export default CalendarList;
