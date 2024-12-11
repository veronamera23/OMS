import React from "react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

import events from "./events";


export default function Calendar() {
  return (
    <div>
      <FullCalendar
        initialView="dayGridMonth"
        themeSystem="Simplex"
        headerToolbar={{
          left: "",
          center: "title",
          right: "prev,next",
        }}
        plugins={[dayGridPlugin]}
        events={events}
        displayEventEnd={true}
        eventColor={"#" + Math.floor(Math.random() * 16777215).toString(16)}
      />
    </div>
  );
}
