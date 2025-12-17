import { API_BASE_URL } from '../config';
import { useError } from './context/ErrorContext';
import { ERROR_CODE_MAP } from './constants/errorMessages';
import { useAuth } from './context/AuthContext';

export const useApi = () => {
    const { showError, showSuccess } = useError();
    const { authData } = useAuth(); 

    const getHeaders = (isJson = true) => {
        const empNo = authData?.empNo;
        const apiKey = authData?.apiKey;

        if (!empNo || !apiKey) {
            showError({
                code: 'Bad',
                message: '缺少必要的 Header 資訊',
            });
            return null;
        }

        const headers = {
            empNo,
            'X-API-KEY': apiKey,
        };

        if (isJson) {
            headers['Content-Type'] = 'application/json';
        }

        return headers;
    };

    const apiGet = async (endpoint, setLoading) => {
        const headers = getHeaders();
        if (!headers) return { respCode: '9999' };

        if (setLoading) setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'GET',
                headers,
            });

            const result = await response.json();

            if (result.respCode === '0000') {
                return result;
            } else {
                showError({
                    code: result.respCode,
                    message: result.respMsg || ERROR_CODE_MAP[result.respCode] || '未知錯誤',
                });
                return result;
            }
        } catch (error) {
            showError({
                code: '9999',
                message: error.message || ERROR_CODE_MAP['9999'],
            });
            return { respCode: '9999', respMsg: error.message };
        } finally {
            if (setLoading) setLoading(false);
        }
    };

    const apiPost = async (endpoint, data = {}, setLoading) => {
        const headers = getHeaders();
        if (!headers) return { respCode: '9999' };

        if (setLoading) setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (result.respCode === '0000') {
                return result;
            } else {
                showError({
                    code: result.respCode,
                    message: result.respMsg || ERROR_CODE_MAP[result.respCode] || '未知錯誤',
                });
                return result;
            }
        } catch (error) {
            showError({
                code: '9999',
                message: error.message || ERROR_CODE_MAP['9999'],
            });
            return { respCode: '9999', respMsg: error.message };
        } finally {
            if (setLoading) setLoading(false);
        }
    };

    const apiUploadPost = async (
        endpoint,
        formData,
        setLoading,
        showSuccessPopup = false,
        successMsg = '',
        successImage = ''
    ) => {
        const headers = getHeaders(false);
        if (!headers) return { respCode: '9999' };

        if (setLoading) setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers,
                body: formData,
            });

            const result = await response.json();

            if (result.respCode === '0000') {
                if (showSuccessPopup) {
                    showSuccess({
                        code: result.respCode,
                        message: successMsg || result.respMsg || '上傳成功',
                        image: successImage,
                    });
                }
                return result;
            } else {
                showError({
                    code: result.respCode,
                    message: result.respMsg || '上傳失敗',
                });
                return result;
            }
        } catch (error) {
            showError({
                code: '9999',
                message: error.message || '上傳發生未知錯誤',
            });
            return { respCode: '9999', respMsg: error.message };
        } finally {
            if (setLoading) setLoading(false);
        }
    };

    const apiDownload = async (endpoint, data = {}, fallbackFilename = 'download') => {
        const headers = getHeaders();
        if (!headers) return { respCode: '9999' };

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(data),
            });

            const contentType = response.headers.get('Content-Type') || '';
            const contentDisposition = response.headers.get('Content-Disposition') || '';

            if (contentType.includes('application/json')) {
                const errorJson = await response.json();
                showError({
                    code: errorJson.respCode || '9999',
                    message: errorJson.respMsg || '後端回傳錯誤',
                });
                return { respCode: errorJson.respCode || '9999' };
            }

            let filename = fallbackFilename;
            const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
            if (fileNameMatch && fileNameMatch[1]) {
                filename = decodeURIComponent(fileNameMatch[1].replace(/['"]/g, ''));
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);

            return { respCode: '0000' };
        } catch (error) {
            showError({
                code: '9999',
                message: error.message || ERROR_CODE_MAP['9999'],
            });
            return { respCode: '9999', respMsg: error.message };
        }
    };

    const apiPostDeclare = async (
        endpoint,
        data = {},
        setLoading,
        showSuccessPopup = false,
        successMsg = '',
        successImage = ''
    ) => {
        const headers = getHeaders();
        if (!headers) return { respCode: '9999' };

        if (setLoading) setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (result.respCode === '0000') {
                showSuccess({
                    code: result.respCode,
                    message: successMsg || result.respMsg || '操作成功',
                    image: successImage,
                });
                return result;
            } else {
                showError({
                    code: result.respCode,
                    message: result.respMsg || ERROR_CODE_MAP[result.respCode] || '未知錯誤',
                });
                return result;
            }
        } catch (error) {
            showError({
                code: '9999',
                message: error.message || ERROR_CODE_MAP['9999'],
            });
            return { respCode: '9999', respMsg: error.message };
        } finally {
            if (setLoading) setLoading(false);
        }
    };

    return { apiGet, apiPost, apiUploadPost, apiDownload, apiPostDeclare };
};
