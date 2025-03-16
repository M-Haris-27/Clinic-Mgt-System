import { useState, useEffect } from "react"
import { DollarSign, Eye, BarChart } from "lucide-react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import InvoiceModal from "../components/InvoiceModal"

const Finance = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [invoices, setInvoices] = useState([])
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const invoicesResponse = await fetch("http://localhost:4000/api/invoices")
        const clientsResponse = await fetch("http://localhost:4000/api/clients/all")

        if (!invoicesResponse.ok) {
          if (invoicesResponse.status === 404) {
            console.warn("No invoices found.")
            setInvoices([])
          } else {
            throw new Error("Failed to fetch invoices.")
          }
        } else {
          const invoice = await invoicesResponse.json()
          setInvoices(invoice)
        }

        if (!clientsResponse.ok) {
          throw new Error("Failed to fetch clients.")
        }
        const clientsData = await clientsResponse.json()
        setClients(clientsData.data.clients)
      } catch (err) {
        setError(err.message || "Failed to fetch data.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleCreateInvoice = async (newInvoice) => {
    try {
      const response = await axios.post("http://localhost:4000/api/invoices", newInvoice)
      setInvoices([...invoices, response.data])
      setIsModalOpen(false)
    } catch (err) {
      setError("Failed to create invoice.")
    }
  }

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await axios.put(`http://localhost:4000/api/invoices/${id}`, { status })
      setInvoices(invoices.map((invoice) => (invoice._id === id ? response.data : invoice)))
    } catch (err) {
      setError("Failed to update invoice status.")
    }
  }

  const handleViewInvoice = (id) => {
    navigate(`/invoices/${id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="px-6 py-8 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Financial Overview</h1>
                <p className="text-blue-100">Manage your invoices and payments</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg shadow-md transition duration-200 flex items-center space-x-2 transform hover:-translate-y-0.5"
              >
                <DollarSign className="h-5 w-5" />
                <span>Create Invoice</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-6 mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Finance Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-blue-800">Total Revenue</h3>
                <BarChart className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-900 mt-2">
                ${invoices.reduce((sum, invoice) => sum + invoice.amount, 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-purple-800">Pending Invoices</h3>
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-900 mt-2">
                {invoices.filter(invoice => invoice.status === "Pending").length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-green-800">Paid Invoices</h3>
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-900 mt-2">
                {invoices.filter(invoice => invoice.status === "Paid").length}
              </p>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="p-6">
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Client</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">Date</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoices.length > 0 ? (
                    invoices.map((invoice) => (
                      <tr key={invoice._id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{invoice.clientId.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900">${invoice.amount.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={invoice.status}
                            onChange={(e) => handleUpdateStatus(invoice._id, e.target.value)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer ${
                              invoice.status === "Paid"
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                          <div className="text-sm text-gray-600">
                            {new Date(invoice.dateIssued).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleViewInvoice(invoice._id)}
                            className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition duration-200"
                          >
                            <Eye className="h-4 w-4 mr-1" /> View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        <p className="text-lg">No invoices found</p>
                        <p className="text-sm text-gray-400 mt-1">Create your first invoice to get started</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <InvoiceModal onClose={() => setIsModalOpen(false)} onSubmit={handleCreateInvoice} clients={clients} />
      )}
    </div>
  )
}

export default Finance