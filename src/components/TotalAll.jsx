import React from "react";
import Total from "./Total";
import TotalMaxAgingandNotGI from "./TotalMaxAgingandNotGI";

function TotalAll() {
  return (
    <div className="w-full m-4 h-[70%] flex flex-col justify-center">
      <Total/>
      <div className="flex w-full justify-center mt-2">
        <TotalMaxAgingandNotGI/>
      </div>
    </div>
  );
}

export default TotalAll;
