import { useState, useEffect, useRef } from 'react';
import {
  Container, TextField, MenuItem, Button, Grid, Typography, Box, FormHelperText
} from '@mui/material';
import { useLoading } from '../../context/LoadingContext';
import { useApi } from '../../api';
import { useSnackbar } from 'notistack';
import { useError } from '../../context/ErrorContext';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['.xlsx', 'txt'];

const isValidFile = (file) => {
  if (!file) return false;
  const isTypeValid = ALLOWED_TYPES.some((ext) => file.name.toLowerCase().endsWith(ext));
  const isSizeValid = file.size <= MAX_FILE_SIZE;
  return isTypeValid && isSizeValid;
};

const UploadPage = () => {
  const [rptCode, setRptCode] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [reports, setReports] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const { setLoading } = useLoading();
  const { apiPost, apiUploadPost } = useApi();
  const { enqueueSnackbar } = useSnackbar();
  const { showError } = useError(); 

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const result = await apiPost('/authRpt', {}, setLoading);
    if (result?.respCode === '0000' && Array.isArray(result.respData)) {
      const mapped = result.respData.map((r) => ({
        id: r.rptCode,
        name: r.rptName,
        type: r.rptFreq,
      }));
      setReports(mapped);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!rptCode || !file) {
      enqueueSnackbar('請選擇報表與檔案', { variant: 'error' });
      return;
    }

    if (!isValidFile(file)) {
      enqueueSnackbar('檔案格式須為 .xlsx / txt 且大小不得超過 5MB', { variant: 'error' });
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('req', new Blob([JSON.stringify({ rptCode })], { type: "application/json" }));
    formData.append('file', file);

    const result = await apiUploadPost('/uploadRpt', formData, setLoading, showError);

    if (result?.respCode === '0000') {
      enqueueSnackbar('  報表上傳成功！', { variant: 'success' });
      setRptCode('');
      setFile(null);
      setFileName('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }

    setIsSubmitting(false);
  };

  const selectedReport = reports.find((r) => r.id === rptCode);

  return (
    <Container maxWidth="sm" sx={{ marginTop: 5 }}>
      <Box>
        <Typography variant="h4" align="center" gutterBottom>
          上傳申請報表
        </Typography>

        <form onSubmit={handleUpload}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="報表代號"
                value={rptCode}
                onChange={(e) => setRptCode(e.target.value)}
                variant="outlined"
              >
                <MenuItem value="">
                  <em>請選擇報表代號</em>
                </MenuItem>
                {reports.map((report) => (
                  <MenuItem key={report.id} value={report.id}>
                    {report.name}（{report.type}）
                  </MenuItem>
                ))}
              </TextField>
              {selectedReport && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  📘 報表類型：{selectedReport.type}
                </Typography>
              )}
            </Grid>

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
                    setFileName(selected?.name || '');
                    setErrorMsg('');
                  }}
                />
              </Button>
              {fileName && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                    已選檔案：{fileName}
                </Typography>
              )}
              <Typography variant="caption" color="textSecondary" display="block">
                支援格式：.txt / .xlsx，txt最大 5MB
              </Typography>
              {errorMsg && (
                <FormHelperText error sx={{ mt: 1 }}>
                  {errorMsg}
                </FormHelperText>
              )}
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? '上傳中…' : '上傳'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default UploadPage;
