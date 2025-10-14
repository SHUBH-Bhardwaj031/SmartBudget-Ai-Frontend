// AddExpense.jsx
import React, { useState } from "react";
import { createExpense } from "../../services/ExpenseService";
import { toast } from "react-toastify";

const AddExpense = ({ onExpenseAdded }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    rs: "",
    paymentMethod: "Cash",
    hidden: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createExpense(formData);
      toast.success("Expense created successfully...");

      // Reset form
      setFormData({
        title: "",
        description: "",
        rs: "",
        paymentMethod: "Cash",
        hidden: false,
      });

      // 🔑 Parent ko inform karo
      if (onExpenseAdded) onExpenseAdded();

    } catch (error) {
      console.error(error);
      toast.error("Error in creating expense");
    }
  };

  return (
    <div className="max-w-md mx-auto  bg-[#1B1F24] border border-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#2563EB] to-[#10B981] bg-clip-text text-transparent">
        Add Expense
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter expense title"
            className="w-full px-3 py-2 bg-[#2A2F36] text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            placeholder="Enter expense description"
            className="w-full px-3 py-2 bg-[#2A2F36] text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Amount (₹)
          </label>
          <input
            type="number"
            name="rs"
            value={formData.rs}
            onChange={handleChange}
            placeholder="Enter amount"
            className="w-full px-3 py-2 bg-[#2A2F36] text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Payment Method
          </label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-[#2A2F36] text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="Cash">💵 Cash</option>
            <option value="Card">💳 Card</option>
            <option value="UPI">📱 UPI</option>
            <option value="Bank Transfer">🏦 Bank Transfer</option>
          </select>
        </div>

        {/* Hidden Toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="hidden"
            checked={formData.hidden}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-500 border-gray-600 bg-[#2A2F36] rounded focus:ring-indigo-600"
          />
          <label className="text-sm text-gray-300">Mark as Hidden</label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Save Expense
        </button>
      </form>
    </div>
  );
};

export default AddExpense;
