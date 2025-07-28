import React from "react";
import Router from "./routes";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <>
      <Toaster />
      <Router />
    </>
  );
};

export default App;
