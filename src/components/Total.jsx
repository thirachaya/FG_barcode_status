import React, { useState, useEffect, useContext } from "react";
import { PlantContext } from "../pages/PlantContext";

const path_api = import.meta.env.VITE_API_URL;

function Total() {
  const { plant } = useContext(PlantContext); 
  const [total, setTotal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTotal = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${path_api}/byAgingPeriod?plant=${plant}`); 
        const data = await response.json();
        setTotal(data[0]?.Total);
      } catch (error) {
        console.error("Error fetching total:", error);
        setTotal(null); 
      }finally {
        setIsLoading(false); 
      }
    };

    fetchTotal();
  }, [plant]);
  console.log("total plant",plant);

  const formatNumberWithCommas = (number) => {
    return number?.toLocaleString(); 
  };

  return (
    <div>
      <h2 className="text-3xl font-semibold">Total GR</h2>
      {isLoading ? (
        <div className="text-xl font-normal">Loading...</div> 
      ) : (
        <h4 className="text-xl font-normal">
          {total !== null ? formatNumberWithCommas(total) : "No Data Available"}
        </h4>
      )}
    </div>
  );
}

export default Total;
