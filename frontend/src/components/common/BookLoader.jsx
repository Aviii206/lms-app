import React from "react";
import "../../styles/bookloader.css";

const BookLoader = ({ message = "Loading..." }) => {
  return (
    <div className="book-loader-container">
      <div className="book-loader">
        <div className="book-page"></div>
      </div>
      {message && <div className="book-text">{message}</div>}
    </div>
  );
};

export default BookLoader;
