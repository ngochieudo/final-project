import useConfirmModal from "@/app/hooks/useConfirmModal";

interface ConfirmModalProps {
    onConfirm: () => void
    title: string
    message: string
}

const ConfirmModal:React.FC<ConfirmModalProps> = ({ onConfirm, title, message}) => {
  const confirmModal = useConfirmModal()

  if (!confirmModal.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20 p-4 sm:p-6 lg:p-8">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
          <button onClick={() => confirmModal.onClose()} className="px-4 py-2 bg-gray-300 text-gray-700 rounded mr-2">Cancel</button>
          <button onClick={() =>  onConfirm()} className="px-4 py-2 bg-red-500 text-white rounded">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
