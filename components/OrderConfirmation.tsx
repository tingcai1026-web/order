import React from 'react';
import { CompletedOrder } from '../types';
import { CheckCircle, Receipt, Clock, MapPin, Home, Utensils, ShoppingBag } from 'lucide-react';

interface OrderConfirmationProps {
  order: CompletedOrder;
  onClose: () => void;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ order, onClose }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header - Success Message */}
        <div className="bg-green-600 p-6 text-center text-white shrink-0">
          <div className="flex justify-center mb-3">
            <CheckCircle size={48} className="animate-bounce" />
          </div>
          <h2 className="text-2xl font-bold mb-1">訂單已送出！</h2>
          <p className="opacity-90">廚房正在準備您的餐點</p>
        </div>

        {/* Order Info & Number */}
        <div className="p-4 bg-green-50 border-b border-green-100 flex justify-between items-center shrink-0">
          <div>
            <p className="text-xs text-green-800 font-bold uppercase tracking-wider mb-1">取餐號碼</p>
            <p className="text-3xl font-black text-green-700">#{order.orderNumber}</p>
          </div>
          <div className="text-right">
             <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${
                order.orderType === 'dine-in' 
                  ? 'bg-red-100 text-red-700' 
                  : 'bg-orange-100 text-orange-700'
             }`}>
                {order.orderType === 'dine-in' ? <Utensils size={14} /> : <ShoppingBag size={14} />}
                {order.orderType === 'dine-in' ? '內用' : '外帶'}
             </div>
             <div className="mt-1 text-xs text-gray-500 flex items-center justify-end gap-1">
               <Clock size={12} />
               {formatDate(order.timestamp)}
             </div>
          </div>
        </div>

        {/* Receipt Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 bg-white relative">
          <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-black/5 to-transparent pointer-events-none"></div>
          
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-gray-800 font-bold border-b pb-2">
              <Receipt size={20} />
              <span>訂單明細</span>
            </div>

            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-start text-sm">
                  <div className="flex-1 pr-4">
                    <div className="font-medium text-gray-900">
                      {item.name} <span className="text-gray-500">x{item.quantity}</span>
                    </div>
                    {item.isAddNoodle && (
                      <div className="text-xs text-red-500">+ 加麵</div>
                    )}
                    {item.remarks && (
                      <div className="text-xs text-gray-500 mt-0.5 bg-gray-100 inline-block px-1.5 py-0.5 rounded">
                        備註: {item.remarks}
                      </div>
                    )}
                  </div>
                  <div className="font-bold text-gray-700">
                    ${(item.basePrice + (item.isAddNoodle ? 10 : 0)) * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-dashed border-gray-200 pt-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">總金額</span>
                <span className="text-3xl font-bold text-red-600">${order.totalAmount}</span>
              </div>
              <p className="text-xs text-center text-gray-400 mt-4">
                請至櫃檯出示此畫面結帳
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-50 border-t shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Home size={20} />
            <span>回到首頁 / 下一筆訂單</span>
          </button>
        </div>
      </div>
    </div>
  );
};