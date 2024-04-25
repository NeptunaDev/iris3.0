"use client";
import React from "react";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { decrement, increment } from "@/lib/features/counter/counterSlice";

export default function Count() {
  const { value } = useAppSelector((state) => state.counter);
  const distpatch = useAppDispatch();

  return (
    <div>
      <h1>Count</h1>
      {value}
      <button
        onClick={() => {
          distpatch(increment());
        }}
      >
        Add
      </button>
      <button onClick={() => {
          distpatch(decrement());
        }}>Substract</button>
    </div>
  );
}
