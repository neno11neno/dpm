import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from '@mui/material';

const ResultsDetailDialog = ({ open, onClose, selectedRow }) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle>報表詳細資訊</DialogTitle>
    <DialogContent dividers>
      {selectedRow && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography>案件編號: {selectedRow.serialNo}</Typography>
          <Typography>經辦人員:{selectedRow.rptMaker}</Typography>
          <Typography>報表代號：{selectedRow.rptCode}</Typography>
          <Typography>上傳狀態：{selectedRow.uploadStatus}</Typography>
          <Typography>報表版號: {selectedRow.rptVer}</Typography>
          <Typography>上傳時間：{selectedRow.uploadTime}</Typography>
          <Typography>審核人員：{selectedRow.rptChecker}</Typography>
          <Typography>審核狀態：{selectedRow.reviewStatus}</Typography>
          <Typography>審核時間：{selectedRow.reviewTime}</Typography>
          <Typography>申報狀態：{selectedRow.declareStatus}</Typography>
          <Typography>申報時間：{selectedRow.declareTime}</Typography>
          <Typography>驗證狀態：{selectedRow.validStatusName}</Typography>
          <Typography>驗證訊息：{selectedRow.validMsg}</Typography>
        </Box>
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>關閉</Button>
    </DialogActions>
  </Dialog>
);

export default ResultsDetailDialog;
