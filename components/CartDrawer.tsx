import React, { useMemo } from 'react';
import { CartItem, OrderType } from '../types';
import { X, Trash2, Minus, Plus, ChefHat, ShoppingBag, Utensils } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  updateQuantity: (index: number, delta: number) => void;
  updateRemarks: (index: number, text: string) => void;
  removeFromCart: (index: number) => void;
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  updateQuantity,
  updateRemarks,
  removeFromCart,
  orderType,
  setOrderType,
  onCheckout
}) => {
  const totalAmount = useMemo(() => {
    return cart.reduce((sum, item) => {
      const unitPrice = item.basePrice + (item.isAddNoodle ? 10 : 0);
      return sum + unitPrice * item.quantity;
    }, 0);
  }, [cart]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
        
        {/* Header */}
        <div className="p-4 border-b bg-red-600 text-white flex justify-between items-center shadow-md">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-6 w-6" />
            <h2 className="text-xl font-bold">您的訂單</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Order Type Toggle */}
        <div className="p-4 bg-gray-50 border-b">
            <div className="flex bg-gray-200 rounded-lg p-1">
                <button 
                    onClick={() => setOrderType('dine-in')}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-md text-sm font-bold transition-all ${orderType === 'dine-in' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Utensils size={16} />
                    <span>內用</span>
                </button>
                <button 
                    onClick={() => setOrderType('takeout')}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-md text-sm font-bold transition-all ${orderType === 'takeout' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <ShoppingBag size={16} />
                    <span>外帶</span>
                </button>
            </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <ChefHat size={64} className="opacity-20" />
              <p className="text-lg">購物車是空的</p>
              <button 
                onClick={onClose}
                className="text-red-600 font-medium hover:underline"
              >
                趕快去點餐吧！
              </button>
            </div>
          ) : (
            cart.map((item, index) => (
              <div key={`${item.itemId}-${index}`} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{item.name}</h3>
                    {item.isAddNoodle && (
                      <span className="inline-block bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded mt-1">
                        + 加麵 ($10)
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-800">
                      ${(item.basePrice + (item.isAddNoodle ? 10 : 0)) * item.quantity}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-1 border border-gray-200">
                        <button 
                            onClick={() => updateQuantity(index, -1)}
                            className="p-1 hover:bg-white rounded shadow-sm disabled:opacity-50 text-gray-600"
                            disabled={item.quantity <= 1}
                        >
                            <Minus size={14} />
                        </button>
                        <span className="w-6 text-center font-bold text-gray-700">{item.quantity}</span>
                        <button 
                            onClick={() => updateQuantity(index, 1)}
                            className="p-1 hover:bg-white rounded shadow-sm text-gray-600"
                        >
                            <Plus size={14} />
                        </button>
                    </div>

                    <button 
                        onClick={() => removeFromCart(index)}
                        className="text-gray-400 hover:text-red-500 p-2 transition-colors"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>

                {/* Remarks Input */}
                <div className="mt-3">
                    <input
                        type="text"
                        placeholder="備註 (例如: 不要蔥, 小辣)"
                        value={item.remarks}
                        onChange={(e) => updateRemarks(index, e.target.value)}
                        className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all placeholder:text-gray-400"
                    />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Checkout */}
        {cart.length > 0 && (
          <div className="p-4 bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-end mb-4">
              <span className="text-gray-600">總計 ({cart.reduce((a, b) => a + b.quantity, 0)} 項)</span>
              <span className="text-2xl font-bold text-red-600">${totalAmount}</span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full bg-red-600 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-red-200 active:scale-[0.98] hover:bg-red-700 transition-all flex items-center justify-center space-x-2"
            >
              <span>確認下單</span>
              <span>→</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};