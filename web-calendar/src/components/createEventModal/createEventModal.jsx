/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from "react";
import Datepicker from "../datepicker/date";
import TimeSelector from "../selector/timeSelector";
import Button from "../button/button";
import { db } from "../../../firebase";
import { collection, addDoc } from "firebase/firestore";
import "./createEventModal.css";

const DateDropdown = ({ selectedDate, onDateChange }) => {
  const [visible, setVisible] = useState(false);
  const datePickerRef = useRef(null);

  const handleDateChange = (date) => {
    onDateChange(date);
    setVisible(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        setVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [datePickerRef]);

  const formattedDate = selectedDate
    ? `${selectedDate.toLocaleDateString()} (${selectedDate.toLocaleDateString("en-US", { weekday: "long" })})`
    : "Select Date";

  return (
    <div className="date-dropdown" ref={datePickerRef}>
      <div className="dropdown-header" onClick={() => setVisible(!visible)}>
        <img
          src="/src/assets/imgs/clock.png"
          alt="Clock Icon"
          className="clock-icon"
        />
        <span className="selected-date">{formattedDate}</span>
      </div>
      {visible && (
        <Datepicker value={selectedDate} onChange={handleDateChange} />
      )}
    </div>
  );
};

const CreateEventModal = ({ onClose, onEventAdded }) => {
  const [title, setTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");
  const [isStartTimeMenuOpen, setIsStartTimeMenuOpen] = useState(false);
  const [isEndTimeMenuOpen, setIsEndTimeMenuOpen] = useState(false);

  const toggleStartTimeMenu = () => {
    setIsStartTimeMenuOpen(!isStartTimeMenuOpen);
    setIsEndTimeMenuOpen(false);
  };

  const toggleEndTimeMenu = () => {
    setIsEndTimeMenuOpen(!isEndTimeMenuOpen);
    setIsStartTimeMenuOpen(false);
  };

  const handleSave = async () => {
    const newEvent = {
      id: Date.now().toString(),
      title,
      date: selectedDate.toISOString().split("T")[0],
      startTime: selectedStartTime,
      endTime: selectedEndTime,
    };
    try {
      const eventsCollectionRef = collection(db, "events");
      await addDoc(eventsCollectionRef, newEvent);
      console.log("New event added to Firebase:", newEvent);
      onClose();
      onEventAdded(newEvent);
    } catch (error) {
      console.error("Error adding event to Firebase:", error);
    }
  };

  useEffect(() => {}, [selectedDate]);

  return (
    <div className="create-event-modal">
      <div className="modal-header">
        <h2>Create event</h2>
        <button className="close-button" onClick={onClose}>
          X
        </button>
      </div>
      <div className="edit-calendar-form">
        <div className="form-create-group">
          <label className="title-label">Title</label>
          <input
            placeholder="Enter title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-create-group">
          <label className="title-label">Date</label>
          <DateDropdown
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </div>
        <div className="form-create-group">
          <label className="title-label">Time</label>
          <TimeSelector
            selectedTime={selectedStartTime}
            isMenuOpen={isStartTimeMenuOpen}
            onTimeSelect={setSelectedStartTime}
            toggleMenu={toggleStartTimeMenu}
          />
          <TimeSelector
            selectedTime={selectedEndTime}
            isMenuOpen={isEndTimeMenuOpen}
            onTimeSelect={setSelectedEndTime}
            toggleMenu={toggleEndTimeMenu}
          />
        </div>
        <div className="modal-buttons">
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </div>
  );
};

export default CreateEventModal;
