import React, { createContext, useState } from "react";

export const PlantContext = createContext();

export const PlantProvider = ({ children }) => {
  const [plant, setPlant] = useState("9774");

  return (
    <PlantContext.Provider value={{ plant, setPlant }}>
      {children}
    </PlantContext.Provider>
  );
};
