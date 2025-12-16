import { API_BASE_URL } from '../config';

export const apiUploadPost = async(endpoint, formData, setLoading, showError) => {
    const empNo = sessionStorage.getItem('empNo');
    const apiKey = sessionStorage.getItem('X-API-KEY');

    if (!empNo || !apiKey) {
        if (showError) {
            showError({
                code: 'Bad',
                message: '缺少必要的 Header 資訊',
            });
        }
        return { respCode: '9999' };
    }

    if (setLoading) setLoading(true);

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'empNo': empNo,
                'X-API-KEY': apiKey,
            },
            body: formData,
        });

        const result = await response.json();

        if (result.respCode === '0000') {
            return result;
        } else {
            if (showError) {
                showError({
                    code: result.respCode,
                    message: result.respMsg || '上傳失敗',
                });
            }
            return result;
        }
    } catch (error) {
        if (showError) {
            showError({
                code: '9999',
                message: error.message || '上傳發生未知錯誤',
            });
        }
        return { respCode: '9999', respMsg: error.message };
    } finally {
        if (setLoading) setLoading(false);
    }
};