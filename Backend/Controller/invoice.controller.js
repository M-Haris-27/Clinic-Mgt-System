import Invoice from '../Models/invoice.model.js';

export const createInvoice = async (req, res) => {
    try {
        const { clientId, location, amount } = req.body;

        // Inline validation
        if (!clientId || !location || !amount) {
            return res.status(400).json({ message: "All fields (clientId, location, amount) are required." });
        }

        if (amount <= 0) {
            return res.status(400).json({ message: "Amount must be a positive number." });
        }

        const newInvoice = new Invoice({
            clientId,
            location,
            amount
        });

        const savedInvoice = await newInvoice.save();
        res.status(201).json(savedInvoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateInvoiceStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        if (!["Pending", "Paid"].includes(status)) {
            return res.status(400).json({ message: "Invalid status. Must be 'Pending' or 'Paid'." });
        }

        const updatedInvoice = await Invoice.findByIdAndUpdate(
            id,
            { status, datePaid: status === "Paid" ? new Date() : null },
            { new: true }
        ).populate("clientId");

        if (!updatedInvoice) {
            return res.status(404).json({ message: "Invoice not found." });
        }

        res.status(200).json(updatedInvoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedInvoice = await Invoice.findByIdAndDelete(id);
        if (!deletedInvoice) {
            return res.status(404).json({ message: "Invoice not found." });
        }

        res.status(200).json({ message: "Invoice deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find().populate("clientId");
        if (invoices.length === 0) {
            return res.status(404).json({ success: false, data: [], message: "No invoices found." });
        }

        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getInvoicesByClient = async (req, res) => {
    try {
        const { clientId } = req.params;
        const invoices = await Invoice.find({ clientId }).populate("clientId");
        if (invoices.length === 0) {
            return res.status(404).json({ message: "No invoices found for this client." });
        }

        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getInvoiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await Invoice.findById(id).populate("clientId");

        if (!invoice) {
            return res.status(404).json({ success:false, data:{}, message: "Invoice not found." });
        }

        res.status(200).json({success:false, data:invoice, message: "Invoice found." });

    } catch (error) {
        res.status(500).json({ success:false, data:{}, message: error.message });
    }
}

