import { useToast } from '../hooks/useToast';

export default function Toast() {
  const { toasts, removeToast } = useToast();

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  const borderColors = {
    success: 'border-l-4 border-l-green-500',
    error: 'border-l-4 border-l-red-500',
    info: 'border-l-4 border-l-blue-500',
  };

  const iconColors = {
    success: 'text-green-500',
    error: 'text-red-500',
    info: 'text-blue-500',
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-md px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`bg-white rounded-lg shadow-lg p-4 flex items-center gap-3 animate-slide-down ${borderColors[toast.type]}`}
          onClick={() => removeToast(toast.id)}
        >
          <span className={`text-xl ${iconColors[toast.type]}`}>{icons[toast.type]}</span>
          <span className="text-sm font-medium text-gray-800">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
