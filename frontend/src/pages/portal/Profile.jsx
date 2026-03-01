import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiEdit2,
  FiSave,
  FiX,
} from "react-icons/fi";
import toast from "react-hot-toast";
import useAuthStore from "../../store/authStore";
import { patientAPI } from "../../services/api";

function Profile() {
  const navigate = useNavigate();
  const { user, updateProfile, fetchProfile, logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      date_of_birth: user?.date_of_birth || "",
      gender: user?.gender || "",
      blood_group: user?.blood_group || "",
      address: user?.address || "",
      emergency_contact: user?.emergency_contact || "",
      emergency_phone: user?.emergency_phone || "",
    },
  });

  useEffect(() => {
    const loadProfile = async () => {
      setProfileLoading(true);
      await fetchProfile();
      setProfileLoading(false);
    };
    loadProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (user) {
      // Format date_of_birth to YYYY-MM-DD for date input
      let formattedDob = "";
      if (user.date_of_birth) {
        const date = new Date(user.date_of_birth);
        formattedDob = date.toISOString().split("T")[0];
      }

      reset({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
        date_of_birth: formattedDob,
        gender: user.gender || "",
        blood_group: user.blood_group || "",
        address: user.address || "",
        emergency_contact: user.emergency_contact || "",
        emergency_phone: user.emergency_phone || "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await patientAPI.updateProfile(data);
      await updateProfile(data);
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    reset();
    setIsEditing(false);
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      await patientAPI.deleteAccount();
      toast.success("Account deleted successfully");
      logout();
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete account");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Manage your personal information</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary flex items-center"
          >
            <FiEdit2 className="mr-2" /> Edit Profile
          </button>
        )}
      </div>

      {/* Profile Card */}
      <div className="card">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 rounded-t-xl">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-primary-600 text-3xl font-bold">
              {user?.first_name?.[0]}
              {user?.last_name?.[0]}
            </div>
            <div className="text-white">
              <h2 className="text-2xl font-bold">
                {user?.first_name} {user?.last_name}
              </h2>
              <p className="text-primary-100">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiUser className="mr-2" /> Personal Information
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                {...register("first_name", {
                  required: "First name is required",
                })}
                disabled={!isEditing}
                className={`input-field ${!isEditing ? "bg-gray-50" : ""}`}
              />
              {errors.first_name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.first_name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                {...register("last_name", {
                  required: "Last name is required",
                })}
                disabled={!isEditing}
                className={`input-field ${!isEditing ? "bg-gray-50" : ""}`}
              />
              {errors.last_name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.last_name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiMail className="inline mr-1" /> Email
              </label>
              <input
                type="email"
                {...register("email")}
                disabled
                className="input-field bg-gray-50"
              />
              <p className="mt-1 text-xs text-gray-500">
                Email cannot be changed
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiPhone className="inline mr-1" /> Phone
              </label>
              <input
                type="tel"
                {...register("phone")}
                disabled={!isEditing}
                className={`input-field ${!isEditing ? "bg-gray-50" : ""}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiCalendar className="inline mr-1" /> Date of Birth
              </label>
              <input
                type="date"
                {...register("date_of_birth")}
                disabled={!isEditing}
                className={`input-field ${!isEditing ? "bg-gray-50" : ""}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                {...register("gender")}
                disabled={!isEditing}
                className={`input-field ${!isEditing ? "bg-gray-50" : ""}`}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blood Group
              </label>
              <select
                {...register("blood_group")}
                disabled={!isEditing}
                className={`input-field ${!isEditing ? "bg-gray-50" : ""}`}
              >
                <option value="">Select</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                {...register("address")}
                rows={2}
                disabled={!isEditing}
                className={`input-field resize-none ${!isEditing ? "bg-gray-50" : ""}`}
              />
            </div>

            {/* Emergency Contact */}
            <div className="md:col-span-2 border-t pt-6 mt-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Emergency Contact
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Name
              </label>
              <input
                type="text"
                {...register("emergency_contact")}
                disabled={!isEditing}
                className={`input-field ${!isEditing ? "bg-gray-50" : ""}`}
                placeholder="Emergency contact name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Phone
              </label>
              <input
                type="tel"
                {...register("emergency_phone")}
                disabled={!isEditing}
                className={`input-field ${!isEditing ? "bg-gray-50" : ""}`}
                placeholder="Emergency contact phone"
              />
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={cancelEdit}
                className="btn-outline flex items-center"
              >
                <FiX className="mr-2" /> Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <FiSave className="mr-2" /> Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Danger Zone */}
      <div className="card p-6 border-red-200">
        <h3 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h3>
        <p className="text-gray-600 text-sm mb-4">
          Once you delete your account, there is no going back. Please be
          certain.
        </p>
        <button
          onClick={handleDeleteAccount}
          className="text-red-600 border border-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}

export default Profile;
