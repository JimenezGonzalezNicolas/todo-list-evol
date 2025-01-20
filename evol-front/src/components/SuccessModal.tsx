import React from "react";

interface SuccessModalProps {
    onConfirm: () => void;
    message?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ onConfirm, message }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-700 text-white rounded-lg shadow-lg w-96 p-6">
                <h3 className="text-lg font-bold mb-4 text-center">
                    {message || "¡Acción realizada con éxito!"}
                </h3>
                <div className="flex justify-center mt-4">
                    <button
                        onClick={onConfirm}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:opacity-80"
                    >
                        Aceptar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;
