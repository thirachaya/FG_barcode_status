import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { PlantContext } from "../pages/PlantContext";
import { useParams, useLocation } from "react-router-dom";
import ExcelIcon from "../assets/excel.png";

const path_api = import.meta.env.VITE_API_URL;

function DetailsTable() {
  const { id } = useParams();
  const { plant } = useContext(PlantContext);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialSearchType = queryParams.get("searchType") || "product_code";
  const initialSearchQuery = queryParams.get("query") || "";

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchType, setSearchType] = useState(initialSearchType);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const apiUrl = id
          ? `${path_api}/Aging/${id}`
          : `${path_api}/detail?year=2024&month=8&plant=${plant}`;
        const response = await axios.get(apiUrl);
        setData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [plant, id]);

  useEffect(() => {
    if (searchType && searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = data.filter((row) =>
        row[searchType]?.toString().toLowerCase().includes(lowerQuery)
      );
      setFilteredData(filtered);
      setCurrentPage(1);
    } else {
      setFilteredData(data); 
    }
  }, [searchType, searchQuery, data]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const renderPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          onClick={() => setCurrentPage(index + 1)}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === index + 1 ? "bg-sky-800 text-white" : "bg-gray-400"
          }`}
        >
          {index + 1}
        </button>
      ));
    }

    return (
      <>
        <button
          onClick={() => setCurrentPage(1)}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === 1 ? "bg-sky-800 text-white" : "bg-gray-400"
          }`}
        >
          1
        </button>
        {currentPage > 3 && <span className="px-2">...</span>}
        {Array.from({ length: 3 }, (_, index) => {
          const page = currentPage - 1 + index;
          if (page > 1 && page < totalPages)
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 mx-1 rounded ${
                  currentPage === page ? "bg-sky-800 text-white" : "bg-gray-400"
                }`}
              >
                {page}
              </button>
            );
          return null;
        })}
        {currentPage < totalPages - 2 && <span className="px-2">...</span>}
        <button
          onClick={() => setCurrentPage(totalPages)}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === totalPages ? "bg-sky-800 text-white" : "bg-gray-400"
          }`}
        >
          {totalPages}
        </button>
      </>
    );
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Details");
    XLSX.writeFile(workbook, "Data.xlsx");
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <div className="flex justify-between">
          <div className="flex items-center mb-4">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="px-2 py-2 border rounded-l"
            >
              <option value="product_code">Product Code</option>
              <option value="prod_order">Product Order</option>
            </select>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search by ${
                searchType === "product_code" ? "Product Code" : "Product Order"
              }`}
              className="px-3 py-2 w-64 border-t border-b border-r rounded-r border-gray-300"
            />
          </div>
          <button
            onClick={exportToExcel}
            className="flex mb-4 inline-block px-6 py-2 border-2 border-emerald-900 rounded-md text-white bg-emerald-800 hover:bg-green-600 gap-2"
          >
            <div>Export to Excel</div>
            <img src={ExcelIcon} alt="" width={"24px"} />
          </button>
        </div>
        <table className="min-w-full text-sm border border-gray-200 shadow-md rounded-lg">
          <thead>
            <tr className="text-white bg-sky-800">
              <th className="px-2 py-3">#</th>
              <th className="px-2 py-3">Plant</th>
              <th className="px-2 py-3">Product Code</th>
              <th className="px-2 py-3">Product Description</th>
              <th className="px-2 py-3">Location Code</th>
              <th className="px-2 py-3">Barcode</th>
              <th className="px-2 py-3">Freezing Tag</th>
              <th className="px-2 py-3">Line Code</th>
              <th className="px-2 py-3">Product Order</th>
              <th className="px-2 py-3">GR Date</th>
              <th className="px-2 py-3">Storage Aging</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="11" className="text-center py-4">
                  <span>Loading...</span>
                </td>
              </tr>
            ) : (
              currentRows.map((row, index) => (
                <tr key={index} className="hover:bg-gray-700">
                  <td className="px-2 py-2 border-r">
                    {(currentPage - 1) * rowsPerPage + index + 1}
                  </td>
                  <td className="px-2 py-2 border-r">{row.plant}</td>
                  <td className="px-2 py-2 border-r">{row.product_code}</td>
                  <td className="px-2 py-2 border-r">{row.product_desc}</td>
                  <td className="px-2 py-2 border-r">{row.loc_code}</td>
                  <td className="px-2 py-2 border-r">{row.barcode}</td>
                  <td className="px-2 py-2 border-r">{row.freezetag}</td>
                  <td className="px-2 py-2 border-r">{row.line_code}</td>
                  <td className="px-2 py-2 border-r">{row.prod_order}</td>
                  <td className="px-2 py-2 border-r">
                    {new Date(row.gr_date).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">{row.storage_aging}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="flex justify-center mt-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 mx-1 rounded bg-gray-600 disabled:opacity-50"
          >
            &lt;
          </button>
          {renderPageNumbers()}
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 mx-1 rounded bg-gray-600 disabled:opacity-50"
          >
            &gt;
          </button>
          <div className="flex justify-end items-center mb-4">
            <label htmlFor="rowsPerPage" className="mr-2 text-gray-200">
              Rows per page:
            </label>
            <select
              id="rowsPerPage"
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="px-2 py-1 border rounded"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailsTable;
