import React from "react";
import StoreProvider from "../StoreProvider";
import Count from "./Count";

export default function page() {
  return (
    <>
      <div>
        <h1>hola</h1>
      </div>
      <StoreProvider>
        <Count />
      </StoreProvider>
    </>
  );
}
