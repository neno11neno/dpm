import React, { createContext, useState, useContext } from 'react';
import ErrorPopup from '../Features/ErrorPopup/ErrorPopup';
const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);

    const showError = (err) => {
        setError(err);
        setOpen(true);
    };

    const closeError = () => {
        setOpen(false);
        setError(null);
    };

    return (
        <ErrorContext.Provider value={{ showError }}>
            {children}
            <ErrorPopup error={error} open={open} onClose={closeError} />
        </ErrorContext.Provider>
    );
};

export const useError = () => {
    const context = useContext(ErrorContext);
    if (!context) throw new Error('useError 必須在 ErrorProvider 中使用');
    return context;
};
