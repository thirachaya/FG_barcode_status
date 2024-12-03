import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { PlantContext } from "../pages/PlantContext";
import { useParams } from "react-router-dom";

const path_api = import.meta.env.VITE_API_URL;

function DetailsTable() {
  const { id } = useParams();
  const { plant } = useContext(PlantContext);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const apiUrl = id
          ? `${path_api}/api/barcode/Aging/${id}` 
          : `${path_api}/api/barcode/detail?year=2024&month=8&plant=${plant}`; 
        const response = await axios.get(apiUrl);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [plant, id]);

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

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
            currentPage === index + 1 ? "bg-sky-800 text-white" : "bg-gray-200"
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

  return (
    <div>
      <div className="overflow-x-auto">
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
