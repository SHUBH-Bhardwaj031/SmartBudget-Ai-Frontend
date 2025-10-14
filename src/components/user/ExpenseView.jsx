import React from "react";
import { BsPencilSquare } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { deleteExpense } from "../../services/ExpenseService";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

function ExpenseView({ removeExpense, expense }) {
  const formattedDate = new Date(expense.createdAt).toLocaleDateString(
    "en-IN",
    { day: "numeric", month: "short", year: "numeric" }
  );

  async function handleDelete() {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#000",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const data = await deleteExpense(expense._id);
        removeExpense(expense._id);
        toast.success(data.message);
      } catch (error) {
        toast.error("Error in deleting expense!!");
        console.log(error);
      }
    }
  }

  return (
<div className="w-[calc(33%-16px)] bg-gray-900 hover:scale-[1.07] hover:border-[#646cff]  cursor-pointer border-2 border-gray-900 rounded-lg p-5 flex flex-col gap-3 shadow-sm hover:shadow-lg transition-transform duration-200 ease-in-out">

      {/* Header: Title + Amount */}
      <div className="flex justify-between items-center border-b border-gray-700 pb-2">
        <h2 className="text-lg font-semibold text-white">{expense.title}</h2>
        <span className="text-lg font-bold text-[#10B981]">₹{expense.rs}</span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-400">{expense.description}</p>

      {/* Footer Info */}
      <div className="flex justify-between items-center text-sm text-gray-400 pt-2 border-t border-gray-700">
        <span className="px-2 py-1 bg-[#2A303B] rounded-md text-gray-300">
          💵 {expense.paymentMethod}
        </span>
        <span>{formattedDate}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-3 justify-end">
        <MdDelete
          onClick={handleDelete}
          className="cursor-pointer p-2 w-8 h-8 bg-[#2A303B] text-red-400 hover:bg-red-500 hover:text-white rounded-md transition"
        />
        <BsPencilSquare
          className="cursor-pointer p-2 w-8 h-8 bg-[#2A303B] text-blue-400 hover:bg-blue-500 hover:text-white rounded-md transition"
        />
      </div>
    </div>
  );
}

export default ExpenseView;
