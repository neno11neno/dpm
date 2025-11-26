import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Checkbox,
  Box,
} from "@mui/material";
import { useApi } from "../../api";
import successImg from '../../assets/img/logo.svg';
import DetailPopup from "../DetailPopup/DetailPopup";
import { useLoading } from "../../context/LoadingContext";
import { useSnackbar } from "notistack";

const ReviewPage = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSerialNos, setSelectedSerialNos] = useState(null);
  const [respMsg, setRespMsg] = useState("");
  const { apiPost, apiDownload } = useApi();
  const { setLoading } = useLoading();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const result = await apiPost(
      "/reviewRpt",
      { timestamp: Date.now() },
      setLoading
    );
    // 防呆處理
    const data = Array.isArray(result.respData) ? result.respData : [];
    setReports(data);
    setRespMsg(result.respMsg || "");
    if (!Array.isArray(result.respData)) {
      console.warn("⚠️ API 回傳不是陣列，respData:", result.respData);
    }
  };

  const handleReview = async (serialNo, action) => {
    const result = await apiPost(
      `/declare`,
      { serialNo, reviewStatus: action },
      setLoading
    );
    if (result.respCode === "0000") {
      enqueueSnackbar(result.respMsg || "審核成功", { variant: "info" });
      setReports((prevReports) =>
        prevReports.map((report) =>
          report.serialNo === serialNo
            ? { ...report, reviewStatus: action }
            : report
        )
      );
      fetchReports();
    } else {
      enqueueSnackbar(result.respMsg || "審核失敗", { variant: "error" });
      setTimeout(() => {
        fetchReports();
      }, 2500);
    }
  };

  const handleReportClick = (report) => {
    setSelectedReport(report);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCheckboxChange = (serialNo) => {
    setSelectedSerialNos((prev) => (prev === serialNo ? null : serialNo));
  };

  const handleDownload = async () => {
    if (selectedSerialNos.length === 0) {
      enqueueSnackbar("請至少選擇一筆資料進行下載", { variant: "warning" });
      return;
    }
    const result = await apiDownload(
      "/dwnRpt",
      { serialNo: selectedSerialNos },
      "主管審核報表",
      true,
      '檔案下載完成',
      successImg
    );
    if (result.respCode !== "0000") {
      enqueueSnackbar("❌ 無法下載，請稍後再試", { variant: "error" });
    }
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 3 }}>
        主管審核報表
      </Typography>

      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>案件編號</TableCell>
              <TableCell>經辦人員</TableCell>
              <TableCell>報表代號</TableCell>
              <TableCell>報表名稱</TableCell>
              <TableCell align="center">審核狀態</TableCell>
              <TableCell align="center">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1" sx={{ py: 3 }}>
                    <p style={{ fontSize: "1.3rem" }}>
                      {respMsg || "查無資料"}
                    </p>
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => (
                <TableRow key={report.serialNo}>
                  <TableCell>
                    <Checkbox
                      checked={selectedSerialNos === report.serialNo}
                      onChange={() => handleCheckboxChange(report.serialNo)}
                    />
                  </TableCell>
                  <TableCell
                    sx={{ color: "primary.main", cursor: "pointer" }}
                    onClick={() => handleReportClick(report)}
                  >
                    {report.serialNo}
                  </TableCell>
                  <TableCell>{report.rptMakerNo}</TableCell>
                  <TableCell>{report.rptCode}</TableCell>
                  <TableCell>{report.rptName}</TableCell>
                  <TableCell align="center">
                    {report.reviewStatus === "P" && (
                      <Chip label="待審核" color="warning" />
                    )}
                    {report.reviewStatus === "Y" && (
                      <Chip label="通過" color="success" />
                    )}
                    {report.reviewStatus === "N" && (
                      <Chip label="退回" color="error" />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {report.reviewStatus === "P" ? (
                      <div className="button-group">
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => handleReview(report.serialNo, "Y")}
                          sx={{ mr: 1 }}
                        >
                          通過
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleReview(report.serialNo, "N")}
                        >
                          退回
                        </Button>
                      </div>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        已審核
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleDownload}>
          下載選取報表
        </Button>
      </Box>

      <DetailPopup
        open={openDialog}
        onClose={handleCloseDialog}
        report={selectedReport ?? {}}
      />
    </Container>
  );
};

export default ReviewPage;
