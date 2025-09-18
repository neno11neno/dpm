import { useState } from 'react';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Box, Checkbox,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useApi } from '../../api';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { reportData = [], startDate, endDate } = location.state || {};
  const { enqueueSnackbar } = useSnackbar();
  const { apiDownload } = useApi();

  const [selectedSerialNo, setSelectedSerialNo] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const handleBack = () => navigate(-1);

  if (!reportData || reportData.length === 0) {
    return <Navigate to="/QueryPage" replace />;
  }

  const handleCheckboxChange = (serialNo) => {
    setSelectedSerialNo((prev) => (prev === serialNo ? null : serialNo));
  };

  const handleDownloadExcel = async () => {
    if (!selectedSerialNo) {
      enqueueSnackbar('請選擇一筆要下載的資料', { variant: 'error' });
      return;
    }

    const result = await apiDownload('/dwnRpt', { serialNo: selectedSerialNo }, '報表查詢結果');

    if (result.respCode !== '0000') {
      enqueueSnackbar('❌ 無法下載，請稍後再試', { variant: 'error' });
    }
  };

  const handleRowClick = (row) => {
    setSelectedRow(row);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        報表查詢
      </Typography>
      <Typography variant="h6" align="center" gutterBottom>
        查詢區間：{startDate} ~ {endDate}
      </Typography>

      <Typography variant="caption" color="textSecondary" sx={{ mt: 1, mb: 1 }}>
        👉 表格欄位較多，已縮減顯示，點選「查看詳細」可瀏覽完整內容
      </Typography>

      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>案件編號</TableCell>
              <TableCell>經辦人員</TableCell>
              <TableCell>報表代號</TableCell>
              <TableCell>上傳狀態</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body1" sx={{ py: 3 }}>
                    查無資料顯示
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              reportData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Checkbox
                      checked={selectedSerialNo === row.serialNo}
                      onChange={() => handleCheckboxChange(row.serialNo)}
                    />
                  </TableCell>
                  <TableCell>{row.serialNo}</TableCell>
                  <TableCell>{row.rptMaker}</TableCell>
                  <TableCell>{row.rptCode}</TableCell>
                  <TableCell>{row.uploadStatus}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => handleRowClick(row)}>
                      查看詳細
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
        <Button variant="contained" onClick={handleBack} sx={{ backgroundColor: '#6c757d' }}>
          回上一頁
        </Button>
        <Button variant="contained" onClick={handleDownloadExcel} color="primary">
          下載檔案(選單筆)
        </Button>
      </Box>

      {/* 詳細資料 Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
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
          <Button onClick={handleCloseDialog}>關閉</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ResultsPage;
