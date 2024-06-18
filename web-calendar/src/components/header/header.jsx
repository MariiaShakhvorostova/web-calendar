/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Button from "../button/button";
import Dropdown from "../dropdown/dropdown";
import "./header.css";

const Header = ({ selectedView, onViewChange }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const today = new Date();
    setSelectedDate(today);
  }, []);

  const changeMonth = (increment) => {
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + increment);
      return newDate;
    });
  };

  const handleOptionChange = (option) => {
    if (onViewChange) {
      onViewChange(option);
    }
  };

  return (
    <div className="header">
      <div className="header-content">
        <div className="group__1">
          <div className="logo"></div>
          <Button disabled={false} type="default">
            Today
          </Button>
          <div className="nav">
            <button
              className="nav-button minus"
              onClick={() => changeMonth(-1)}
            ></button>
            <button
              className="nav-button plus"
              onClick={() => changeMonth(1)}
            ></button>
            <span className="current-month">
              {selectedDate.toLocaleString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
        <div className="group__2">
          <Dropdown
            value={selectedView}
            options={["Day", "Week"]}
            onOptionChange={handleOptionChange}
          />
          <div className="user-info">
            <span>Username</span>
            <div className="user-avatar"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
