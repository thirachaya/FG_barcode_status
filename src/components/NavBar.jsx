import React, { useContext, useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import CalendarIcon from "../assets/calendar.png";
import { PlantContext } from "../pages/PlantContext";
import findIcon from "../assets/find.png"

const customSelect = {
  control: (provided) => ({
    ...provided,
    borderRadius: "8px",
    borderColor: "#6c757d",
    boxShadow: "none",
    width: "150px",
    fontSize: "16px",
    "&:hover": {
      borderColor: "#495057",
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#1f5291"
      : state.isFocused
      ? "#a1c6f3"
      : "white",
    color: state.isSelected ? "white" : "#212529",
    padding: 10,
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "8px",
    overflow: "hidden",
  }),
};

const plantOptions = [
  { value: "9771", label: "RF" },
  { value: "9773", label: "WAC" },
  { value: "9774", label: "SAC" },
];

const timePeriodOptions = [
  { value: "yearly", label: "Yearly" },
  { value: "monthly", label: "Monthly" },
  { value: "weekly", label: "Weekly" },
  { value: "daily", label: "Daily" },
];

const NavBar = ({
  setTimePeriod,
  startDate,
  endDate,
  setDateRange,
  clearDateRange,
}) => {
  const { plant, setPlant } = useContext(PlantContext);
  const [searchType, setSearchType] = useState("product_code");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/details?searchType=${searchType}&query=${searchQuery}`);
    }
  };

  return (
    <div className="flex justify-center items-center space-x-4">
      <Select
        value={plantOptions.find((option) => option.value === plant)}
        options={plantOptions}
        styles={customSelect}
        isSearchable={false}
        onChange={(selectedOption) => setPlant(selectedOption.value)}
      />

      <Select
        defaultValue={timePeriodOptions[1]}
        options={timePeriodOptions}
        styles={customSelect}
        isSearchable={false}
        onChange={(selectedOption) => setTimePeriod(selectedOption.value)}
      />

      <div className="relative flex">
        <DatePicker
          selected={startDate}
          onChange={(update) => setDateRange(update)}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          showYearDropdown
          showMonthDropdown
          dateFormat="yyyy/MM/dd"
          placeholderText="Select date range"
          className="bg-white text-black border border-gray-300 p-1.5 rounded-md shadow-sm w-56"
        />
        <img
          src={CalendarIcon}
          alt=""
          width={"24px"}
          className="absolute right-1 top-2"
        />
      </div>
      <button
        onClick={clearDateRange}
        className="bg-red-500 text-white px-2 h-[38px] rounded-md"
      >
        Clear
      </button>

      <div className="flex items-center">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="px-2 py-2 border rounded-l bg-gray-500"
        >
          <option value="product_code">Product Code</option>
          <option value="prod_order">Product Order</option>
        </select>
        <div className="relative flex">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search by ${
              searchType === "product_code" ? "Product Code" : "Product Order"
            }`}
            className="px-3 py-2 w-64 border-t border-b border-gray-300"
          />
          <img
            src={findIcon}
            class="absolute inset-y-0 right-1 h-6 w-6 top-2"
          />
        </div>

        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-sky-700 text-white rounded-r border border-gray-300"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default NavBar;
