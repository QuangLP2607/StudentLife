import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DefaultLayout } from "@components/Layout";
import { publicRoutes } from "./routes";
import { UserProvider } from "./contexts/UserContext";
import { SemesterProvider } from "./contexts/SemesterContext";

function App() {
  return (
    <UserProvider>
      <SemesterProvider>
        <Router>
          <Routes>
            {publicRoutes.map((route, index) => {
              const Page = route.component;
              let Layout = DefaultLayout;

              if (route.layout === null) {
                Layout = ({ children }) => <>{children}</>;
              } else if (route.layout) {
                Layout = route.layout;
              }

              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}
          </Routes>
        </Router>
      </SemesterProvider>
    </UserProvider>
  );
}

export default App;
