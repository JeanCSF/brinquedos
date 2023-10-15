import { useEffect } from "react";

import { AiOutlineCloseCircle } from "react-icons/ai";

type ToastProps = {
  message: string;
  type: string | 'success' | 'error' | 'warning';
  isToastVisible: boolean;
  hideToast: () => void;
};

const Toast: React.FC<ToastProps> = ({ message, type, isToastVisible, hideToast }) => {
  useEffect(() => {
    if (isToastVisible) {
      setTimeout(() => {
        hideToast();
      }, 2000);
    }

  }, [isToastVisible]);

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div
      className={`fixed top-5 right-5 px-4 py-2 rounded-md text-white ${getBackgroundColor()}`}
      style={{ display: isToastVisible ? 'block' : 'none' }}
    >
      <div className="text-end">
        <button className="text-2xl" onClick={() => hideToast()}>
          <AiOutlineCloseCircle />
        </button>
      </div>
      <p className="font-bold">{message}</p>
    </div>
  );
};

export default Toast;
