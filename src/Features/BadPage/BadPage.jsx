import { useState } from 'react';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
const generateSHA256 = async (input) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

const BadPage = () => {
  const [currentUser, setCurrentUser] = useState(null);

  const handleSetSession = async (empNo, empAuth) => {
    const today = new Date();
    const yyyyMMdd = today.toISOString().slice(0, 10).replace(/-/g, '');
    const hash = await generateSHA256(yyyyMMdd + empNo);

    sessionStorage.setItem('empNo', empNo);
    sessionStorage.setItem('X-API-KEY', hash);
    sessionStorage.setItem('empAuth', empAuth);

    setCurrentUser({ empNo, empAuth, apiKey: hash });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        🧪 變身!!!
      </Typography>

      <Box display="flex" flexDirection="column" gap={2} mt={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleSetSession('156277', 'M')}
        >
          模擬主管登入（empNo: 156277）
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleSetSession('170594', 'E')}
        >
          模擬經辦登入（empNo: 170594）
        </Button>
        <Button
          variant="contained"
          component={Link}
          to="/UploadPage"
          sx={{ bgcolor: '#ff8000', fontSize: '12px' }}
        >
          報表上傳
        </Button>
        <Button
          variant="contained"
          component={Link}
          to="/QueryPage"
          sx={{ fontSize: '12px' }}
        >
          報表查詢
        </Button>
        <Button
          variant="contained"
          component={Link}
          to="/ReviewPage"
          sx={{ bgcolor: '#FF359A', fontSize: '12px' }}
        >
          待審案件查詢
        </Button>
      </Box>

      {currentUser && (
        <Paper sx={{ mt: 4, p: 3, bgcolor: '#f3f3f3' }} elevation={3}>
          <Typography variant="h6" color="success.main" gutterBottom>
             ✅ 霹靂卡 霹靂拉拉 波波力那貝貝魯多 變身！
          </Typography>
          <Typography variant="body1">empNo：{currentUser.empNo}</Typography>
          <Typography variant="body1">empAuth：{currentUser.empAuth}</Typography>
          <Typography variant="body2" sx={{ mt: 1, wordBreak: 'break-all', fontFamily: 'monospace' }}>
            X-API-KEY：{currentUser.apiKey}
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default BadPage;
