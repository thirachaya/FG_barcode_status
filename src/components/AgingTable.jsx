import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PlantContext } from "../pages/PlantContext";

const path_api = import.meta.env.VITE_API_URL;

function AgingTable() {
  const { plant } = useContext(PlantContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${path_api}/byAgingPeriod?plant=${plant}`
        );
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [plant]);

  const formatNumberWithCommas = (number) => {
    return number?.toLocaleString();
  };

  const handleRowClick = (column) => {
    const columnRoutes = {
      "0-15-days": 1,
      "16-30-days": 2,
      "31-60-days": 3,
      "61-90-days": 4,
      "91-180-days": 5,
      "181-360-days": 6,
      "360+days": 7,
      total: "total", 
    };

    const route = columnRoutes[column];
    if (route) {
      navigate(`/details/${route}`);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 shadow-md rounded-lg">
        <thead>
          <tr className="text-white bg-sky-800 border-b">
            <th className="px-6 py-3 border-r">0-15 Days</th>
            <th className="px-6 py-3 border-r">16-30 Days</th>
            <th className="px-6 py-3 border-r">31-60 Days</th>
            <th className="px-6 py-3 border-r">61-90 Days</th>
            <th className="px-6 py-3 border-r">91-180 Days</th>
            <th className="px-6 py-3 border-r">181-360 Days</th>
            <th className="px-6 py-3 border-r">More Than 360 Days</th>
            <th className="px-6 py-3">Total</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="8" className="text-center px-6 py-4">
                Loading...
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr className="border-b">
                <td
                  className="px-6 py-4 border-r hover:bg-sky-900 cursor-pointer"
                  onClick={() => handleRowClick("0-15-days")}
                >
                  {formatNumberWithCommas(parseInt(row.aging_0_15_days))}
                </td>
                <td
                  className="px-6 py-4 border-r hover:bg-sky-900 cursor-pointer"
                  onClick={() => handleRowClick("16-30-days")}
                >
                  {formatNumberWithCommas(parseInt(row.aging_16_30_days))}
                </td>
                <td
                  className="px-6 py-4 border-r hover:bg-sky-900 cursor-pointer"
                  onClick={() => handleRowClick("31-60-days")}
                >
                  {formatNumberWithCommas(parseInt(row.aging_31_60_days))}
                </td>
                <td
                  className="px-6 py-4 border-r hover:bg-sky-900 cursor-pointer"
                  onClick={() => handleRowClick( "61-90-days")}
                >
                  {formatNumberWithCommas(parseInt(row.aging_61_90_days))}
                </td>
                <td
                  className="px-6 py-4 border-r hover:bg-sky-900 cursor-pointer"
                  onClick={() => handleRowClick("91-180-days")}
                >
                  {formatNumberWithCommas(parseInt(row.aging_91_180_days))}
                </td>
                <td
                  className="px-6 py-4 border-r hover:bg-sky-900 cursor-pointer"
                  onClick={() => handleRowClick("181-360-days")}
                >
                  {formatNumberWithCommas(parseInt(row.aging_181_360_days))}
                </td>
                <td
                  className="px-6 py-4 border-r hover:bg-sky-900 cursor-pointer"
                  onClick={() => handleRowClick("360+days")}
                >
                  {formatNumberWithCommas(parseInt(row.aging_360_plus_days))}
                </td>
                <td
                  className="px-6 py-4 hover:bg-sky-900 cursor-pointer"
                  onClick={() => handleRowClick("total")}
                >
                  {formatNumberWithCommas(parseInt(row.Total))}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AgingTable;
