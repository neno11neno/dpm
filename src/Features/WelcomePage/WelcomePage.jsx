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

  const generateSHA256 = async (input) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  useEffect(() => {
    const fetchEmployeeData = async (authCode) => {
      try {
        const payload = encodeURIComponent(authCode);
        const url = `${API_BASE_URL}/ssoAuth?authCode=${payload}`;
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

          setAuthData(empNo, empAuth, empName, hashValue);

          setTimeout(() => {
            navigate("/HomePage");
          }, 1000);
        } else if (data?.respCode === "0003") {
          setErrorMessage("您無此權限。");
        } else {
          setErrorMessage("無法取得員工資料，請從 Eportal 重新嘗試。");
        }
      } catch (error) {
        setErrorMessage("系統異常，請稍後再試。");
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
      setErrorMessage("缺少 authCode，請從 Eportal 重新進入。");
    }
  }, [location.search, navigate]);

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
