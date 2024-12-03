import React, { useState, useEffect, useContext } from "react";
import ReactECharts from "echarts-for-react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CalendarIcon from "../assets/calendar.png";
import { PlantContext } from "../pages/PlantContext";

const path_api = import.meta.env.VITE_API_URL;
const customSelect = {
  control: (provided) => ({
    ...provided,
    borderRadius: "8px",
    borderColor: "#6c757d",
    boxShadow: "none",
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
  { value: "yearly", label: "Yearly" },
  { value: "monthly", label: "Monthly" },
  { value: "weekly", label: "Weekly" },
  { value: "daily", label: "Daily" },
];

const MonthlyChart = () => {
  const { plant } = useContext(PlantContext);
  const [chartData, setChartData] = useState([]);
  const [timePeriod, setTimePeriod] = useState("monthly");
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({ period: timePeriod });

        const defaultStartDate = new Date("2024-01-01");
        const defaultEndDate = new Date();

        const formattedStartDate = startDate
          ? startDate.toISOString()
          : defaultStartDate.toISOString();
        const formattedEndDate = endDate
          ? endDate.toISOString()
          : defaultEndDate.toISOString();

        const byPeriod = `${path_api}/byPeriod?${queryParams}&startDate=${formattedStartDate}&endDate=${formattedEndDate}&plant=${plant}`;
        const response = await fetch(byPeriod);
        const data = await response.json();
        console.log(byPeriod);
        console.log("Current plant chart:", plant);
        if (timePeriod === "monthly") {
          const filteredData = data.filter((item) => item.month !== null);
          setChartData(
            filteredData.map((item) => ({
              label: `${item.year}-${String(item.month).padStart(2, "0")}`,
              value: item.gr_not_gi_count,
            }))
          );
        } else if (timePeriod === "yearly") {
          const yearlyData = data.filter((item) => item.year !== null);
          setChartData(
            yearlyData.map((item) => ({
              label: item.year,
              value: item.gr_not_gi_count,
            }))
          );
        } else if (timePeriod === "weekly") {
          const weeklyData = data.filter((item) => item.week !== null);
          setChartData(
            weeklyData.map((item) => ({
              label: `Week ${item.week}`,
              value: item.gr_not_gi_count,
            }))
          );
        } else if (timePeriod === "daily") {
          const dailyData = data.filter((item) => item.date !== null);
          setChartData(
            dailyData.map((item) => ({
              label: item.date.split("T")[0],
              value: item.gr_not_gi_count,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timePeriod, startDate, endDate, plant]);

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      top: "8%",
      left: "3%",
      right: "4%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        data: chartData.map((item) => item.label),
        axisTick: {
          alignWithLabel: true,
        },
      },
    ],
    yAxis: [
      {
        type: "value",
      },
    ],
    series: [
      {
        name: "GR not GI",
        type: "bar",
        barWidth: "70%",
        barMaxWidth: 40,
        data: chartData.map((item) => item.value),
      },
    ],
    dataZoom: [
      {
        type: "slider",
        start: 0,
        end: 50,
        height: 10,
        backgroundColor: "rgba(47, 69, 84, 0.1)",
        borderColor: "#ccc",
        fillerColor: "rgba(47, 69, 84, 0.2)",
        handleIcon: "path://M10,10 v40 h20 v-40 h-20 Z",
        handleStyle: {
          color: "#fff",
          borderColor: "#666",
        },
        textStyle: {
          color: "#fff",
        },
      },
      {
        type: "inside",
        start: 0,
        end: 100,
      },
    ],
  };

  const clearDateRange = () => {
    setDateRange([null, null]);
  };  

  return (
    <div className="w-[70%] h-full shadow-lg rounded-lg">
      <div className="flex justify-start mb-4 space-x-4">
        <Select
          defaultValue={options[1]}
          options={options}
          styles={customSelect}
          isSearchable={false}
          onChange={(selectedOption) => setTimePeriod(selectedOption.value)}
        />
        <div className="relative flex">
          <DatePicker
            selected={startDate}
            onChange={(update) => {
              const formattedStartDate = update[0]
                ? new Date(update[0]).toISOString().split("T")[0]
                : null;
              const formattedEndDate = update[1]
                ? new Date(update[1]).toISOString().split("T")[0]
                : null;

              setDateRange(update);
            }}
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
          className="bg-red-500 text-white p-2 rounded-md"
        >
          Clear
        </button>
      </div>
      {loading ? (
        <div className="text-center py-10">
          <span className="text-lg font-medium text-gray-600">Loading...</span>
        </div>
      ) : (
        <ReactECharts
          option={option}
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </div>
  );
};

export default MonthlyChart;
