import React from 'react';
import { ShoppingCart, X } from 'lucide-react';

interface CartReminderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCheckout: () => void;
}

export const CartReminderModal: React.FC<CartReminderModalProps> = ({
    isOpen,
    onClose,
    onCheckout,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-amber-600 p-4 flex items-center justify-between text-white">
                    <div className="flex items-center gap-2 font-bold text-lg">
                        <ShoppingCart size={24} />
                        <span>貼心提醒</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-amber-700 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-gray-700 text-lg mb-6 text-center font-medium">
                        您的購物車內還有餐點尚未結帳，<br />是否要前往結帳呢？
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 hover:border-gray-300 transition-all"
                        >
                            再逛逛
                        </button>
                        <button
                            onClick={() => {
                                onCheckout();
                                onClose();
                            }}
                            className="flex-1 py-3 px-4 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 shadow-lg shadow-amber-600/20 transition-all"
                        >
                            前往結帳
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
