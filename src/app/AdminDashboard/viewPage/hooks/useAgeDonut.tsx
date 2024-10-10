import {Column} from "@/app/AdminDashboard/viewPage/interface/column.interface";
import {useEffect, useState} from "react";


export function useAgeDonut(columns: Column[]) {
  const [canUse, setCanUse] = useState(false);

  useEffect(() => {
    if (!columns || columns.length <= 0) return;

    columns.forEach((column) => {
      if (column.headerName.toUpperCase() === "EDAD") {
        setCanUse(true);
      }
    })
  }, [ columns ]);

  return { canUse };
}