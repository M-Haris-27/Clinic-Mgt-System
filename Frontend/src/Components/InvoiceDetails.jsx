import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { usePDF } from "react-to-pdf";

const InvoiceDetails = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { toPDF, targetRef } = usePDF({ filename: `Invoice_${id}.pdf` });

  // Fetch invoice details
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/invoices/${id}`
        );
        if (!response.ok) {
          if (response.status === 404) {
            console.warn("No invoice found.");
            setInvoice(null);
          } else {
            throw new Error("Failed to fetch invoice details.");
          }
        } else {
          const invoiceData = await response.json();
          setInvoice(invoiceData.data);
        }
      } catch (err) {
        setError("Failed to fetch invoice details.");
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id]);

  if (loading) return <p className="text-center text-gray-700">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!invoice)
    return <p className="text-center text-gray-700">Invoice not found.</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Download Button */}
      <div className="text-center flex items-center justify-center">
        <button
          onClick={() => toPDF()}
          style={{
            width: "100%",
            maxWidth: "200px",
            marginTop: "1rem",
            marginBottom: "1rem",
            padding: "0.5rem",
            fontSize: "1rem",
            fontWeight: "bold",
            backgroundColor: "#454b5c",
            color: "#fff",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
          }}
        >
          Download PDF
        </button>
      </div>
      {/* Invoice Container */}
      <div
        ref={targetRef}
        style={{
          backgroundColor: "#fff",
          padding: "2rem",
          borderRadius: "1rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          margin: "0 auto",
          maxWidth: "700px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "1.875rem",
                fontWeight: "bold",
                color: "#a78bfa",
              }}
            >
              Zoro Clinic
            </h1>
            <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>
              Your trusted invoicing partner
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p
              style={{
                fontSize: "1.125rem",
                fontWeight: "bold",
                color: "#1F2937",
              }}
            >
              Invoice #{invoice._id}
            </p>
            <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>
              Issued on: {new Date(invoice.dateIssued).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Client Details */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <div>
            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: "bold",
                color: "#1F2937",
                marginBottom: "0.5rem",
              }}
            >
              Client Information
            </h3>
            <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>
              <strong>Name:</strong> {invoice.clientId.name}
            </p>
            <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>
              <strong>Email:</strong> {invoice.clientId.email}
            </p>
            <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>
              <strong>Phone:</strong> {invoice.clientId.phoneNumber}
            </p>
            <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>
              <strong>Clinic Location:</strong> {invoice.location}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: "bold",
                color: "#1F2937",
                marginBottom: "0.5rem",
              }}
            >
              Payment Details
            </h3>
            <p style={{ fontSize: "0.875rem", color: "#6B7280", marginBottom: "0.5rem" }}>
              <strong>Amount:</strong> ${invoice.amount.toFixed(2)}
            </p>
            <p style={{ fontSize: "0.875rem", color: "#6B7280", marginBottom: "0.5rem" }}>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  padding: "0 0.5rem",
                  borderRadius: "9999px",
                  fontSize: "0.875rem",
                  fontWeight: "bold",
                  color: invoice.status === "Paid" ? "#16A34A" : "#D97706",
                  backgroundColor:
                    invoice.status === "Paid" ? "#DCFCE7" : "#FEF3C7",
                }}
              >
                {invoice.status}
              </span>
            </p>
            <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>
              <strong>Paid Date:</strong>{" "}
              {invoice.datePaid && invoice.datePaid !== "Paid"
                ? new Date(invoice.datePaid).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Invoice Summary */}
        <div
          style={{
            borderTop: "1px solid #E5E7EB",
            borderBottom: "1px solid #E5E7EB",
            padding: "1rem 0",
            marginBottom: "1.5rem",
          }}
        >
          <h3
            style={{
              fontSize: "1.125rem",
              fontWeight: "bold",
              color: "#1F2937",
              marginBottom: "0.5rem",
            }}
          >
            Invoice Summary
          </h3>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.5rem",
            }}
          >
            <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>Subtotal</p>
            <p style={{ fontSize: "0.875rem", color: "#1F2937" }}>
              ${invoice.amount.toFixed(2)}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.5rem",
            }}
          >
            <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>Tax (0%)</p>
            <p style={{ fontSize: "0.875rem", color: "#1F2937" }}>$0.00</p>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "bold",
              fontSize: "1.125rem",
              marginTop: "0.5rem",
            }}
          >
            <p style={{ color: "#1F2937" }}>Total</p>
            <p style={{ color: "#1E40AF" }}>${invoice.amount.toFixed(2)}</p>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            fontSize: "0.875rem",
            color: "#6B7280",
          }}
        >
          Thank you for your business! If you have any questions, please contact
          us.
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;



