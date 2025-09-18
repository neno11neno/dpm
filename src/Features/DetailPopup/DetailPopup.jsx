import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, Box } from '@mui/material';

const DetailPopup = ({ open, onClose, report }) => {
  if (!report) return null;

  const formatDate = (date) => {
    if (!date) return '無資料';
    return new Date(date).toLocaleString();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>報表詳細資料</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2, // 元素間距
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ width: '100%' }}>
            案件編號: {report.serialNo || 'N/A'}
          </Typography>
          <Typography variant="body1" sx={{ width: 'calc(50% - 8px)' }}>
            經辦人員: {report.rptMakerNo || 'N/A'}
          </Typography>
          <Typography variant="body1" sx={{ width: 'calc(50% - 8px)' }}>
            報表代號: {report.rptCode || 'N/A'}
          </Typography>
          <Typography variant="body1" sx={{ width: 'calc(50% - 8px)' }}>
            報表名稱: {report.rptName || 'N/A'}
          </Typography>
          <Typography variant="body1" sx={{ width: 'calc(50% - 8px)' }}>
            報表週期: {report.rptFreq || 'N/A'}
          </Typography>
          <Typography variant="body1" sx={{ width: 'calc(50% - 8px)' }}>
            報表版號: {report.rptVer || 'N/A'}
          </Typography>
          <Typography variant="body1" sx={{ width: 'calc(50% - 8px)' }}>
            上傳狀態: {report.uploadStatus || 'N/A'}
          </Typography>
          <Typography variant="body1" sx={{ width: 'calc(50% - 8px)' }}>
            上傳時間: {formatDate(report.uploadTime)}
          </Typography>
          <Typography variant="body1" sx={{ width: 'calc(50% - 8px)' }}>
            審核狀態: {report.reviewStatus === 'P' ? '待審核' : report.reviewStatus === 'A' ? '通過' : '退回'}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button onClick={onClose} color="primary" variant="contained">
          關閉
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailPopup;
