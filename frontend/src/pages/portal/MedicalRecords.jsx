import { useEffect, useState } from "react";
import {
  FiFileText,
  FiDownload,
  FiEye,
  FiCalendar,
  FiUser,
  FiFilter,
} from "react-icons/fi";
import { patientAPI } from "../../services/api";

function MedicalRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await patientAPI.getMedicalRecords();
      setRecords(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch medical records:", error);
      // Mock data for demo
      setRecords([
        {
          id: 1,
          type: "Lab Report",
          name: "Complete Blood Count",
          date: "2024-01-15",
          doctor: "Dr. Sarah Johnson",
          status: "Completed",
          summary: "All values within normal range.",
        },
        {
          id: 2,
          type: "Consultation",
          name: "General Checkup",
          date: "2024-01-10",
          doctor: "Dr. Michael Chen",
          status: "Completed",
          summary: "Routine health examination. Patient in good health.",
        },
        {
          id: 3,
          type: "Imaging",
          name: "Chest X-Ray",
          date: "2024-01-05",
          doctor: "Dr. Emily Williams",
          status: "Completed",
          summary: "No abnormalities detected.",
        },
        {
          id: 4,
          type: "Lab Report",
          name: "Lipid Profile",
          date: "2023-12-20",
          doctor: "Dr. Sarah Johnson",
          status: "Completed",
          summary:
            "Cholesterol levels slightly elevated. Diet modification recommended.",
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

  const getTypeColor = (type) => {
    switch (type) {
      case "Lab Report":
        return "bg-blue-100 text-blue-800";
      case "Consultation":
        return "bg-green-100 text-green-800";
      case "Imaging":
        return "bg-purple-100 text-purple-800";
      case "Procedure":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const recordTypes = ["all", ...new Set(records.map((r) => r.type))];

  const filteredRecords =
    filter === "all" ? records : records.filter((r) => r.type === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
        <p className="text-gray-600">
          View your medical history and health records
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2">
        <FiFilter className="text-gray-400" />
        <div className="flex flex-wrap gap-2">
          {recordTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                filter === type
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Records List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="card p-6 animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-1/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/3 mt-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <FiFileText className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="mt-6 text-lg font-medium text-gray-900">
            No records found
          </h3>
          <p className="mt-2 text-gray-600">
            {filter === "all"
              ? "You don't have any medical records yet."
              : `No ${filter} records found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecords.map((record) => (
            <div key={record.id} className="card p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiFileText className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        {record.name}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(record.type)}`}
                      >
                        {record.type}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center">
                        <FiCalendar className="mr-1" />
                        {formatDate(record.date)}
                      </span>
                      <span className="flex items-center">
                        <FiUser className="mr-1" />
                        {record.doctor}
                      </span>
                    </div>
                    {record.summary && (
                      <p className="mt-2 text-sm text-gray-600">
                        {record.summary}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedRecord(record)}
                    className="btn-outline py-2 px-3 text-sm flex items-center"
                  >
                    <FiEye className="mr-1" /> View
                  </button>
                  <button className="btn-outline py-2 px-3 text-sm flex items-center">
                    <FiDownload className="mr-1" /> Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedRecord.name}
              </h2>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium">{selectedRecord.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">
                    {formatDate(selectedRecord.date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Doctor</p>
                  <p className="font-medium">{selectedRecord.doctor}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">{selectedRecord.status}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-500 mb-2">Summary</p>
                <p className="text-gray-700">{selectedRecord.summary}</p>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button className="btn-outline flex items-center">
                  <FiDownload className="mr-2" /> Download PDF
                </button>
                <button
                  onClick={() => setSelectedRecord(null)}
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

export default MedicalRecords;
