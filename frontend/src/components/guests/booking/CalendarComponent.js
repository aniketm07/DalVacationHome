import React from "react";
import { Calendar } from "react-multi-date-picker";
import "react-multi-date-picker/styles/colors/purple.css"

function CalendarComponent({setSelectedDates}) {
  return (
    <div className="mt-6 border-t border-gray-200 pt-4">
      <h3 className="text-sm font-semibold text-gray-900">Select dates</h3>
      <Calendar className="mt-4" onChange={setSelectedDates} minDate={new Date()} range rangeHover/>
    </div>
  );
}

export default CalendarComponent;
