import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, Box } from '@mui/material';
import errorimg from '../../assets/img/PNG_Hokii.png';
import successimg from '../../assets/img/PNG_Hokii_Sucess.png';

const ErrorPopup = ({ error, open, onClose }) => {
    if (!error) return null;

    return (
        <Dialog open={open} onClose={onClose}>
                <DialogTitle className='popTitle'>
                    {error.variant === 'success' ? '操作完成' : '系統回覆訊息'}
                </DialogTitle>
            <DialogContent>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 2
                    }}
                >
                    {/* 錯誤訊息文字 */}
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontSize: '1.8rem' }}>
                            訊息代碼: {error.code}
                        </Typography>
                        <Typography variant="body1" sx={{ fontSize: '1.2rem', marginTop: 2 }}>
                            訊息代碼說明： {error.message}
                        </Typography>
                    </Box>

                    <Box>
                        <img
                            src={error.image || (error.variant === 'success' ? successimg : errorimg)}
                            alt={error.variant === 'success' ? 'Success' : 'Hookie'}
                            style={{ width: '200px', height: '200px' }}
                        />
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
                <Button onClick={onClose} color={error.variant === 'success' ? 'success' : 'primary'} variant="contained" sx={{ fontSize: '1.2rem', width: '200px' }}>
                    關閉
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ErrorPopup;
