import PatientHistory from '../Models/history.model.js';

export const createPatientHistory = async (req, res) => {
    try {
         const { clientId, fileId, fileType, notes } = req.body;

        const newHistory = new PatientHistory({
            clientId,
            fileId,
            fileType,
            notes
        });

        const savedHistory = await newHistory.save();
        res.status(201).json(savedHistory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPatientHistoryByClient = async (req, res) => {
    try {
        const histories = await PatientHistory.find({clientId: req.params.clientId});
        if(!histories) return res.status(404).json({ message: "No history records found for this client" });
        res.status(200).json(histories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deletePatientHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const isDeleted =  await PatientHistory.findByIdAndDelete(id); 

        if(!isDeleted) return res.status(404).json({ message: "History record not found" });

        res.status(200).json({ message: "History record deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllPatientHistory = async (req, res) => {
  try {
      const histories = await PatientHistory.find();
      if(!histories) return res.status(404).json({ message: "No history records found" });
      res.status(200).json(histories);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};