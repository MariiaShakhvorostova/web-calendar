/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import "./dropdownCalendars.css";

const DropdownCalendars = ({ options, selectedOption, onOptionChange }) => {
  const [visible, setVisible] = useState(false);
  const dropdownRef = useRef(null);

  const handleOptionClick = (option) => {
    onOptionChange(option);
    setVisible(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const renderOption = (option) => {
    const iconUrl = `/src/assets/imgs/colors/${option.color}.png`;
    return (
      <div
        className="calendar-option"
        key={option.title}
        onClick={() => handleOptionClick(option)}
      >
        <div
          className="color-icon"
          style={{ backgroundImage: `url(${iconUrl})` }}
        ></div>
        <span>{option.title}</span>
      </div>
    );
  };

  const selectedIconUrl = `/src/assets/imgs/colors/${selectedOption.color}.png`;

  return (
    <div className="dropdown-calendars" ref={dropdownRef}>
      <div className="dropdown-header" onClick={() => setVisible(!visible)}>
        <div
          className="color-icon"
          style={{ backgroundImage: `url(${selectedIconUrl})` }}
        ></div>
        <span className="selected-option">{selectedOption.title}</span>
      </div>
      {visible && (
        <div className="dropdown-menu">{options.map(renderOption)}</div>
      )}
    </div>
  );
};

export default DropdownCalendars;
