import React, { useState, useEffect, useContext } from "react";
import ReactECharts from "echarts-for-react";
import "react-datepicker/dist/react-datepicker.css";
import { PlantContext } from "../pages/PlantContext";

const path_api = import.meta.env.VITE_API_URL;

const MonthlyChart = ({ timePeriod, startDate, endDate }) => {
  const { plant } = useContext(PlantContext);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({ period: timePeriod });
        const formattedStartDate = startDate
          ? startDate.toISOString()
          : new Date("2024-01-01").toISOString();
        const formattedEndDate = endDate
          ? endDate.toISOString()
          : new Date().toISOString();

        const byPeriod = `${path_api}/byPeriod?${queryParams}&startDate=${formattedStartDate}&endDate=${formattedEndDate}&plant=${plant}`;
        const response = await fetch(byPeriod);
        const data = await response.json();
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

  return (
    <div className="w-[70%] h-full shadow-lg rounded-lg">
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
