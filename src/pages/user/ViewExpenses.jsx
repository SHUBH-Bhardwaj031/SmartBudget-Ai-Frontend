import React, { useEffect, useState } from "react";
import { getExpenses } from "../../services/ExpenseService";
import { toast } from "react-toastify";
import { MdInfo, MdTimer } from "react-icons/md";
import ExpenseView from "../../components/user/ExpenseView";
import { Button, TextInput, Datepicker, Label } from "flowbite-react";
import Swal from "sweetalert2";
function ViewExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [allExpenses, setAllExpenses] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");

  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    fromDate: "",
    toDate: "",
  });

  useEffect(() => {
    if (searchKeyword.trim() == "") {
      setExpenses([...allExpenses]);
      return;
    }

    if (searchKeyword.trim() != "" && searchKeyword.trim().length > 2) {
      const searchedElements = allExpenses.filter((exp) =>
        exp.title.toLowerCase().includes(searchKeyword.toLowerCase())
      );

      if (searchedElements.length <= 0) {
        return;
      }

      setExpenses(searchedElements);
      return;
    }
  }, [searchKeyword]);

  // function to load data with filters: defaults
  async function loadExpense(minPrice = "", maxPrice = "",fromDate="",toDate="") {
    try {
      const exp = await getExpenses(minPrice, maxPrice,fromDate,toDate);
      console.log(exp);
      setExpenses(exp);
      setAllExpenses(exp);
    }
    catch (error) {
    console.log(error);
  }
  }

  useEffect(() => {
    //loadExpese

    loadExpense();
  }, []);

  const applyFilter = async () => {
    console.log(filters);

    loadExpense(filters.minPrice, filters.maxPrice,filters.fromDate,filters.toDate);
    console.log(loadExpense);
    // load filtered data from server:
  };

  const clearFilter = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      fromDate:"",
      toDate:""
    });

    setSearchKeyword("");

    loadExpense();
  };

  //remove expense:

  const removeExpense = (expenseId) => {
    const newExpenses = expenses.filter((exp) => exp._id != expenseId);
    const newAllExpenses = allExpenses.filter((exp) => exp._id != expenseId);
    setExpenses([...newExpenses]);
    setAllExpenses([...newAllExpenses]);
  };

  return (
    <div>
      {/* heading */}
      {/* <h1 className="text-3xl text-end mb-3 w-fit font-semibold">
        Expenses : {expenses.length}
      </h1> */}

      {/* search bar */}
      <div className="flex gap-3 mb-3 border flex-wrap">
        <input 
          onChange={(e) => {
            setSearchKeyword(e.target.value);
          }}
          value={searchKeyword}
          type="text"
          id="voice-search"
          className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block flex-1 ps-10 p-2.5  "
          placeholder="Search your expense here "
          required
        />
      </div>

      {/* END search bar */}

      {/* Filters */}

      <div className="filter_container  items-center flex justify-between gap-2">
        <div className="flex gap-2 flex-wrap items-end ">
          <div className="flex flex-col">
            <Label htmlFor="minPrice" className="text-gray-600 px-1 text-xs">
              Select min price
            </Label>
            <TextInput
              onChange={(e) => {
                // console.log(e.target.value);
                setFilters({
                  ...filters,
                  minPrice: e.target.value,
                });
              }}
              value={filters.minPrice}
              id="minPrice"
              sizing="sm"
              placeholder="Min Price"
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="maxPrice" className="text-gray-600 px-1 text-xs">
              Select max price
            </Label>
            <TextInput
              onChange={(e) => {
                setFilters({
                  ...filters,
                  maxPrice: e.target.value,
                });
              }}
              value={filters.maxPrice}
              id="maxPrice"
              sizing="sm"
              placeholder="Max Price"
            />
          </div>

          <div className="flex flex-col">
            <Label htmlFor="fromDate" className="text-gray-600 px-1 text-xs">
              Select From Date
            </Label>
           <Datepicker
            onChange={(date) =>{
            setFilters({ ...filters, fromDate: date ? date : "" })
  }}
   value={filters.fromDate ? new Date(filters.fromDate) : null}  
  id="fromDate" sizing="sm" placeholder="fromDate" />
          </div>

          <div className="flex flex-col">
            <Label htmlFor="toDate" className="text-gray-600 px-1 text-xs">
              Select To Date
            </Label>
            <Datepicker onChange={(date) => {
                // console.log(e.target.value);
                setFilters({
                  ...filters,
                  toDate: date ? date : "",
                });
              }}  value={filters.toDate ? new Date(filters.toDate) : null}
               id="toDate" sizing="sm" placeholder="toDate" />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={applyFilter}
            className="cursor-pointer"
            size="sm"
            color={"blue"}
          >
            Apply Filter
          </Button>
          <Button
            onClick={clearFilter}
            className="cursor-pointer"
            size="sm"
            color={"red"}
          >
            Clear Filter
          </Button>
        </div>
      </div>

      {/* END Filters */}
      {expenses.length > 0 && (
        <div className="">
          <div>
            <div className="flex flex-wrap mt-8 gap-4">
              {expenses.map((expense, index) => (
                <ExpenseView  removeExpense={removeExpense} key={index} expense={expense} />
              ))}
            </div>
          </div>
        </div>
      )}
      {expenses.length <= 0 && (
        <div className="flex flex-col justify-center mt-10 items-center gap-2">
          <MdInfo className="text-red-400" size={38} />
          <h1 className="text-center text-3xl font-semibold">
            No expense available
          </h1>
        </div>
      )}
    </div>
  );
}

export default ViewExpenses;
