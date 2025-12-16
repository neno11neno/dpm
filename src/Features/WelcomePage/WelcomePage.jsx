import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Typography,
  CircularProgress,
  Container,
  Box,
  Paper,
} from "@mui/material";
import { API_BASE_URL } from "../../../config";
import { useAuth } from "../../context/AuthContext";

const WelcomePage = () => {
  const [loading, setLoading] = useState(true);
  const [employeeData, setEmployeeData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { setAuthData } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const empNo = sessionStorage.getItem("empNo");
    const empAuth = sessionStorage.getItem("empAuth");
    const empName = sessionStorage.getItem("empName");

    if (empNo && empAuth) {
      setEmployeeData({ empNo, empAuth, empName: empName || "" });
      setLoading(false);

      setTimeout(() => {
        navigate("/HomePage");
      }, 1000);
      return;
    }

    const fetchEmployeeData = async (authCode) => {
      try {
        const authCodeUrl = encodeURIComponent(authCode);
        const url = `${API_BASE_URL}/ssoAuth?authCode=${authCodeUrl}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data?.respCode === "0000" && data.respData) {
          const { empNo, empName, empAuth } = data.respData;
          setEmployeeData({ empNo, empName, empAuth });

          const today = new Date();
          const formattedDate = today
            .toISOString()
            .slice(0, 10)
            .replace(/-/g, "");
          const hashValue = await generateSHA256(formattedDate + empNo);

          sessionStorage.setItem("empNo", empNo);
          sessionStorage.setItem("empName", empName);
          sessionStorage.setItem("X-API-KEY", hashValue);
          sessionStorage.setItem("empAuth", empAuth);
          setAuthData(empNo, empAuth);

          setTimeout(() => {
            navigate("/HomePage");
          }, 1000);
        } else if (data?.respCode === "0003") {
          setErrorMessage("您無此權限。");
        } else {
          setErrorMessage("無法取得員工資料，請從 Eportal 重新嘗試。");
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    const params = new URLSearchParams(location.search);
    const authCode = params.get("authCode");

    if (authCode) {
      fetchEmployeeData(authCode);
    } else {
      setLoading(false);
    }
  }, [location.search, navigate]);

  const generateSHA256 = async (input) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  return (
    <Container maxWidth="sm" style={{ paddingTop: "50px" }}>
      <Paper elevation={3} style={{ padding: "20px", textAlign: "center" }}>
        {loading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : (
          <div>
            {employeeData ? (
              <>
                <Typography variant="h4" color="primary" gutterBottom>
                  歡迎，{employeeData.empName}！
                </Typography>
                <Typography variant="h6" color="textSecondary">
                  員工編號: {employeeData.empNo}
                </Typography>
              </>
            ) : (
              <Typography variant="body1" color="error">
                {errorMessage || "無法取得員工資料，請從 Eportal 重新嘗試。"}
              </Typography>
            )}
          </div>
        )}
      </Paper>
    </Container>
  );
};

export default WelcomePage;
