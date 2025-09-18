import { useEffect, useState } from 'react';
import {
  Typography,
  Container,
  Paper
} from '@mui/material';

const HomePage = () => {
  const [employeeData, setEmployeeData] = useState(null);

  useEffect(() => {
    const empNo = sessionStorage.getItem('empNo');
    const empName = sessionStorage.getItem('empName');

    if (empNo && empName) {
      setEmployeeData({ empNo, empName });
    }
  }, []);

  return (
    <Container maxWidth="sm" style={{ paddingTop: '50px' }}>
      <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
        {employeeData ? (
          <>
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
