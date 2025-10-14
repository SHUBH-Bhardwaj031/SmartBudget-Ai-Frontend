import React, { useState } from "react";
import { createUser } from "../services/UserService";
import { toast } from "react-toastify";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    gender: "",
    age: "",
  });

  const [errors, setErrors] = useState([]);
  const [creating, setCreating] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    setErrors([]);

    try {
      const response = await createUser(formData);
      console.log(response);
      toast.success("User created successfully!");
      setFormData({
        username: "",
        email: "",
        password: "",
        gender: "",
        age: "",
      });
      setCreating(false);
    } catch (error) {
      if (error.status === 400) {
        setErrors(error.response.data);
        toast.error("Validation error");
      } else if (error.status === 403) {
        toast.error("You don't have permission to create a user.");
      } else {
        toast.error("Server error");
      }
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1B1F24] flex items-center justify-center px-4">
      <div className="bg-[#1F242C] w-full max-w-md  mt-25 mb-30 p-6 rounded-xl shadow-lg border border-gray-700">
        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-5 bg-gradient-to-r from-[#2563EB] to-[#10B981] bg-clip-text text-transparent">
          Create Your Account
        </h2>

        {/* Error Messages */}
        <div className="py-2">
          {errors.length > 0 &&
            errors.map((error, idx) => (
              <div
                key={idx}
                className="p-2 border border-red-500 rounded mb-2 bg-red-900/20"
              >
                <p className="text-red-400 text-sm">
                  {error.property.toUpperCase()}: {error.errorValue}
                </p>
              </div>
            ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-gray-300 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-[#2A303B] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-[#2A303B] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-300 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-[#2A303B] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              placeholder="Enter a strong password"
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-300 mb-2">Gender</label>
            <div className="flex space-x-6">
              <label className="inline-flex items-center text-gray-300">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === "male"}
                  onChange={handleChange}
                  className="text-[#2563EB] focus:ring-[#10B981]"
                />
                <span className="ml-2">Male</span>
              </label>
              <label className="inline-flex items-center text-gray-300">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === "female"}
                  onChange={handleChange}
                  className="text-[#2563EB] focus:ring-[#10B981]"
                />
                <span className="ml-2">Female</span>
              </label>
            </div>
          </div>

          {/* Age */}
          <div>
            <label className="block text-gray-300 mb-1">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 rounded-lg bg-[#2A303B] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#10B981]"
              placeholder="Your age"
              required
            />
          </div>

          {/* Submit */}
          <div>
            <button
              disabled={creating}
              type="submit"
              className="disabled:bg-gray-500 w-full bg-gradient-to-r from-[#2563EB] to-[#10B981] text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
            >
              {creating ? "Creating user.." : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
