/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import "./textarea.css";

const Textarea = ({ value, onChange, rows, cols, maxLength }) => {
  const handleChange = (event) => {
    const inputValue = event.target.value;
    if (maxLength && inputValue.length > maxLength) {
      return;
    }
    onChange(inputValue);
  };

  const valueLength = value ? value.length : 0;

  return (
    <div className={`textarea-wrapper`}>
      <p>Description</p>
      <textarea
        className="textarea"
        value={value}
        onChange={handleChange}
        rows={rows}
        cols={cols}
        maxLength={maxLength}
      />
      {maxLength && (
        <div className="maxlength-counter">
          {valueLength}/{maxLength}
        </div>
      )}
      <div className="line"></div>
    </div>
  );
};

export default Textarea;

// Textarea component
// @param {Object} props - Component props
// @param {string} props.value - The current value of the textarea
// @param {Function} props.onChange - Callback function called when the textarea value changes
// @param {number} [props.rows] - The number of visible text lines for the textarea
// @param {number} [props.cols] - The visible width of the textarea, in average character widths
// @param {number} [props.maxLength] - The maximum number of characters allowed in the textarea
//
// Usage examples:
// <Textarea value={description} onChange={(value) => setDescription(value)} rows={4} cols={50} maxLength={100} />
