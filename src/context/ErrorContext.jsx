import React, { createContext, useState, useContext } from 'react';
import ErrorPopup from '../Features/ErrorPopup/ErrorPopup';
import SuccessPopup from '../Features/SuccessPopup/SuccessPopup';

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
    const [error, setError] = useState(null);
    const [openError, setOpenError] = useState(false);

    const [success, setSuccess] = useState(null);
    const [openSuccess, setOpenSuccess] = useState(false);

    const showError = (err) => {
        setError(err);
        setOpenError(true);
    };

    const closeError = () => {
        setOpenError(false);
        setError(null);
    };

    const showSuccess = (payload) => {
        setSuccess(payload);
        setOpenSuccess(true);
    };

    const closeSuccess = () => {
        setOpenSuccess(false);
        setSuccess(null);
    };

    return (
        <ErrorContext.Provider value={{ showError, showSuccess }}>
            {children}
            <ErrorPopup error={error} open={openError} onClose={closeError} />
            <SuccessPopup success={success} open={openSuccess} onClose={closeSuccess} />
        </ErrorContext.Provider>
    );
};

export const useError = () => {
    const context = useContext(ErrorContext);
    if (!context) throw new Error('useError 必須在 ErrorProvider 中使用');
    return context;
};
