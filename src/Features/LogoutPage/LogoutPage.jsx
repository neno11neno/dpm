import { Container, Typography, Box } from "@mui/material";
import byeimg from "../../assets/img/PNG_Hokii_Bye.png";
const LogoutPage = () => {
  return (
    <Container maxWidth="sm" sx={{ marginTop: "5rem", textAlign: "center" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          您已登出成功
        </Typography>
        <img
          src={byeimg}
          alt="Hookie"
          style={{ width: "200px", height: "200px" }} 
        />
         <Typography variant="body1">
          倘若需要登入，請從 Eportal 重新登入
        </Typography>
      </Box>
    </Container>
  );
};

export default LogoutPage;
