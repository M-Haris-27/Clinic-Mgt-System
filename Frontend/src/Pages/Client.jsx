import { useState, useEffect } from "react"
import { Plus, Trash, Edit, Eye } from "lucide-react"
import axios from "axios"
import AddClient from "../Components/AddClient"
import UpdateClient from "../Components/UpdateClient"
import SearchClient from "../Components/SearchClient"
import { NavLink } from "react-router"

const Client = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState(null)
  const [allClients, setAllClients] = useState([])
  const [filteredClients, setFilteredClients] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    setLoading(true)
    try {
      const response = await axios.get("http://localhost:4000/api/clients/all")
      setAllClients(response.data.data.clients)
      setFilteredClients(response.data.data.clients)
    } catch (err) {
      setError("Failed to fetch clients. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this client?")) return

    try {
      await axios.delete(`http://localhost:4000/api/clients/${id}`)
      fetchClients()
    } catch (err) {
      setError("Failed to delete client. Please try again.")
    }
  }

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredClients(allClients)
      return
    }

    const filtered = allClients.filter((client) =>
      client.name.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredClients(filtered)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="px-6 py-8 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Clients</h1>
                <p className="text-blue-100">Manage your client database efficiently</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg shadow-md transition duration-200 flex items-center space-x-2 transform hover:-translate-y-0.5"
              >
                <Plus className="h-5 w-5" />
                <span>Add Client</span>
              </button>
            </div>
          </div>

          {/* Search Section */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <SearchClient onSearch={handleSearch} />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-6 mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Client Table */}
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredClients.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 hidden sm:table-cell">
                        Phone
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">
                        Age
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredClients.map((client) => (
                      <tr
                        key={client._id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{client.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                          <div className="text-sm text-gray-600">{client.phoneNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                          <div className="text-sm text-gray-600">{client.age}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={() => {
                                setSelectedClientId(client._id)
                                setIsUpdateModalOpen(true)
                              }}
                              className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                              title="Edit"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(client._id)}
                              className="text-red-600 hover:text-red-900 transition-colors duration-200"
                              title="Delete"
                            >
                              <Trash className="h-5 w-5" />
                            </button>
                            <NavLink
                              to={`/clients/${client._id}`}
                              className="text-green-600 hover:text-green-900 transition-colors duration-200"
                              title="View Details"
                            >
                              <Eye className="h-5 w-5" />
                            </NavLink>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">No Clients Found</div>
                <p className="text-gray-400 mt-2">Add new clients to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {isAddModalOpen && (
        <AddClient
          onClose={() => {
            setIsAddModalOpen(false)
            fetchClients()
          }}
          fetchClients={fetchClients}
        />
      )}

      {isUpdateModalOpen && (
        <UpdateClient
          clientId={selectedClientId}
          fetchClients={fetchClients}
          onClose={() => setIsUpdateModalOpen(false)}
          allClients={allClients}
        />
      )}
    </div>
  )
}

export default Client