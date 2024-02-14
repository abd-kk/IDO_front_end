import { Route, Routes } from "react-router-dom";

import { LoginPage } from "./Pages/Login/LoginPage";
import { HomePage } from "./Pages/Home/HomePage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/Home" element={<HomePage />} />
      </Routes>
    </>
  );
}

export default App;
