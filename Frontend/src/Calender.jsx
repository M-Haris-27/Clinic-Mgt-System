import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";

const Calendar = () => {
  const [events, setEvents] = useState([
    { id: "1", title: "Patient A", start: "2025-01-27T09:00:00", end: "2025-01-27T10:00:00" },
    { id: "2", title: "Patient Moiz", start: "2025-01-28T11:30:00", end: "2025-01-27T12:30:00" },
    { id: "3", title: "Lunch with Haris", start: "2025-01-29T13:00:00", end: "2025-01-27T14:00:00" },
    { id: "4", title: "Zoro Project Meeting", start: "2025-01-27T15:00:00", end: "2025-01-27T16:00:00" },
  ]);

  const handleDateSelect = (selectInfo) => {
    const title = prompt("Enter a title for the event");
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect();

    if (title) {
      const newEvent = {
        id: String(events.length + 1),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
      };
      setEvents([...events, newEvent]);
    }
  };

  const handleEventClick = (clickInfo) => {
    if (window.confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'?`)) {
      clickInfo.event.remove();
      setEvents(events.filter((event) => event.id !== clickInfo.event.id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Calendar
          </h1>
          
          <div className="calendar-container rounded-xl overflow-hidden shadow-sm">
            <style>
              {`
                .fc {
                  font-family: inherit;
                }
                .fc-toolbar-title {
                  font-size: 1.25rem !important;
                  font-weight: 600 !important;
                  color: #374151 !important;
                }
                .fc-button-primary {
                  background-color: #3b82f6 !important;
                  border-color: #3b82f6 !important;
                  text-transform: capitalize !important;
                  padding: 0.5rem 1rem !important;
                  font-weight: 500 !important;
                  transition: all 0.2s !important;
                }
                .fc-button-primary:hover {
                  background-color: #2563eb !important;
                  border-color: #2563eb !important;
                }
                .fc-button-primary:not(:disabled).fc-button-active,
                .fc-button-primary:not(:disabled):active {
                  background-color: #1d4ed8 !important;
                  border-color: #1d4ed8 !important;
                }
                .fc-event {
                  border-radius: 6px !important;
                  padding: 2px 4px !important;
                  font-size: 0.875rem !important;
                  border: none !important;
                  background-color: #93c5fd !important;
                  color: #1e40af !important;
                  transition: transform 0.2s !important;
                }
                .fc-event:hover {
                  transform: translateY(-1px) !important;
                }
                .fc-daygrid-day {
                  transition: background-color 0.2s !important;
                }
                .fc-daygrid-day:hover {
                  background-color: #f3f4f6 !important;
                }
                .fc th {
                  padding: 0.75rem !important;
                  font-weight: 600 !important;
                  color: #4b5563 !important;
                }
                @media (max-width: 640px) {
                  .fc-toolbar {
                    flex-direction: column;
                    gap: 1rem;
                  }
                  .fc-toolbar-title {
                    font-size: 1.125rem !important;
                  }
                }
              `}
            </style>
            
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
              }}
              editable={true}
              selectable={true}
              select={handleDateSelect}
              eventClick={handleEventClick}
              events={events}
              height="auto"
              className="rounded-xl overflow-hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;