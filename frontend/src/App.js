import "./App.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { HelmetProvider } from "react-helmet-async";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import useUserRoutes from "./components/routes/userRoutes";
import useAdminRoutes from "./components/routes/adminRoutes";
import NotFound from "./components/layout/NotFound";

function App() {

  const userRoutes = useUserRoutes()
  const adminRoutes = useAdminRoutes()
  return (
    <HelmetProvider>
      <Router>
        <div className="App">
          {/* <Toaster position="top-center" /> */}
          <Header />
          <div className="container">
            <Routes>
              {userRoutes}
              {adminRoutes}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
