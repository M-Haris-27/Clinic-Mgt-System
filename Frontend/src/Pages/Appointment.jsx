import { useState, useEffect } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import listPlugin from "@fullcalendar/list"
import { Plus, Loader2, Calendar, Clock, Users } from "lucide-react"
import AddAppointmentModal from "../components/AddAppointmentModal"
import ManageAppointmentModal from "../components/ManageAppointmentModal"
import { transformAppointment } from "../../Utils/TransformAppointment"

const Appointment = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isManageModalOpen, setIsManageModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedStartTime, setSelectedStartTime] = useState(null)
  const [selectedEndTime, setSelectedEndTime] = useState(null)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [events, setEvents] = useState([])
  const [clients, setClients] = useState([])
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointmentsResponse, clientsResponse] = await Promise.all([
          fetch("http://localhost:4000/api/appointments?days=30"),
          fetch("http://localhost:4000/api/clients/all"),
        ])

        if (!appointmentsResponse.ok) throw new Error("Failed to fetch appointments")
        if (!clientsResponse.ok) throw new Error("Failed to fetch clients")

        const appointmentsData = await appointmentsResponse.json()
        const clientsData = await clientsResponse.json()

        setEvents(appointmentsData.data.appointments.map(transformAppointment))
        setClients(clientsData.data.clients)
      } catch (error) {
        console.error("Error fetching data:", error)
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDateClick = (arg) => {
    const localDate = new Date(arg.date)
    const startTime = localDate.toTimeString().slice(0, 5)
    const endTime = new Date(localDate.getTime() + 30 * 60000).toTimeString().slice(0, 5)

    setSelectedDate(localDate.toISOString().split("T")[0])
    setSelectedStartTime(startTime)
    setSelectedEndTime(endTime)
    setIsModalOpen(true)
  }

  const handleAddAppointmentClick = () => {
    setSelectedDate(null)
    setSelectedStartTime(null)
    setSelectedEndTime(null)
    setIsModalOpen(true)
  }

  const handleEventClick = (clickInfo) => {
    const date = clickInfo.event.start.toISOString().split("T")[0]
    const startTime = clickInfo.event.start.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
    const endTime = clickInfo.event.end.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })

    setSelectedAppointment({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      date,
      start: startTime,
      end: endTime,
      appointmentId: clickInfo.event.extendedProps._id,
      clientId: clickInfo.event.extendedProps.clientId,
      location: clickInfo.event.extendedProps.location,
      status: clickInfo.event.extendedProps.status,
    })
    setIsManageModalOpen(true)
  }

  const handleSaveAppointment = async (newAppointment) => {
    try {
      const response = await fetch("http://localhost:4000/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAppointment),
      })

      if (!response.ok) throw new Error("Failed to save appointment")

      const data = await response.json()
      setEvents([...events, transformAppointment(data.data.appointment)])
      setIsModalOpen(false)
    } catch (error) {
      console.error("Error saving appointment:", error)
      setError("Failed to save appointment. Please try again.")
    }
  }

  const handleUpdateAppointment = async (updatedAppointment) => {
    try {
      const response = await fetch(`http://localhost:4000/api/appointments/${updatedAppointment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedAppointment),
      })

      if (!response.ok) throw new Error("Failed to update appointment")

      const data = await response.json()
      setEvents(
        events.map((event) =>
          event.id === updatedAppointment.id ? transformAppointment(data.data.appointment) : event,
        ),
      )
      setIsManageModalOpen(false)
    } catch (error) {
      console.error("Error updating appointment:", error)
      setError("Failed to update appointment. Please try again.")
    }
  }

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/appointments/${appointmentId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete appointment")

      setEvents(events.filter((event) => event.id !== appointmentId))
      setIsManageModalOpen(false)
    } catch (error) {
      console.error("Error deleting appointment:", error)
      setError("Failed to delete appointment. Please try again.")
    }
  }

  const eventClassNames = (arg) => {
    const status = arg.event.extendedProps.status
    if (status === "Confirmed") return "bg-green-200 border-green-600 text-green-800"
    if (status === "Pending") return "bg-yellow-200 border-yellow-600 text-yellow-800"
    if (status === "Cancelled") return "bg-red-200 border-red-600 text-red-800"
    return "bg-gray-200 border-gray-600 text-gray-800"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Calculate summary statistics
  const totalAppointments = events.length
  const confirmedAppointments = events.filter(event => event.extendedProps.status === "Confirmed").length
  const pendingAppointments = events.filter(event => event.extendedProps.status === "Pending").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="px-6 py-8 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Appointments</h1>
                <p className="text-blue-100">Manage your schedule efficiently</p>
              </div>
              <button
                onClick={handleAddAppointmentClick}
                className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg shadow-md transition duration-200 flex items-center space-x-2 transform hover:-translate-y-0.5"
              >
                <Plus className="h-5 w-5" />
                <span>Add Appointment</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-6 mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-blue-800">Total Appointments</h3>
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-900 mt-2">{totalAppointments}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-purple-800">Confirmed</h3>
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-900 mt-2">{confirmedAppointments}</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-yellow-800">Pending</h3>
                <Users className="h-6 w-6 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-yellow-900 mt-2">{pendingAppointments}</p>
            </div>
          </div>

          {/* Calendar Section */}
          <div className="p-6">
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
                  .fc-timegrid-slot {
                    height: 3rem !important;
                  }
                  .fc-event {
                    border-radius: 6px !important;
                    padding: 4px 6px !important;
                    font-size: 0.875rem !important;
                    border: none !important;
                    transition: transform 0.2s !important;
                    cursor: pointer !important;
                  }
                  .fc-event:hover {
                    transform: translateY(-1px) !important;
                  }
                  .fc-event.bg-green-200 {
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
                  }
                  .fc-event.bg-yellow-200 {
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
                  }
                  .fc-event.bg-red-200 {
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
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
                    .fc-event {
                      font-size: 0.75rem !important;
                    }
                  }
                `}
              </style>

              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                initialView="timeGridWeek"
                events={events}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "timeGridWeek,timeGridDay,listWeek",
                }}
                allDaySlot={false}
                slotMinTime="10:00:00"
                slotMaxTime="20:30:00"
                slotDuration="00:30:00"
                timeZone="local"
                eventClassNames={eventClassNames}
                height="auto"
                className="rounded-xl overflow-hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <AddAppointmentModal
          onClose={() => setIsModalOpen(false)}
          selectedDate={selectedDate}
          selectedStartTime={selectedStartTime}
          selectedEndTime={selectedEndTime}
          clients={clients}
          onSave={handleSaveAppointment}
        />
      )}
      {isManageModalOpen && (
        <ManageAppointmentModal
          onClose={() => setIsManageModalOpen(false)}
          appointment={selectedAppointment}
          clients={clients}
          onUpdate={handleUpdateAppointment}
          onDelete={handleDeleteAppointment}
        />
      )}
    </div>
  )
}

export default Appointment