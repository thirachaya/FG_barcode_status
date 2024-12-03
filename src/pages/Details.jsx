import React from "react";
import "../css/Details.css"
import { BrowserRouter as Router, Routes, Route, useParams, Link } from "react-router-dom";
import DetailsTable from "../components/DetailsTable";

function Details() {
  const { id } = useParams(); 

  return (
    <div className="base-details">
      <DetailsTable id={id} /> 
      <div className="flex justify-start ml-10">
        <Link
          to="/"
          className="mt-5 mb-12 inline-block px-6 py-2 border-2 rounded-md text-white hover:bg-sky-700"
        >
          Back
        </Link>
      </div>
    </div>
  );
}

export default Details;
