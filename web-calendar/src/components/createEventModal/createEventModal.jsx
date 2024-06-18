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
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
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
  initialEventData = null,
  onEventUpdated,
}) => {
  const [title, setTitle] = useState(
    initialEventData ? initialEventData.title : ""
  );
  const [eventDate, setEventDate] = useState(
    initialEventData
      ? new Date(initialEventData.date)
      : selectedDate || new Date()
  );
  const [selectedStartTime, setSelectedStartTime] = useState(
    initialEventData ? initialEventData.startTime : ""
  );
  const [selectedEndTime, setSelectedEndTime] = useState(
    initialEventData ? initialEventData.endTime : ""
  );
  const [isAllDay, setIsAllDay] = useState(
    initialEventData ? initialEventData.isAllDay : false
  );
  const [repeatOption, setRepeatOption] = useState(
    initialEventData ? initialEventData.repeat : "Does not repeat"
  );
  const [selectedCalendar, setSelectedCalendar] = useState(
    initialEventData
      ? {
          color: initialEventData.calendarIconColor,
          title: initialEventData.calendar,
        }
      : { color: "", title: "Choose calendar" }
  );
  const [description, setDescription] = useState(
    initialEventData ? initialEventData.description : ""
  );
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
    const eventDetails = {
      title,
      date: eventDate.toISOString().split("T")[0],
      startTime: selectedStartTime,
      endTime: selectedEndTime,
      repeat: repeatOption,
      calendar: selectedCalendar.title,
      calendarIconColor: selectedCalendar.color,
      description,
      isAllDay,
    };

    try {
      if (initialEventData) {
        await updateDoc(doc(db, "events", initialEventData.id), eventDetails);
        console.log("Event updated in Firebase:", eventDetails);
        onEventUpdated({ ...eventDetails, id: initialEventData.id });
      } else {
        const eventsCollectionRef = collection(db, "events");
        const docRef = await addDoc(eventsCollectionRef, eventDetails);
        console.log("New event added to Firebase:", eventDetails);
        onEventAdded({ ...eventDetails, id: docRef.id });
      }
      onClose();
    } catch (error) {
      console.error("Error saving event to Firebase:", error.message);
      alert(`Error saving event: ${error.message}`);
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
          <h2>{initialEventData ? "Edit event" : "Create event"}</h2>
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
                />
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
