import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import {
  Plus,
  Eye,
  Trash,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  CircleCheck,
  CircleX,
  ClockArrowUp,
  UserCircle,
  Mail,
  Phone,
} from "lucide-react"
import AddPatientHistoryModal from "../Components/AddPatientHistoryModal"
import { useAppwrite } from "../Context/AppwriteContext"

const ClientDetails = () => {
  const { clientId } = useParams()
  const { uploadFile, getFilePreview } = useAppwrite()
  const [client, setClient] = useState(null)
  const [patientHistory, setPatientHistory] = useState([])
  const [appointments, setAppointments] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientResponse, historyResponse, appointmentsResponse] = await Promise.all([
          axios.get(`http://localhost:4000/api/clients/${clientId}`),
          axios.get(`http://localhost:4000/api/history/${clientId}`),
          axios.get(`http://localhost:4000/api/appointments/client/${clientId}`),
        ])

        setClient(clientResponse.data.data.client)
        setPatientHistory(historyResponse.data)
        setAppointments(appointmentsResponse.data.data.appointments)
      } catch (err) {
        setError("Failed to fetch data.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [clientId])

  const handleAddPatientHistory = async (file, notes) => {
    try {
      setLoading(true)

      if (file.size > 2000000) {
        throw new Error("File size should be less than 2MB.")
      }

      if (
        ![
          "image/jpeg",
          "image/png",
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-excel",
          "image/jpg",
          "application/msword",
        ].includes(file.type)
      ) {
        throw new Error(
          "Invalid file type. Only JPEG, PNG, PDF, DOCX, Excel, JPG, and MS Word files are allowed."
        )
      }

      const fileUploadResponse = await uploadFile(file)
      const newHistory = {
        clientId,
        fileId: fileUploadResponse.$id,
        fileType: file.type,
        notes,
      }

      const response = await axios.post("http://localhost:4000/api/history", newHistory)
      setPatientHistory([...patientHistory, response.data])
      setIsModalOpen(false)
    } catch (err) {
      setError(err.message || "Failed to add patient history.")
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePatientHistory = async (historyId) => {
    try {
      await axios.delete(`http://localhost:4000/api/history/${historyId}`)
      setPatientHistory(patientHistory.filter((history) => history._id !== historyId))
    } catch (err) {
      setError("Failed to delete patient history.")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    )
  }

  const now = new Date()
  const upcomingAppointments = appointments.filter(
    (a) => a.status === "Confirmed" && new Date(a.start) > now
  )
  const pastAppointments = appointments.filter(
    (a) => a.status === "Confirmed" && new Date(a.start) <= now
  )
  const pendingAppointments = appointments.filter((a) => a.status === "Pending")
  const cancelledAppointments = appointments.filter((a) => a.status === "Cancelled")

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Client Profile Card */}
        {client && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-8 bg-gradient-to-r from-blue-600 to-blue-800 sm:px-8">
              <h1 className="text-3xl font-bold text-white mb-6">Client Profile</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3 text-white">
                  <UserCircle className="h-6 w-6" />
                  <div>
                    <p className="text-blue-100 text-sm">Name</p>
                    <p className="font-semibold">{client.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-white">
                  <Mail className="h-6 w-6" />
                  <div>
                    <p className="text-blue-100 text-sm">Email</p>
                    <p className="font-semibold">{client.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-white">
                  <Phone className="h-6 w-6" />
                  <div>
                    <p className="text-blue-100 text-sm">Phone</p>
                    <p className="font-semibold">{client.phoneNumber}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Patient History Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-8 sm:px-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Patient History</h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition duration-200 flex items-center space-x-2 transform hover:-translate-y-0.5"
              >
                <Plus className="h-5 w-5" />
                <span>Add History</span>
              </button>
            </div>

            {patientHistory.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {patientHistory.map((history) => (
                  <div
                    key={history._id}
                    className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-grow">
                        <p className="text-gray-900 font-medium mb-2">
                          <span className="text-gray-600">Notes:</span> {history.notes}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">File Type:</span> {history.fileType}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <a
                          href={getFilePreview(history.fileId)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View File
                        </a>
                        <button
                          onClick={() => handleDeletePatientHistory(history._id)}
                          className="inline-flex items-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          title="Delete"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <p className="text-gray-500">No patient history available</p>
                <p className="text-gray-400 text-sm mt-2">Add new records to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Appointments Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-8 sm:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Appointments</h2>
            
            {appointments.length > 0 ? (
              <div className="space-y-6">
                <AppointmentSection
                  title="Upcoming Appointments"
                  appointments={upcomingAppointments}
                  icon={<CheckCircle className="text-green-500" />}
                  headerClass="text-green-700 bg-green-50"
                  containerClass="border-green-100"
                />
                <AppointmentSection
                  title="Pending Appointments"
                  appointments={pendingAppointments}
                  icon={<AlertCircle className="text-yellow-500" />}
                  headerClass="text-yellow-700 bg-yellow-50"
                  containerClass="border-yellow-100"
                />
                <AppointmentSection
                  title="Past Appointments"
                  appointments={pastAppointments}
                  icon={<Clock className="text-blue-500" />}
                  headerClass="text-blue-700 bg-blue-50"
                  containerClass="border-blue-100"
                />
                <AppointmentSection
                  title="Cancelled Appointments"
                  appointments={cancelledAppointments}
                  icon={<XCircle className="text-red-500" />}
                  headerClass="text-red-700 bg-red-50"
                  containerClass="border-red-100"
                />
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <p className="text-gray-500">No appointments found</p>
                <p className="text-gray-400 text-sm mt-2">Schedule new appointments to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Patient History Modal */}
      {isModalOpen && (
        <AddPatientHistoryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddPatientHistory}
          isLoading={loading}
        />
      )}
    </div>
  )
}

const AppointmentSection = ({ title, appointments, icon, headerClass, containerClass }) => {
  if (appointments.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className={`flex items-center space-x-2 p-4 rounded-lg ${headerClass}`}>
        {icon}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {appointments.map((appointment) => (
          <div
            key={appointment._id}
            className={`bg-white border rounded-xl p-6 hover:shadow-md transition-all duration-300 ${containerClass}`}
          >
            <h4 className="text-lg font-semibold text-gray-900 mb-4">{appointment.title}</h4>
            
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-3" />
                <span className="font-medium mr-2">Date:</span>
                {new Date(appointment.start).toLocaleDateString()}
              </div>
              
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-3" />
                <span className="font-medium mr-2">Time:</span>
                {new Date(appointment.start).toLocaleTimeString()} - 
                {new Date(appointment.end).toLocaleTimeString()}
              </div>

              <div className="flex items-center text-gray-600">
                {appointment.status === "Confirmed" && (
                  <CircleCheck className="h-4 w-4 mr-3 text-green-600" />
                )}
                {appointment.status === "Pending" && (
                  <ClockArrowUp className="h-4 w-4 mr-3 text-yellow-600" />
                )}
                {appointment.status === "Cancelled" && (
                  <CircleX className="h-4 w-4 mr-3 text-red-600" />
                )}
                <span className="font-medium mr-2">Status:</span>
                {appointment.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientDetails;