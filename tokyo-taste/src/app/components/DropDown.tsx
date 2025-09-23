"use client";

import React from "react";

interface DropDownProps {
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function DropDown({ value, handleChange }: DropDownProps) {
  return (
    <select
      value={value}
      onChange={handleChange}
      className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="hitotsubashi">Hitotsubashi</option>
      <option value="waseda">Waseda</option>
      <option value="keio">Keio</option>
    </select>
  );
}

// Your types here
type Success<T> = {
  status: "success";
  data: T;
};
type Error<E> = {
  status: "failed";
  data: E;
}
// both of these Generics returns an object with status and dataType
type Result<T, E> = Success<T> | Error<E>;
//Result can be either successful or unsuccessful w/ error

// Helper functions
function success<T>(data: T): Success<T> {
  const output: Success<T> = {
    status: "success",
    data: data,
  };
  return output;
 }
//takes in a generic with data that is type generic returning an output that is type Success<T> so {status, datatType}
function error<E>(err: E): Error<E> { 
  const output: Error<E> = {
    status: "failed",
    data: err,
  };
  return output;
}
//takes in a generic with data that is type generic returning an output that is type Error<E> so {status, datatType} that FAILED

// Should work like:
const goodResult: Result<number, string> = success(42);
// good result is type Result which can either be a number (successful) or string (unsuccessful) so it will be as below:
// success<Result<number, string>>(data: 42): returns {status: "successful" data: 42}
const badResult: Result<number, string> = error("Something went wrong");
// error<Result<number, string>>(err: E which will be string input) returning Error<E> so {status:"failed, data: "Something went wrong"};
