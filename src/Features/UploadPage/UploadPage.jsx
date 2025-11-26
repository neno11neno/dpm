import { useState, useEffect, useRef } from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  FormHelperText,
  Checkbox,
  FormControlLabel,
  Autocomplete,
} from "@mui/material";
import { useLoading } from "../../context/LoadingContext";
import { useApi } from "../../api";
import { useSnackbar } from "notistack";
import { useError } from "../../context/ErrorContext";

const UploadPage = () => {
  const [rptCode, setRptCode] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [reports, setReports] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDateMode, setIsDateMode] = useState(false);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");

  const fileInputRef = useRef(null);
  const { setLoading } = useLoading();
  const { apiPost, apiUploadPost } = useApi();
  const { enqueueSnackbar } = useSnackbar();
  const { showError } = useError();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const result = await apiPost("/authRpt", {}, setLoading);
    if (result?.respCode === "0000" && Array.isArray(result.respData)) {
      const mapped = result.respData.map((r) => ({
        id: r.rptCode,
        name: r.rptName,
        type: r.rptFreq,
      }));
      setReports(mapped);
    }
  };

  const selectedReport = reports.find((r) => r.id === rptCode);
  const rptFreq = selectedReport?.type || "";

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!rptCode) {
      enqueueSnackbar("請選擇報表代號", { variant: "error" });
      return;
    }

    if (!isDateMode && !file) {
      enqueueSnackbar("請選擇檔案", { variant: "error" });
      return;
    }

    setErrorMsg("");
    setIsSubmitting(true);

    const formData = new FormData();
    const payload = { rptCode };
    const {
      year: useYear,
      month: useMonth,
      day: useDay,
    } = getValidDatePartsByFreq(rptFreq);

    if (isDateMode) {
      payload.noDataFg = true;
      if (useYear && !year) {
        enqueueSnackbar("請選擇年份", { variant: "error" });
        setIsSubmitting(false);
        return;
      }
      if (useMonth && !month) {
        enqueueSnackbar("請選擇月份", { variant: "error" });
        setIsSubmitting(false);
        return;
      }
      if (useDay && !day) {
        enqueueSnackbar("請選擇日期", { variant: "error" });
        setIsSubmitting(false);
        return;
      }

      const paddedYear = String(year);
      const paddedMonth = useMonth ? String(month).padStart(2, "0") : "00";
      const paddedDay = useDay ? String(day).padStart(2, "0") : "00";
      payload.rptDate = `${paddedYear}${paddedMonth}${paddedDay}`;

      formData.append(
        "file",
        new Blob([], { type: "application/octet-stream" })
      );
    } else {
      payload.noDataFg = false;
      payload.rptDate = null;

      if (!isValidFile(file)) {
        enqueueSnackbar("檔案格式須為 .xlsx / txt 且大小不得超過 5MB", {
          variant: "error",
        });
        setIsSubmitting(false);
        return;
      }

      formData.append("file", file);
    }
    formData.append(
      "req",
      new Blob([JSON.stringify(payload)], { type: "application/json" })
    );
    const result = await apiUploadPost(
      "/uploadRpt",
      formData,
      setLoading,
      showError
    );
    if (result?.respCode === "0000") {
      enqueueSnackbar("報表上傳成功！", { variant: "success" });
      setRptCode("");
      setFile(null);
      setFileName("");
      setYear("");
      setMonth("");
      setDay("");
      setIsDateMode(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
    setIsSubmitting(false);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 2 }, (_, i) => `${currentYear - i}`);

  const months = (() => {
    if (rptFreq === "年報") return [];
    if (rptFreq === "半年報") return ["06", "12"];
    if (rptFreq === "季報") return ["03", "06", "09", "12"];
    return Array.from({ length: 12 }, (_, i) => `${i + 1}`.padStart(2, "0"));
  })();

  const days = (() => {
    if (rptFreq === "旬報") return ["01", "02", "03"];
    return Array.from({ length: 31 }, (_, i) => `${i + 1}`.padStart(2, "0"));
  })();

  return (
    <Container maxWidth="sm" sx={{ marginTop: 5 }}>
      <Box>
        <Typography variant="h4" align="center" gutterBottom>
          上傳申請報表
        </Typography>

        <form onSubmit={handleUpload}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Autocomplete
                fullWidth
                options={reports}
                getOptionLabel={(option) => `${option.name}`}
                value={reports.find((r) => r.id === rptCode) || null}
                onChange={(event, newValue) => {
                  setRptCode(newValue ? newValue.id : "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="報表代號"
                    variant="outlined"
                    placeholder="輸入報表代號或名稱"
                  />
                )}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
              {selectedReport && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  📘 報表類型：{selectedReport.type}
                </Typography>
              )}
            </Grid>

            {rptCode && (
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isDateMode}
                      onChange={(e) => setIsDateMode(e.target.checked)}
                    />
                  }
                  label="本期無資料申報(請選擇申報期別)"
                />
              </Grid>
            )}

            {isDateMode && (
              <>
                <Grid item xs={12} sm={rptFreq === "年報" ? 12 : 4}>
                  <TextField
                    fullWidth
                    select
                    label="年份"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  >
                    {years.map((y) => (
                      <MenuItem key={y} value={y}>
                        {y}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {rptFreq !== "年報" && (
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      select
                      label="月份"
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                    >
                      {months.map((m) => (
                        <MenuItem key={m} value={m}>
                          {m}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                )}

                {(rptFreq === "日報" || rptFreq === "旬報") && (
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      select
                      label="日"
                      value={day}
                      onChange={(e) => setDay(e.target.value)}
                    >
                      {days.map((d) => (
                        <MenuItem key={d} value={d}>
                          {d}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                )}
              </>
            )}
            {!isDateMode && (
              <Grid item xs={12}>
                <Button variant="outlined" component="label">
                  選擇檔案
                  <input
                    type="file"
                    hidden
                    ref={fileInputRef}
                    accept=".xlsx,.txt"
                    onChange={(e) => {
                      const selected = e.target.files?.[0] || null;
                      setFile(selected);
                      setFileName(selected?.name || "");
                      setErrorMsg("");
                    }}
                  />
                </Button>
                {fileName && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                      已選檔案：{fileName}
                  </Typography>
                )}
                <Typography
                  variant="caption"
                  color="textSecondary"
                  display="block"
                >
                  支援格式： .txt / .xlsx，最大5MB
                </Typography>
                {errorMsg && (
                  <FormHelperText error sx={{ mt: 1 }}>
                    {errorMsg}
                  </FormHelperText>
                )}
              </Grid>
            )}
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "處理中…" : isDateMode ? "送出" : "上傳"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default UploadPage;

function isValidFile(file) {
  const maxSize = 5 * 1024 * 1024;
  const validTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
  ];
  return file && validTypes.includes(file.type) && file.size <= maxSize;
}

function getValidDatePartsByFreq(freq) {
  switch (freq) {
    case "年報":
      return { year: true, month: false, day: false };
    case "半年報":
      return { year: true, month: true, day: false };
    case "季報":
      return { year: true, month: true, day: false };
    case "月報":
      return { year: true, month: true, day: false };
    case "旬報":
      return { year: true, month: true, day: true };
    case "日報":
      return { year: true, month: true, day: true };
    default:
      return { year: true, month: false, day: false };
  }
}
