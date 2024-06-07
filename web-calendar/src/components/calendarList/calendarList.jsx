/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import EditCalendarModal from "../editCalendarModel/editCalendarModel";
import "./calendarList.css";
import Checkbox from "../checkbox/checkbox";
import Button from "../button/button";
import Modal from "../modal/modal";

import { db } from "../../../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";

const CalendarList = () => {
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
    const fetchCalendars = async () => {
      const calendarCollection = collection(db, "calendars");
      const calendarSnapshot = await getDocs(calendarCollection);
      const calendarList = calendarSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setCalendars(calendarList);
    };

    fetchCalendars();
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
    if (updatedCalendar.id) {
      const calendarDoc = doc(db, "calendars", updatedCalendar.id);
      await updateDoc(calendarDoc, updatedCalendar);
    } else {
      const id = Date.now().toString();
      const calendarDoc = doc(db, "calendars", id);
      await setDoc(calendarDoc, { ...updatedCalendar, id });
      updatedCalendar.id = id;
    }
    setIsEditModalOpen(false);
    setCurrentCalendar({ id: null, title: "", color: "", isChecked: false });
    setCalendars((prevCalendars) => {
      const existingCalendarIndex = prevCalendars.findIndex(
        (cal) => cal.id === updatedCalendar.id
      );
      if (existingCalendarIndex !== -1) {
        const updatedCalendars = [...prevCalendars];
        updatedCalendars[existingCalendarIndex] = updatedCalendar;
        return updatedCalendars;
      } else {
        return [...prevCalendars, updatedCalendar];
      }
    });
  };

  const handleAddClick = () => {
    setCurrentCalendar({ id: null, title: "", color: "", isChecked: false });
    setIsEditModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    const calendarDoc = doc(db, "calendars", currentCalendar.id);
    await deleteDoc(calendarDoc);
    setIsDeleteModalOpen(false);
    setCurrentCalendar({ id: null, title: "", color: "", isChecked: false });
    setCalendars((prevCalendars) =>
      prevCalendars.filter((cal) => cal.id !== currentCalendar.id)
    );
  };

  const handleCheckboxChange = async (id, isChecked) => {
    const calendarDoc = doc(db, "calendars", id);
    await updateDoc(calendarDoc, { isChecked });
    setCalendars((prevCalendars) =>
      prevCalendars.map((cal) => (cal.id === id ? { ...cal, isChecked } : cal))
    );
  };

  return (
    <div className="calendar-list">
      <div className="h2-button">
        <h2>My calendars</h2>
        <button className="add-button" onClick={handleAddClick}></button>
      </div>

      {calendars.map((calendar) => (
        <div key={calendar.id} className="calendar-item">
          <Checkbox
            color={calendar.color}
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
