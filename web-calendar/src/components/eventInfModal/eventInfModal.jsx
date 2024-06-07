/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import "./eventInfModal.css";
import Button from "../button/button";

const EventInformationModal = ({ event, onClose, onEdit, onDelete }) => {
  return (
    <div className="event-information-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Event Information</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div className="event-detail">
            <strong>Title:</strong> <span>{event.title}</span>
          </div>
          <div className="event-detail">
            <strong>Date:</strong> <span>{event.date}</span>
          </div>
          <div className="event-detail">
            <strong>Start Time:</strong> <span>{event.startTime}</span>
          </div>
          <div className="event-detail">
            <strong>End Time:</strong> <span>{event.endTime}</span>
          </div>
          <div className="event-detail">
            <strong>Description:</strong> <span>{event.description}</span>
          </div>
          <div className="event-detail">
            <strong>Calendar:</strong> <span>{event.calendar}</span>
          </div>
        </div>
        <div className="modal-footer">
          <Button type="primary" onClick={onEdit}>
            Edit
          </Button>
          <Button type="danger" onClick={() => onDelete(event.id)}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventInformationModal;
