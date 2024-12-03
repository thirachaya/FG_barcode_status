import React, { useContext, useState  } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "../css/App.css";
import TotalAll from "../components/TotalAll";
import AgingTable from "../components/AgingTable";
import MonthlyChart from "../components/MonthlyChart";
import Details from "./Details";
import Select from "react-select";
import { PlantContext } from "./PlantContext";

function App() {
  const { plant, setPlant } = useContext(PlantContext);
  console.log("Current plant:", plant); 
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

  const options = [
    { value: "9771", label: "RF" },
    { value: "9773", label: "WAC" },
    { value: "9774", label: "SAC" },
  ];

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="base flex flex-col justify-center">
              <div className="flex justify-center h-[70%] w-full p-3">
                <div className="flex flex-col items-center">
                  <Select
                    value={options.find((option) => option.value === plant)}
                    options={options}
                    styles={customSelect}
                    isSearchable={false}
                    onChange={(selectedOption) => setPlant(selectedOption.value)}
                  />
                  <TotalAll />
                </div>
                <MonthlyChart/>
              </div>
              <div className="flex justify-center h-[30%] p-5">
                <AgingTable />
              </div>
              <div className="flex justify-end">
                <Link
                  to="/details"
                  className="mt-5 inline-block px-6 py-2 border-2 rounded-md text-white hover:bg-sky-700"
                >
                  Go to Detail
                </Link>
              </div>
            </div>
          }
        />
        <Route path="/details" element={<Details />} />
        <Route path="/details/:id" element={<Details />} />
      </Routes>
    </Router>
  );
}

export default App;
