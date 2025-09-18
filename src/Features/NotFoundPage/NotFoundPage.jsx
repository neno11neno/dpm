import { Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';


const NotFoundPage = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate('/');
    };

    return (
        <Container maxWidth="sm" sx={{ textAlign: 'center', marginTop: 8}}>
            <Typography variant="h3" gutterBottom>
                404 - 找不到頁面
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
                抱歉，您訪問的頁面不存在。
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={handleGoBack}
                sx={{ marginTop: 2 }}
            >
                回到首頁
            </Button>
        </Container>
    );
};

export default NotFoundPage;
