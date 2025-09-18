import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";

// Page & Components
import UploadPage from "./Features/UploadPage/UploadPage";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import QueryPage from "./Features/QueryPage/QueryPage";
import ResultsPage from "./Features/ResultsPage/ResultsPage";
import NotFoundPage from "./Features/NotFoundPage/NotFoundPage";
import WelcomePage from "./Features/WelcomePage/WelcomePage";
import LogoutPage from "./Features/LogoutPage/LogoutPage";
import ReviewPage from "./Features/ReviewPage/ReviewPage";
import HomePage from "./Features/HomePage/HomePage";
import BadPage from "./Features/BadPage/BadPage";
import UploadTestPage from "./Features/UploadTestPage/UploadTestPage";

// Context
import { LoadingProvider } from "./context/LoadingContext";
import { ErrorProvider } from "./context/ErrorContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

const AppRoutes = () => {
  const { empAuth } = useAuth();

  return (
    <>
      <Header />
      <main className="mainContent">
        <div className="mainBlock">
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/HomePage" element={<HomePage />} />
            <Route path="/QueryPage" element={<QueryPage />} />
            <Route path="/UploadPage" element={<UploadPage />} />
            <Route path="/UploadTestPage" element={<UploadTestPage />} />
            <Route path="/ResultsPage" element={<ResultsPage />} />
            <Route path="/LogoutPage" element={<LogoutPage />} />
            <Route path="/BadPage" element={<BadPage />} />
            <Route
              path="/ReviewPage"
              element={
                empAuth === "M" || empAuth === "D" ? (
                  <ReviewPage />
                ) : (
                  <NotFoundPage />
                )
              }
            />
            <Route path="/*" element={<NotFoundPage />} />
          </Routes>
          <div style={{ height: "20px" }} />
        </div>
      </main>

      <Footer />
    </>
  );
};

function App() {
  console.log(
    "%c🐧不要做壞壞的事情喔！ (๑•́ ₃ •̀๑)",
    "color: black; background: lightblue; font-size: 24px; padding: 8px; border-radius: 6px;"
  );
  console.log(
    "%c🐧真的不行喔！(╬☉д⊙)",
    "color: white; background: red; font-size: 24px; padding: 8px; border-radius: 6px;"
  );
  console.log(
    "%c🐧做了請我喝飲料喔ε٩(๑> ₃ <)۶з",
    "color: black; background: pink; font-size: 24px; padding: 8px; border-radius: 6px;"
  );

  return (
    <div className="appContainer">
      <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
        <ErrorProvider>
          <LoadingProvider>
            <Router>
              <AuthProvider>
                <AppRoutes />
              </AuthProvider>
            </Router>
          </LoadingProvider>
        </ErrorProvider>
      </SnackbarProvider>
    </div>
  );
}

export default App;
