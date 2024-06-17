/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from "react";
import Datepicker from "../datepicker/date";
import TimeSelector from "../selector/timeSelector";
import Button from "../button/button";
import Dropdown from "../dropdown/dropdown";
import Checkbox from "../checkbox/checkbox";
import DropdownCalendars from "../dropdownCalendars/dropdownCalendars";
import Textarea from "../textarea/textarea";
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
        <span className="selected-date create-add-form">{formattedDate}</span>
      </div>
      {visible && (
        <Datepicker value={selectedDate} onChange={handleDateChange} />
      )}
    </div>
  );
};

const CreateEventModal = ({
  onClose,
  onEventAdded,
  selectedDate,
  calendars,
}) => {
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState(selectedDate || new Date());
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");
  const [isAllDay, setIsAllDay] = useState(false);
  const [repeatOption, setRepeatOption] = useState("Does not repeat");
  const [selectedCalendar, setSelectedCalendar] = useState({
    color: "",
    title: "Choose calendar",
  });
  const [description, setDescription] = useState("");
  const [isStartTimeMenuOpen, setIsStartTimeMenuOpen] = useState(false);
  const [isEndTimeMenuOpen, setIsEndTimeMenuOpen] = useState(false);
  const repeatOptions = [
    "Does not repeat",
    "Daily",
    "Weekly",
    "Monthly",
    "Yearly",
  ];

  const [timeSelectorIsOpen, setTimeSelectorIsOpen] = useState(false);

  const handleModalClick = () => {
    if (timeSelectorIsOpen) {
      setTimeSelectorIsOpen(false);
    }
  };

  const handleSave = async () => {
    const newEvent = {
      id: Date.now().toString(),
      title,
      date: eventDate.toISOString().split("T")[0],
      startTime: isAllDay ? "All day" : selectedStartTime,
      endTime: isAllDay ? "" : selectedEndTime,
      repeat: repeatOption,
      calendar: selectedCalendar.title,
      description,
    };
    try {
      const eventsCollectionRef = collection(db, "events");
      await addDoc(eventsCollectionRef, newEvent);
      console.log("New event added to Firebase:", newEvent);
      onEventAdded(newEvent);
      onClose();
    } catch (error) {
      console.error("Error adding event to Firebase:", error.message);
      alert(`Error adding event: ${error.message}`);
    }
  };

  const handleBackgroundClick = (event) => {
    if (event.target.classList.contains("modal-background")) {
      onClose();
    }
  };

  return (
    <div className="modal-background" onClick={handleBackgroundClick}>
      <div className="create-event-modal" onClick={handleModalClick}>
        <div className="modal-header">
          <h2>Create event</h2>
          <button className="close-button" onClick={onClose}></button>
        </div>
        <div className="create-line"></div>
        <div className="edit-calendar-form">
          <div className="form-create-group">
            <div className="title-create-icon"></div>
            <label className="title-label add-title">Title</label>
            <input
              placeholder="Enter title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-control add-title create-add-form"
            />
          </div>
          <div className="form-create-group add-date-time">
            <div className="form-create-group">
              <label className="title-label add-title">Date</label>
              <DateDropdown
                selectedDate={eventDate}
                onDateChange={setEventDate}
              />
            </div>

            <div className="form-create-group add-time">
              <label className="title-label add-time-label">Time</label>
              <div className="time-selectors">
                <TimeSelector
                  selectedTime={selectedStartTime}
                  onTimeSelect={setSelectedStartTime}
                  isMenuOpen={isStartTimeMenuOpen}
                  toggleMenu={() =>
                    setIsStartTimeMenuOpen(!isStartTimeMenuOpen)
                  }
                  placeholder="Start Time"
                />
                <span>—</span>
                <TimeSelector
                  selectedTime={selectedEndTime}
                  onTimeSelect={setSelectedEndTime}
                  isMenuOpen={isEndTimeMenuOpen}
                  toggleMenu={() => setIsEndTimeMenuOpen(!isEndTimeMenuOpen)}
                  placeholder="End Time"
                />{" "}
              </div>
            </div>
          </div>
          <div className="form-create-group check-allDay">
            <Checkbox
              backgroundImage={`/src/assets/imgs/green-check.png`}
              isChecked={isAllDay}
              onChange={setIsAllDay}
              checkboxText="All day"
            />
            <div className="wrap-repeat">
              <Dropdown
                value={repeatOption}
                options={repeatOptions}
                onOptionChange={setRepeatOption}
              />
            </div>
          </div>

          <div className="form-create-group add-cal-dropdown">
            <div className="calendar-icon"></div>
            <div className="cal-title-dropdown">
              <label className="title-label">Calendar</label>
              <DropdownCalendars
                options={calendars}
                selectedOption={selectedCalendar}
                onOptionChange={setSelectedCalendar}
              />
            </div>
          </div>
          <div className="form-create-group form-textarea">
            <div className="icon-textarea"></div>
            <Textarea
              value={description}
              onChange={setDescription}
              rows={3}
              cols={40}
              maxLength={200}
            />
          </div>
          <div className="modal-buttons">
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEventModal;
