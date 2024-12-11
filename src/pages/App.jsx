import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "../css/App.css";
import TotalAll from "../components/TotalAll";
import AgingTable from "../components/AgingTable";
import MonthlyChart from "../components/MonthlyChart";
import Details from "./Details";
import NavBar from "../components/NavBar";

function App() {
  const [timePeriod, setTimePeriod] = useState("monthly");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const clearDateRange = () => {
    setDateRange([null, null]);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="base flex flex-col justify-center">
              <NavBar
                setTimePeriod={setTimePeriod}
                startDate={startDate}
                endDate={endDate}
                setDateRange={setDateRange}
                clearDateRange={clearDateRange}
              />

              <div className="flex justify-center h-[70%] w-full p-3">
                <div className="flex flex-col items-center">
                  <TotalAll />
                </div>
                <MonthlyChart
                  timePeriod={timePeriod}
                  startDate={startDate}
                  endDate={endDate}
                />
                
              </div>
              <div className="flex justify-center h-[30%] p-5">
                <AgingTable />
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
