import { Container, Typography, Box } from '@mui/material';

const LogoutPage = () => {
  return (
    <Container maxWidth="sm" sx={{ marginTop: '5rem', textAlign: 'center' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          您已登出成功
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: '20px' }}>
          倘若需要登入，請從 Eportal 重新登入
        </Typography>
      </Box>
    </Container>
  );
};

export default LogoutPage;
