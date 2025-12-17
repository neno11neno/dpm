import { useEffect, useState } from "react";
import { Typography, Container, Paper } from "@mui/material";
import helloimg from "../../assets/img/PNG_Hokii_Hello.png";
import { useAuth } from "../../context/AuthContext"; 

const HomePage = () => {
  const { authData } = useAuth();
  const [employeeData, setEmployeeData] = useState(null);

  useEffect(() => {
    if (authData?.empNo && authData?.empName) {
      setEmployeeData({
        empNo: authData.empNo,
        empName: authData.empName,
      });
    } else {
      setEmployeeData(null);
    }
  }, [authData]);

  return (
    <Container maxWidth="sm" style={{ paddingTop: "50px" }}>
      <Paper elevation={3} style={{ padding: "20px", textAlign: "center" }}>
        {employeeData ? (
          <>
            <img
              src={helloimg}
              alt="Hokii"
              style={{ width: "200px", height: "200px" }}
            />
            <Typography variant="h4" color="primary" gutterBottom>
              歡迎回來，{employeeData.empName}！
            </Typography>
            <Typography variant="h6" color="textSecondary">
              員工編號: {employeeData.empNo}
            </Typography>
          </>
        ) : (
          <Typography variant="body1" color="error">
            找不到員工資訊，請重新登入。
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default HomePage;
