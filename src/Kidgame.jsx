import React from "react";
import { useEffect } from "react";
import { useState } from "react";

const Kidgame = () => {
  const [tabs, setTabs] = useState([]);
  const allTabs = [];
  for (let i = 100; i >= 1; i--) {
    allTabs.push(i);
  }
 

  return (

      <div className=" grid grid-cols-10 gap-1">
      {allTabs.map((t,i)=>(
        <div className="flex bg-black/60 text-white p-0.5 rounded-md font-semibold text-sm w-12 h-12 hover:bg-black/70" key={i}>{t}</div>
      ))}
      </div>
 
  );
};

export default Kidgame;
