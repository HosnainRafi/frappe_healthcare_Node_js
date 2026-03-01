import { useEffect, useState } from "react";
import {
  FiFileText,
  FiDownload,
  FiCalendar,
  FiUser,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import { patientAPI } from "../../services/api";

function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await patientAPI.getPrescriptions();
      setPrescriptions(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch prescriptions:", error);
      // Mock data for demo
      setPrescriptions([
        {
          id: 1,
          date: "2024-01-15",
          doctor: "Dr. Sarah Johnson",
          diagnosis: "Hypertension",
          status: "Active",
          medications: [
            {
              name: "Amlodipine",
              dosage: "5mg",
              frequency: "Once daily",
              duration: "30 days",
            },
            {
              name: "Aspirin",
              dosage: "75mg",
              frequency: "Once daily",
              duration: "30 days",
            },
          ],
        },
        {
          id: 2,
          date: "2024-01-10",
          doctor: "Dr. Michael Chen",
          diagnosis: "Upper Respiratory Infection",
          status: "Completed",
          medications: [
            {
              name: "Amoxicillin",
              dosage: "500mg",
              frequency: "Three times daily",
              duration: "7 days",
            },
            {
              name: "Paracetamol",
              dosage: "500mg",
              frequency: "As needed",
              duration: "5 days",
            },
          ],
        },
        {
          id: 3,
          date: "2023-12-20",
          doctor: "Dr. Emily Williams",
          diagnosis: "Vitamin D Deficiency",
          status: "Active",
          medications: [
            {
              name: "Vitamin D3",
              dosage: "60000 IU",
              frequency: "Once weekly",
              duration: "8 weeks",
            },
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const activePrescriptions = prescriptions.filter(
    (p) => p.status === "Active",
  );
  const completedPrescriptions = prescriptions.filter(
    (p) => p.status !== "Active",
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Prescriptions</h1>
        <p className="text-gray-600">
          View your current and past prescriptions
        </p>
      </div>

      {/* Active Prescriptions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FiAlertCircle className="mr-2 text-primary-600" />
          Active Prescriptions ({activePrescriptions.length})
        </h2>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="card p-6 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-1/4" />
                <div className="h-4 bg-gray-200 rounded w-1/3 mt-2" />
              </div>
            ))}
          </div>
        ) : activePrescriptions.length === 0 ? (
          <div className="card p-8 text-center">
            <FiCheckCircle className="w-12 h-12 text-green-500 mx-auto" />
            <p className="mt-4 text-gray-600">No active prescriptions</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activePrescriptions.map((prescription) => (
              <div
                key={prescription.id}
                className="card p-6 border-l-4 border-l-primary-500"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        {prescription.diagnosis}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center">
                        <FiCalendar className="mr-1" />
                        {formatDate(prescription.date)}
                      </span>
                      <span className="flex items-center">
                        <FiUser className="mr-1" />
                        {prescription.doctor}
                      </span>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Medications:
                      </p>
                      <div className="space-y-2">
                        {prescription.medications.map((med, index) => (
                          <div
                            key={index}
                            className="p-3 bg-gray-50 rounded-lg"
                          >
                            <p className="font-medium text-gray-900">
                              {med.name} - {med.dosage}
                            </p>
                            <p className="text-sm text-gray-600">
                              {med.frequency} for {med.duration}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedPrescription(prescription)}
                      className="btn-outline py-2 px-3 text-sm"
                    >
                      View Details
                    </button>
                    <button className="btn-primary py-2 px-3 text-sm flex items-center">
                      <FiDownload className="mr-1" /> Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Prescriptions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FiFileText className="mr-2 text-gray-400" />
          Past Prescriptions ({completedPrescriptions.length})
        </h2>

        {completedPrescriptions.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-gray-600">No past prescriptions</p>
          </div>
        ) : (
          <div className="space-y-4">
            {completedPrescriptions.map((prescription) => (
              <div key={prescription.id} className="card p-6 opacity-75">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        {prescription.diagnosis}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        Completed
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center">
                        <FiCalendar className="mr-1" />
                        {formatDate(prescription.date)}
                      </span>
                      <span className="flex items-center">
                        <FiUser className="mr-1" />
                        {prescription.doctor}
                      </span>
                      <span>
                        {prescription.medications.length} medication(s)
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedPrescription(prescription)}
                    className="btn-outline py-2 px-3 text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Prescription Detail Modal */}
      {selectedPrescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Prescription Details
              </h2>
              <button
                onClick={() => setSelectedPrescription(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Diagnosis</p>
                  <p className="font-medium">
                    {selectedPrescription.diagnosis}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">
                    {formatDate(selectedPrescription.date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Doctor</p>
                  <p className="font-medium">{selectedPrescription.doctor}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">{selectedPrescription.status}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Medications
                </p>
                <div className="space-y-3">
                  {selectedPrescription.medications.map((med, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {med.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Dosage: {med.dosage}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            {med.frequency}
                          </p>
                          <p className="text-sm text-gray-500">
                            Duration: {med.duration}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button className="btn-outline flex items-center">
                  <FiDownload className="mr-2" /> Download PDF
                </button>
                <button
                  onClick={() => setSelectedPrescription(null)}
                  className="btn-primary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Prescriptions;
