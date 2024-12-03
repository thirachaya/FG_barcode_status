import React, { useState, useEffect, useContext } from "react";
import { PlantContext } from "../pages/PlantContext";

const path_api = import.meta.env.VITE_API_URL;

function TotalMaxAgingandNotGI() {
  const { plant } = useContext(PlantContext); 
  const [maxAging, setMaxAging] = useState(null);
  const [notGI, setNotGI] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fetchMaxAging = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${path_api}/total?plant=${plant}`);
      const data = await response.json();
      setMaxAging(data[0]?.max_aging_days);
      setNotGI(data[0]?.not_gi_count);
      console.log(data[0]?.max_aging_days);
    } catch (error) {
      console.error("Error fetching max aging:", error);
      setMaxAging(null);
      setNotGI(null);
    } finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    fetchMaxAging();
  }, [plant]);


  const formatNumberWithCommas = (number) => {
    return number?.toLocaleString(); 
  };


  return (
    <div className="flex justify-between w-full">
      <div>
        <h4 className="text-xl font-normal">Max Aging Days</h4>
        <p>
          {isLoading 
            ? "Loading..." 
            : maxAging !== null 
              ? formatNumberWithCommas(maxAging) 
              : "No Data Available"}
        </p>
      </div>
      <div>
        <h4 className="text-xl font-normal">Not GI count</h4>
        <p>
          {isLoading
            ? "Loading..." 
            : notGI !== null 
              ? formatNumberWithCommas(notGI) 
              : "No Data Available"}
        </p>
      </div>
    </div>
  );
}

export default TotalMaxAgingandNotGI;
