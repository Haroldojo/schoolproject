import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function AddSchool() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log("🚀 Form submission started");
    console.log("📝 Form data:", data);

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      setSubmitStatus({
        type: "info",
        message: "Uploading school data...",
      });

      console.log("🌐 Sending POST request to /api/schools");

      // Send as JSON, not FormData
      const res = await fetch("/api/schools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // Send as JSON
      });

      console.log("📡 Response status:", res.status);
      console.log(
        "📡 Response headers:",
        Object.fromEntries(res.headers.entries())
      );

      if (res.ok) {
        const responseData = await res.json().catch(() => null);
        console.log("✅ Success response:", responseData);

        setSubmitStatus({
          type: "success",
          message: "School added successfully!",
        });
        reset(); // Clear form on success
      } else {
        const errorData = await res
          .json()
          .catch(() => ({ error: "Unknown error" }));
        console.error("❌ Error response:", {
          status: res.status,
          statusText: res.statusText,
          body: errorData,
        });

        setSubmitStatus({
          type: "error",
          message: errorData.error || `Failed to add school (${res.status})`,
        });
      }
    } catch (error) {
      console.error("💥 Network/fetch error:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });

      setSubmitStatus({
        type: "error",
        message: `Network error: ${error.message}`,
      });
    } finally {
      setIsSubmitting(false);
      console.log("🏁 Form submission completed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            Add New School
          </h1>
          <p className="text-white/80 text-lg">
            Fill in the details below to register a new school
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="space-y-6">
            {/* School Name */}
            <div className="space-y-2">
              <label className="text-white font-semibold text-sm uppercase tracking-wide">
                School Name
              </label>
              <input
                type="text"
                placeholder="Enter school name"
                {...register("name", { required: "School name is required" })}
                className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
              />
              {errors.name && (
                <p className="text-red-200 text-sm flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="text-white font-semibold text-sm uppercase tracking-wide">
                Address
              </label>
              <input
                type="text"
                placeholder="Enter full address"
                {...register("address", { required: "Address is required" })}
                className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
              />
              {errors.address && (
                <p className="text-red-200 text-sm flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* City and State Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-white font-semibold text-sm uppercase tracking-wide">
                  City
                </label>
                <input
                  type="text"
                  placeholder="Enter city"
                  {...register("city", { required: "City is required" })}
                  className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
                />
                {errors.city && (
                  <p className="text-red-200 text-sm flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-white font-semibold text-sm uppercase tracking-wide">
                  State
                </label>

                <select
                  {...register("state", { required: "State is required" })}
                  className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur border border-white/30
                    text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
                >
                  <option value="" hidden className="text-white-300">
                    Select a state
                  </option>
                  <option className="text-black" value="Andhra Pradesh">
                    Andhra Pradesh
                  </option>
                  <option className="text-black" value="Arunachal Pradesh">
                    Arunachal Pradesh
                  </option>
                  <option className="text-black" value="Assam">
                    Assam
                  </option>
                  <option className="text-black" value="Bihar">
                    Bihar
                  </option>
                  <option className="text-black" value="Chhattisgarh">
                    Chhattisgarh
                  </option>
                  <option className="text-black" value="Delhi">
                    Delhi
                  </option>
                  <option className="text-black" value="Goa">
                    Goa
                  </option>
                  <option className="text-black" value="Gujarat">
                    Gujarat
                  </option>
                  <option className="text-black" value="Haryana">
                    Haryana
                  </option>
                  <option className="text-black" value="Himachal Pradesh">
                    Himachal Pradesh
                  </option>
                  <option className="text-black" value="Jharkhand">
                    Jharkhand
                  </option>
                  <option className="text-black" value="Karnataka">
                    Karnataka
                  </option>
                  <option className="text-black" value="Kerala">
                    Kerala
                  </option>
                  <option className="text-black" value="Madhya Pradesh">
                    Madhya Pradesh
                  </option>
                  <option className="text-black" value="Maharashtra">
                    Maharashtra
                  </option>
                  <option className="text-black" value="Manipur">
                    Manipur
                  </option>
                  <option className="text-black" value="Meghalaya">
                    Meghalaya
                  </option>
                  <option className="text-black" value="Mizoram">
                    Mizoram
                  </option>
                  <option className="text-black" value="Nagaland">
                    Nagaland
                  </option>
                  <option className="text-black" value="Odisha">
                    Odisha
                  </option>
                  <option className="text-black" value="Punjab">
                    Punjab
                  </option>
                  <option className="text-black" value="Rajasthan">
                    Rajasthan
                  </option>
                  <option className="text-black" value="Sikkim">
                    Sikkim
                  </option>
                  <option className="text-black" value="Tamil Nadu">
                    Tamil Nadu
                  </option>
                  <option className="text-black" value="Telangana">
                    Telangana
                  </option>
                  <option className="text-black" value="Tripura">
                    Tripura
                  </option>
                  <option className="text-black" value="Uttar Pradesh">
                    Uttar Pradesh
                  </option>
                  <option className="text-black" value="Uttarakhand">
                    Uttarakhand
                  </option>
                  <option className="text-black" value="West Bengal">
                    West Bengal
                  </option>
                </select>

                {errors.state && (
                  <p className="text-red-200 text-sm flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.state.message}
                  </p>
                )}
              </div>
            </div>

            {/* Contact and Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-white font-semibold text-sm uppercase tracking-wide">
                  Contact Number
                </label>
                <input
                  type="tel"
                  placeholder="Enter contact number"
                  {...register("contact", {
                    required: "Contact number is required",
                    pattern: {
                      value: /^[0-9+\-\s()]{10,}$/,
                      message: "Enter a valid contact number",
                    },
                  })}
                  className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
                />
                {errors.contact && (
                  <p className="text-red-200 text-sm flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.contact.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-white font-semibold text-sm uppercase tracking-wide">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  {...register("email_id", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },
                  })}
                  className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
                />
                {errors.email_id && (
                  <p className="text-red-200 text-sm flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.email_id.message}
                  </p>
                )}
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <label className="text-white font-semibold text-sm uppercase tracking-wide">
                School Image URL
              </label>
              <input
                type="url"
                placeholder="Enter public image URL (https://...)"
                {...register("image", {
                  required: "School image URL is required",
                  pattern: {
                    value: /^https?:\/\/.+/i,
                    message:
                      "Enter a valid URL starting with http:// or https://",
                  },
                })}
                className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
              />
              <p className="text-white/60 text-xs">
                Enter any public image URL (Google Drive, Imgur, etc.)
              </p>
              {errors.image && (
                <p className="text-red-200 text-sm flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.image.message}
                </p>
              )}
            </div>

            {/* Status Message */}
            {submitStatus && (
              <div
                className={`p-4 rounded-xl ${
                  submitStatus.type === "success"
                    ? "bg-green-500/20 border border-green-400/30 text-green-100"
                    : submitStatus.type === "error"
                    ? "bg-red-500/20 border border-red-400/30 text-red-100"
                    : submitStatus.type === "warning"
                    ? "bg-yellow-500/20 border border-yellow-400/30 text-yellow-100"
                    : "bg-blue-500/20 border border-blue-400/30 text-blue-100"
                }`}
              >
                <div className="flex items-center">
                  <span className="mr-2">
                    {submitStatus.type === "success"
                      ? "✅"
                      : submitStatus.type === "error"
                      ? "❌"
                      : submitStatus.type === "warning"
                      ? "⚠️"
                      : "ℹ️"}
                  </span>
                  {submitStatus.message}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-white text-lg transition-all duration-300 transform ${
                isSubmitting
                  ? "bg-gray-500/50 cursor-not-allowed scale-95"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-xl"
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Add School
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
