import { toast, ToastOptions } from 'react-toastify';

// Configuração padrão para os toasts
export const defaultToastConfig: ToastOptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
};

// Funções helper para facilitar o uso
export const showSuccess = (message: string) => {
    toast.success(message, defaultToastConfig);
};

export const showError = (message: string) => {
    toast.error(message, defaultToastConfig);
};

export const showWarning = (message: string) => {
    toast.warning(message, defaultToastConfig);
};

export const showInfo = (message: string) => {
    toast.info(message, defaultToastConfig);
};
