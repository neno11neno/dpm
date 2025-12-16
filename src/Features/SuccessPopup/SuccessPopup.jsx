import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, Box } from '@mui/material';
import successDefault from '../../assets/img/PNG_Hokii_Sucess.png';

const SuccessPopup = ({ success, open, onClose }) => {
    if (!success) return null;

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle className='popTitle'>
                操作成功
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
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" sx={{ fontSize: '1.2rem', marginTop: 2 }}>
                            {success.message}
                        </Typography>
                    </Box>

                    <Box>
                        <img
                            src={success.image || successDefault}
                            alt="Success"
                            style={{ width: '180px', height: '180px' }}
                        />
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
                <Button onClick={onClose} color="success" variant="contained" sx={{ fontSize: '1.1rem', width: '180px' }}>
                    確認
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SuccessPopup;
