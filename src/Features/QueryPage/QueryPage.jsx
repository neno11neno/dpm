import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../api";
import { useLoading } from "../../context/LoadingContext";
import { useSnackbar } from "notistack";

const QueryPage = () => {
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const { apiPost } = useApi();
  const { enqueueSnackbar } = useSnackbar();

  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  const formatDate = (date) => date.toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(formatDate(oneYearAgo));
  const [endDate, setEndDate] = useState(formatDate(today));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDisplayDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  };

  const setQuickRange = (days) => {
    const end = new Date();
    const start = new Date();

    if (days === "today") {
    } else if (days === 365) {
      start.setFullYear(end.getFullYear() - 1);
    } else {
      start.setDate(end.getDate() - (days - 1));
    }

    setStartDate(formatDate(start));
    setEndDate(formatDate(end));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      enqueueSnackbar("請選擇所有必填項目", { variant: "error" });
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start) || isNaN(end)) {
      enqueueSnackbar("日期格式錯誤", { variant: "error" });
      return;
    }

    if (start > end) {
      enqueueSnackbar("起日不能大於迄日", { variant: "error" });
      return;
    }

    const diff = end.getTime() - start.getTime();
    const maxYear = 365 * 24 * 60 * 60 * 1000;
    if (diff > maxYear) {
      enqueueSnackbar("查詢區間最長為 1 年內", { variant: "error" });
      return;
    }

    setIsSubmitting(true);

    const result = await apiPost(
      "/qryStat",
      { startDate, endDate },
      setLoading
    );
    setIsSubmitting(false);

    if (result && result.respCode === "0000") {
      const data = Array.isArray(result.respData) ? result.respData : [];
      const total = data.length;

      if (total > 0) {
        enqueueSnackbar(
          ` 共取得 ${total} 筆報表（區間：${formatDisplayDate(
            startDate
          )} ～ ${formatDisplayDate(endDate)}）`,
          { variant: "success" }
        );
      } else {
        enqueueSnackbar(result.respMsg || "查無資料", { variant: "info" });
      }

      navigate("/ResultsPage", {
        state: {
          reportMsg: result.respMsg,
          reportData: result.respData,
          startDate,
          endDate,
        },
      });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 5 }}>
      <Box>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          查詢申請報表
        </Typography>

        <Typography
          variant="body2"
          align="center"
          color="textSecondary"
          sx={{ mb: 2 }}
        >
          查詢區間最多一年
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          sx={{ mb: 2 }}
        >
          <Button
            variant="outlined"
            size="small"
            onClick={() => setQuickRange("today")}
          >
            今天
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setQuickRange(7)}
          >
            最近 7 天
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setQuickRange(30)}
          >
            最近一個月
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setQuickRange(365)}
          >
            最近一年
          </Button>
        </Stack>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="案件日期起日"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                inputProps={{ max: formatDate(new Date()) }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="案件日期迄日"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                inputProps={{ max: formatDate(new Date()) }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "查詢中..." : "查詢"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default QueryPage;
