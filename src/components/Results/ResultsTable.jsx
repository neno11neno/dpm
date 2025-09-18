import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Button, Typography } from '@mui/material';

const ResultsTable = ({ reportData, selectedSerialNo, handleCheckboxChange, handleRowClick }) => (
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
);

export default ResultsTable;
