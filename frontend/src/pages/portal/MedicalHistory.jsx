import { useEffect, useState } from "react";
import {
  FiActivity,
  FiPlus,
  FiTrash2,
  FiCalendar,
  FiUser,
  FiHeart,
  FiThermometer,
  FiClipboard,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiChevronDown,
  FiChevronUp,
  FiFileText,
  FiDroplet,
  FiX,
  FiRefreshCw,
  FiFilter,
} from "react-icons/fi";
import { patientAPI } from "../../services/api";
import toast from "react-hot-toast";

function MedicalHistory() {
  // Data states
  const [medicalHistory, setMedicalHistory] = useState({
    records: [],
    conditions: [],
    all: [],
  });
  const [labResults, setLabResults] = useState([]);
  const [vitalSigns, setVitalSigns] = useState([]);

  // UI states
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [expandedLab, setExpandedLab] = useState(null);
  const [expandedVital, setExpandedVital] = useState(null);
  const [filter, setFilter] = useState("all");

  // Form state
  const [formData, setFormData] = useState({
    category: "condition",
    description: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [historyRes, labRes, vitalRes] = await Promise.allSettled([
        patientAPI.getMedicalHistory(),
        patientAPI.getLabResults(),
        patientAPI.getVitalSigns(),
      ]);

      if (historyRes.status === "fulfilled" && historyRes.value.data.success) {
        setMedicalHistory(historyRes.value.data.data);
      }
      if (labRes.status === "fulfilled" && labRes.value.data.success) {
        setLabResults(labRes.value.data.data || []);
      }
      if (vitalRes.status === "fulfilled" && vitalRes.value.data.success) {
        setVitalSigns(vitalRes.value.data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch medical history data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = async (e) => {
    e.preventDefault();
    if (!formData.description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    setSubmitting(true);
    try {
      const response = await patientAPI.addMedicalHistory(formData);
      if (response.data.success) {
        toast.success("Medical history entry added successfully!");
        setShowAddForm(false);
        setFormData({
          category: "condition",
          description: "",
          date: new Date().toISOString().split("T")[0],
          notes: "",
        });
        // Refresh data
        await fetchAllData();
      } else {
        toast.error(response.data.message || "Failed to add entry");
      }
    } catch (error) {
      console.error("Failed to add medical history:", error);
      toast.error(
        error.response?.data?.message || "Failed to add medical history entry",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEntry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;

    try {
      const response = await patientAPI.deleteMedicalHistory(id);
      if (response.data.success) {
        toast.success("Entry deleted successfully");
        await fetchAllData();
      } else {
        toast.error("Failed to delete entry");
      }
    } catch (error) {
      console.error("Failed to delete entry:", error);
      toast.error("Failed to delete entry");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatShortDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "condition":
        return <FiHeart className="w-5 h-5" />;
      case "allergy":
        return <FiAlertCircle className="w-5 h-5" />;
      case "surgery":
        return <FiActivity className="w-5 h-5" />;
      case "medication":
        return <FiClipboard className="w-5 h-5" />;
      case "family":
        return <FiUser className="w-5 h-5" />;
      default:
        return <FiFileText className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "condition":
        return "bg-red-100 text-red-600";
      case "allergy":
        return "bg-orange-100 text-orange-600";
      case "surgery":
        return "bg-purple-100 text-purple-600";
      case "medication":
        return "bg-blue-100 text-blue-600";
      case "family":
        return "bg-teal-100 text-teal-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusBadge = (status) => {
    if (!status) return null;
    const isActive =
      status === "Active" || status === "Open" || status === "Submitted";
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isActive
            ? "bg-green-100 text-green-700"
            : status === "Resolved" || status === "Completed"
              ? "bg-gray-100 text-gray-600"
              : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {isActive ? (
          <FiCheckCircle className="w-3 h-3" />
        ) : (
          <FiClock className="w-3 h-3" />
        )}
        {status}
      </span>
    );
  };

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: <FiClipboard className="w-4 h-4" />,
    },
    {
      id: "conditions",
      label: "Conditions",
      icon: <FiHeart className="w-4 h-4" />,
    },
    {
      id: "lab-results",
      label: "Lab Results",
      icon: <FiDroplet className="w-4 h-4" />,
    },
    {
      id: "vitals",
      label: "Vital Signs",
      icon: <FiThermometer className="w-4 h-4" />,
    },
  ];

  // ========== RENDER SECTIONS ==========

  const renderOverview = () => {
    const allItems = medicalHistory.all || [];
    const totalConditions = (medicalHistory.conditions || []).length;
    const totalRecords = (medicalHistory.records || []).length;
    const info = medicalHistory.patientInfo || {};

    // Check if any patient health info exists
    const hasHealthInfo =
      info.medical_history ||
      info.allergies ||
      info.medication ||
      info.surgical_history ||
      info.tobacco_past_use ||
      info.tobacco_current_use ||
      info.alcohol_past_use ||
      info.alcohol_current_use ||
      info.surrounding_factors ||
      info.other_risk_factors;

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-200 rounded-lg flex items-center justify-center">
                <FiHeart className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-700">
                  {totalConditions}
                </p>
                <p className="text-xs text-red-600">Health Info</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
                <FiFileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">
                  {totalRecords}
                </p>
                <p className="text-xs text-blue-600">Records</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center">
                <FiDroplet className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-700">
                  {labResults.length}
                </p>
                <p className="text-xs text-purple-600">Lab Tests</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
                <FiThermometer className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700">
                  {vitalSigns.length}
                </p>
                <p className="text-xs text-green-600">Vitals</p>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Health Information from Frappe */}
        {hasHealthInfo && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Patient Health Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {info.medical_history && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center">
                      <FiHeart className="w-4 h-4 text-red-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">
                      Medical History
                    </h4>
                  </div>
                  <p className="text-gray-700 text-sm whitespace-pre-line">
                    {info.medical_history}
                  </p>
                </div>
              )}
              {info.allergies && (
                <div className="bg-white rounded-xl border border-orange-200 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center">
                      <FiAlertCircle className="w-4 h-4 text-orange-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Allergies</h4>
                  </div>
                  <p className="text-gray-700 text-sm whitespace-pre-line">
                    {info.allergies}
                  </p>
                </div>
              )}
              {info.medication && (
                <div className="bg-white rounded-xl border border-blue-200 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FiClipboard className="w-4 h-4 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">
                      Current Medication
                    </h4>
                  </div>
                  <p className="text-gray-700 text-sm whitespace-pre-line">
                    {info.medication}
                  </p>
                </div>
              )}
              {info.surgical_history && (
                <div className="bg-white rounded-xl border border-purple-200 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FiActivity className="w-4 h-4 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">
                      Surgical History
                    </h4>
                  </div>
                  <p className="text-gray-700 text-sm whitespace-pre-line">
                    {info.surgical_history}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Risk Factors */}
        {(info.tobacco_past_use ||
          info.tobacco_current_use ||
          info.alcohol_past_use ||
          info.alcohol_current_use ||
          info.surrounding_factors ||
          info.other_risk_factors) && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Lifestyle & Risk Factors
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {info.tobacco_past_use && (
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Tobacco (Past Use)
                  </p>
                  <p className="text-gray-800 text-sm">
                    {info.tobacco_past_use}
                  </p>
                </div>
              )}
              {info.tobacco_current_use && (
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Tobacco (Current Use)
                  </p>
                  <p className="text-gray-800 text-sm">
                    {info.tobacco_current_use}
                  </p>
                </div>
              )}
              {info.alcohol_past_use && (
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Alcohol (Past Use)
                  </p>
                  <p className="text-gray-800 text-sm">
                    {info.alcohol_past_use}
                  </p>
                </div>
              )}
              {info.alcohol_current_use && (
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Alcohol (Current Use)
                  </p>
                  <p className="text-gray-800 text-sm">
                    {info.alcohol_current_use}
                  </p>
                </div>
              )}
              {info.surrounding_factors && (
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Surrounding Factors
                  </p>
                  <p className="text-gray-800 text-sm">
                    {info.surrounding_factors}
                  </p>
                </div>
              )}
              {info.other_risk_factors && (
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Other Risk Factors
                  </p>
                  <p className="text-gray-800 text-sm">
                    {info.other_risk_factors}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Patient Medical Records (from Frappe doctype) */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Medical Records
          </h3>
          {allItems.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiClipboard className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                {hasHealthInfo
                  ? "No additional medical records"
                  : "No Medical History Yet"}
              </h4>
              <p className="text-gray-500 mb-4">
                {hasHealthInfo
                  ? "Medical records from encounters and prescriptions will appear here."
                  : "Start building your medical history by adding conditions, allergies, or past procedures."}
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="btn-primary inline-flex items-center gap-2"
              >
                <FiPlus className="w-4 h-4" />
                Add Entry
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {allItems.map((item, index) => (
                <div
                  key={item.id || index}
                  className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between hover:border-primary-300 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        item.type === "condition"
                          ? getCategoryColor(item.category || "condition")
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {item.type === "condition" ? (
                        getCategoryIcon(item.category || "condition")
                      ) : (
                        <FiFileText className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      {item.label && (
                        <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider">
                          {item.label}
                        </span>
                      )}
                      <p className="font-medium text-gray-900">
                        {item.subject}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <FiCalendar className="w-3 h-3" />
                          {formatShortDate(item.date)}
                        </span>
                        {getStatusBadge(item.status)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderConditions = () => {
    const conditions = medicalHistory.conditions || [];
    const records = medicalHistory.records || [];
    const allEntries = [...conditions, ...records];

    const filteredEntries =
      filter === "all"
        ? allEntries
        : filter === "conditions"
          ? conditions
          : records;

    return (
      <div className="space-y-6">
        {/* Filter tabs */}
        <div className="flex items-center gap-2">
          <FiFilter className="text-gray-400 w-4 h-4" />
          {["all", "conditions", "records"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                filter === f
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {filteredEntries.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiHeart className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              No {filter === "all" ? "entries" : filter} found
            </h4>
            <p className="text-gray-500">
              Add medical conditions, allergies, past surgeries, or family
              history.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEntries.map((entry, index) => (
              <div
                key={entry.id || index}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${getCategoryColor(entry.category || entry.type)}`}
                    >
                      {getCategoryIcon(entry.category || entry.type)}
                    </div>
                    <div>
                      {entry.label && (
                        <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider">
                          {entry.label}
                        </span>
                      )}
                      <h4 className="font-semibold text-gray-900">
                        {entry.subject}
                      </h4>
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <FiCalendar className="w-3.5 h-3.5" />
                          {formatDate(entry.date)}
                        </span>
                        {getStatusBadge(entry.status)}
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                            entry.category === "allergy"
                              ? "bg-orange-50 text-orange-600"
                              : entry.category === "surgery"
                                ? "bg-purple-50 text-purple-600"
                                : entry.category === "medication"
                                  ? "bg-blue-50 text-blue-600"
                                  : entry.type === "condition"
                                    ? "bg-red-50 text-red-600"
                                    : "bg-blue-50 text-blue-600"
                          }`}
                        >
                          {entry.category || entry.type}
                        </span>
                      </div>
                      {entry.reference_doctype && (
                        <p className="text-xs text-gray-400 mt-2">
                          Ref: {entry.reference_doctype} -{" "}
                          {entry.reference_name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderLabResults = () => {
    return (
      <div className="space-y-4">
        {labResults.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiDroplet className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              No Lab Results
            </h4>
            <p className="text-gray-500">
              Lab test results from your healthcare provider will appear here.
            </p>
          </div>
        ) : (
          labResults.map((lab) => (
            <div
              key={lab.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-primary-300 transition-colors"
            >
              {/* Lab test header */}
              <button
                onClick={() =>
                  setExpandedLab(expandedLab === lab.id ? null : lab.id)
                }
                className="w-full p-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FiDroplet className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {lab.test_name}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 mt-1">
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <FiCalendar className="w-3.5 h-3.5" />
                        {formatShortDate(lab.date)}
                      </span>
                      {lab.doctor && (
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <FiUser className="w-3.5 h-3.5" />
                          {lab.doctor}
                        </span>
                      )}
                      {getStatusBadge(lab.status)}
                    </div>
                  </div>
                </div>
                {expandedLab === lab.id ? (
                  <FiChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <FiChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {/* Expanded lab details */}
              {expandedLab === lab.id && (
                <div className="border-t border-gray-100 p-5 bg-gray-50">
                  {lab.normal_test_items &&
                    lab.normal_test_items.length > 0 && (
                      <div className="mb-4">
                        <h5 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">
                          Test Results
                        </h5>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-white">
                                <th className="text-left py-2.5 px-4 font-medium text-gray-600 rounded-l-lg">
                                  Test
                                </th>
                                <th className="text-left py-2.5 px-4 font-medium text-gray-600">
                                  Result
                                </th>
                                <th className="text-left py-2.5 px-4 font-medium text-gray-600">
                                  Unit
                                </th>
                                <th className="text-left py-2.5 px-4 font-medium text-gray-600 rounded-r-lg">
                                  Normal Range
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {lab.normal_test_items.map((item, i) => (
                                <tr
                                  key={i}
                                  className="border-t border-gray-100 hover:bg-white transition-colors"
                                >
                                  <td className="py-2.5 px-4 text-gray-900 font-medium">
                                    {item.test_name}
                                  </td>
                                  <td className="py-2.5 px-4 text-gray-900 font-semibold">
                                    {item.result || "—"}
                                  </td>
                                  <td className="py-2.5 px-4 text-gray-500">
                                    {item.unit || "—"}
                                  </td>
                                  <td className="py-2.5 px-4 text-gray-500">
                                    {item.normal_range || "—"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                  {lab.special_test_items &&
                    lab.special_test_items.length > 0 && (
                      <div className="mb-4">
                        <h5 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">
                          Special Results
                        </h5>
                        <div className="space-y-2">
                          {lab.special_test_items.map((item, i) => (
                            <div
                              key={i}
                              className="bg-white rounded-lg p-3 flex justify-between items-center"
                            >
                              <span className="text-gray-700 font-medium">
                                {item.test_name}
                              </span>
                              <span className="text-gray-900 font-semibold">
                                {item.result || "—"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {lab.comments && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Doctor's Note:</strong> {lab.comments}
                      </p>
                    </div>
                  )}

                  {!lab.normal_test_items?.length &&
                    !lab.special_test_items?.length &&
                    !lab.comments && (
                      <p className="text-sm text-gray-500 italic">
                        Detailed results not yet available for this test.
                      </p>
                    )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    );
  };

  const renderVitalSigns = () => {
    return (
      <div className="space-y-4">
        {vitalSigns.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiThermometer className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              No Vital Signs Recorded
            </h4>
            <p className="text-gray-500">
              Vital sign readings from your healthcare visits will appear here.
            </p>
          </div>
        ) : (
          vitalSigns.map((vital) => (
            <div
              key={vital.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpandedVital(expandedVital === vital.id ? null : vital.id)
                }
                className="w-full p-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FiThermometer className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Vital Signs - {formatShortDate(vital.date)}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                      {vital.bp && <span>BP: {vital.bp} mmHg</span>}
                      {vital.pulse && <span>Pulse: {vital.pulse} bpm</span>}
                      {vital.temperature && (
                        <span>Temp: {vital.temperature}°F</span>
                      )}
                    </div>
                  </div>
                </div>
                {expandedVital === vital.id ? (
                  <FiChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <FiChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {expandedVital === vital.id && (
                <div className="border-t border-gray-100 p-5 bg-gray-50">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {vital.bp && (
                      <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <FiHeart className="w-4 h-4 text-red-500" />
                        </div>
                        <p className="text-xs text-gray-500 mb-1">
                          Blood Pressure
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {vital.bp}
                        </p>
                        <p className="text-xs text-gray-400">mmHg</p>
                      </div>
                    )}
                    {vital.pulse && (
                      <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                        <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <FiActivity className="w-4 h-4 text-pink-500" />
                        </div>
                        <p className="text-xs text-gray-500 mb-1">Heart Rate</p>
                        <p className="text-lg font-bold text-gray-900">
                          {vital.pulse}
                        </p>
                        <p className="text-xs text-gray-400">bpm</p>
                      </div>
                    )}
                    {vital.temperature && (
                      <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <FiThermometer className="w-4 h-4 text-orange-500" />
                        </div>
                        <p className="text-xs text-gray-500 mb-1">
                          Temperature
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {vital.temperature}
                        </p>
                        <p className="text-xs text-gray-400">°F</p>
                      </div>
                    )}
                    {vital.respiratory_rate && (
                      <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <FiActivity className="w-4 h-4 text-blue-500" />
                        </div>
                        <p className="text-xs text-gray-500 mb-1">
                          Respiratory Rate
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {vital.respiratory_rate}
                        </p>
                        <p className="text-xs text-gray-400">breaths/min</p>
                      </div>
                    )}
                    {vital.oxygen_saturation && (
                      <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                        <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <FiDroplet className="w-4 h-4 text-teal-500" />
                        </div>
                        <p className="text-xs text-gray-500 mb-1">SpO2</p>
                        <p className="text-lg font-bold text-gray-900">
                          {vital.oxygen_saturation}
                        </p>
                        <p className="text-xs text-gray-400">%</p>
                      </div>
                    )}
                    {vital.height && (
                      <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <FiActivity className="w-4 h-4 text-indigo-500" />
                        </div>
                        <p className="text-xs text-gray-500 mb-1">Height</p>
                        <p className="text-lg font-bold text-gray-900">
                          {vital.height}
                        </p>
                        <p className="text-xs text-gray-400">cm</p>
                      </div>
                    )}
                    {vital.weight && (
                      <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <FiActivity className="w-4 h-4 text-yellow-600" />
                        </div>
                        <p className="text-xs text-gray-500 mb-1">Weight</p>
                        <p className="text-lg font-bold text-gray-900">
                          {vital.weight}
                        </p>
                        <p className="text-xs text-gray-400">kg</p>
                      </div>
                    )}
                    {vital.bmi && (
                      <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <FiActivity className="w-4 h-4 text-emerald-500" />
                        </div>
                        <p className="text-xs text-gray-500 mb-1">BMI</p>
                        <p className="text-lg font-bold text-gray-900">
                          {vital.bmi}
                        </p>
                        <p className="text-xs text-gray-400">kg/m²</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    );
  };

  // ========== MAIN RENDER ==========

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medical History</h1>
          <p className="text-gray-600">Loading your medical history...</p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-gray-200 rounded-xl" />
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-1/3 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medical History</h1>
          <p className="text-gray-600">
            View and manage your complete medical history
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchAllData}
            className="btn-outline py-2 px-3 text-sm flex items-center gap-2"
          >
            <FiRefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary py-2 px-3 text-sm flex items-center gap-2"
          >
            <FiPlus className="w-4 h-4" />
            Add Entry
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-white text-primary-700 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "overview" && renderOverview()}
        {activeTab === "conditions" && renderConditions()}
        {activeTab === "lab-results" && renderLabResults()}
        {activeTab === "vitals" && renderVitalSigns()}
      </div>

      {/* Add Medical History Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Add Medical History
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  This will be saved to your healthcare record
                </p>
              </div>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleAddEntry} className="p-6 space-y-5">
              {/* Category Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      value: "condition",
                      label: "Condition",
                      icon: <FiHeart className="w-4 h-4" />,
                      active: "border-red-400 bg-red-50 text-red-700",
                    },
                    {
                      value: "allergy",
                      label: "Allergy",
                      icon: <FiAlertCircle className="w-4 h-4" />,
                      active: "border-orange-400 bg-orange-50 text-orange-700",
                    },
                    {
                      value: "medication",
                      label: "Medication",
                      icon: <FiClipboard className="w-4 h-4" />,
                      active: "border-blue-400 bg-blue-50 text-blue-700",
                    },
                    {
                      value: "surgery",
                      label: "Surgery/Procedure",
                      icon: <FiActivity className="w-4 h-4" />,
                      active: "border-purple-400 bg-purple-50 text-purple-700",
                    },
                  ].map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, category: cat.value })
                      }
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        formData.category === cat.value
                          ? cat.active
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {cat.icon}
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder={
                    formData.category === "condition"
                      ? "e.g., Diabetes Type 2, Hypertension"
                      : formData.category === "allergy"
                        ? "e.g., Penicillin, Peanuts, Dust"
                        : formData.category === "surgery"
                          ? "e.g., Appendectomy, Knee Replacement"
                          : formData.category === "medication"
                            ? "e.g., Amlodipine 5mg, Metformin 500mg"
                            : "e.g., General medical record"
                  }
                  className="input"
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="input"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Any additional details or notes..."
                  rows={3}
                  className="input resize-none"
                />
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiCheckCircle className="w-4 h-4" />
                      Save Entry
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MedicalHistory;
