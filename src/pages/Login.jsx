import React, { useState } from "react";
import { toast } from "react-toastify";
import { loginUser } from "../services/AuthService";
import { saveLoginData } from "../services/LocalStorageService";
import { useNavigate } from "react-router";
import { useAuthContext } from "../context/AuthContext";

function Login() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const { setUser, setAccessToken } = useAuthContext();
  const navigate = useNavigate();

  const submitData = async (event) => {
    event.preventDefault();

    if (loginData.email.trim() === "") {
      toast.error("Email required !!");
      return;
    }
    if (loginData.password.trim() === "") {
      toast.error("Password required !!");
      return;
    }

    try {
      const responseData = await loginUser(loginData);
      saveLoginData(responseData);
      setUser(responseData.user);
      setAccessToken(responseData.accessToken);
      navigate("/dashboard");
    } catch (error) {
      if (error.status === 403) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error in login!!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#1B1F24] flex items-center justify-center px-4">
      {/* Card */}
      <div className="border border-gray-700 max-w-md w-full   h-100 bg-[#1F242C] p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-5 bg-gradient-to-r from-[#2563EB] to-[#10B981] bg-clip-text text-transparent">
          Login to Your Account
        </h2>

        <form noValidate onSubmit={submitData} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-gray-300 mb-1 text-sm">Email</label>
            <input
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
              type="email"
              name="email"
              className="w-full px-3 py-2 border rounded-lg bg-gray-900 text-white 
                         focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-300 mb-1 text-sm">Password</label>
            <input
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
              type="password"
              name="password"
              className="w-full px-3 py-2 border rounded-lg bg-gray-900 text-white 
                         focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-3 mt-5">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#2563EB] to-[#10B981] text-white py-2 rounded-lg font-medium hover:opacity-90 transition cursor-pointer text-sm"
            >
              Login
            </button>
            <button
              type="submit"
              onClick={() => setLoginData({ email: "", password: "" })}
              className="bg-red-600 hover:bg-red-700 transition duration-300 
                         text-white px-4 py-2 rounded-lg font-medium cursor-pointer text-sm"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
