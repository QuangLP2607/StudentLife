// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "normalize.css";
// import GlobalStyles from "@components/GlobalStyles";
// import App from "./App.jsx";

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <GlobalStyles>
//       <App />
//     </GlobalStyles>
//   </StrictMode>
// );

import { createRoot } from "react-dom/client";
import "normalize.css";
import GlobalStyles from "@components/GlobalStyles";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <GlobalStyles>
    <App />
  </GlobalStyles>
);
