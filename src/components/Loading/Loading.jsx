import React from 'react';
import { Box, Typography } from '@mui/material';
import loadingImg from '../../assets/img/tbb-loading.gif';
import { useLoading } from '../../context/LoadingContext';

const Loading = () => {
  const { loading } = useLoading();

  if (!loading) return null; // 如果 loading 為 false，則不顯示

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(72, 72, 72, 0.55)',
        zIndex: 9999,
      }}
    >
      <Box>
        <img src={loadingImg} alt="Loading" style={{ width: 164, height: 53 }} />
        <Typography variant="h6" align="center" sx={{ fontSize: 5, color: 'white' }}>
          載入中...
        </Typography>
      </Box>
    </Box>
  );
};

export default Loading;
