import React, { useMemo } from 'react';
import { CompletedOrder } from '../types';
import { X, TrendingUp, ShoppingBag, DollarSign, ListOrdered, Trash2, Calendar } from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  orders: CompletedOrder[];
  onClearHistory: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  isOpen, 
  onClose, 
  orders,
  onClearHistory 
}) => {
  if (!isOpen) return null;

  // 1. Calculate Summary Stats
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // 2. Calculate Item Statistics
  const itemStats = useMemo(() => {
    const stats: Record<string, { count: number; revenue: number }> = {};

    orders.forEach(order => {
      order.items.forEach(item => {
        const key = item.name;
        if (!stats[key]) {
          stats[key] = { count: 0, revenue: 0 };
        }
        
        // Count quantity
        stats[key].count += item.quantity;
        
        // Calculate revenue for this item (including noodle add-on)
        const itemTotal = (item.basePrice + (item.isAddNoodle ? 10 : 0)) * item.quantity;
        stats[key].revenue += itemTotal;
      });
    });

    // Convert to array and sort by count (descending)
    return Object.entries(stats)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count);
  }, [orders]);

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-2xl bg-gray-50 h-full shadow-2xl flex flex-col animate-slide-in-right overflow-hidden">
        
        {/* Header */}
        <div className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md shrink-0">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-yellow-400" />
            <h2 className="text-xl font-bold">今日營運報表</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-2 text-gray-500">
                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                  <DollarSign size={20} />
                </div>
                <span className="font-medium text-sm">今日營業額</span>
              </div>
              <p className="text-3xl font-black text-gray-800">${totalRevenue.toLocaleString()}</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-2 text-gray-500">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <ShoppingBag size={20} />
                </div>
                <span className="font-medium text-sm">訂單總數</span>
              </div>
              <p className="text-3xl font-black text-gray-800">{totalOrders} <span className="text-sm font-normal text-gray-400">筆</span></p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-2 text-gray-500">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                  <ListOrdered size={20} />
                </div>
                <span className="font-medium text-sm">平均客單價</span>
              </div>
              <p className="text-3xl font-black text-gray-800">${avgOrderValue}</p>
            </div>
          </div>

          {/* Item Sales Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <ListOrdered size={18} />
                餐點銷售排行
              </h3>
            </div>
            <div className="divide-y max-h-80 overflow-y-auto">
              {itemStats.length === 0 ? (
                <div className="p-8 text-center text-gray-400">尚無銷售數據</div>
              ) : (
                itemStats.map((item, index) => (
                  <div key={item.name} className="p-3 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                        index < 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="font-medium text-gray-700">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{item.count} 份</div>
                      <div className="text-xs text-gray-400">${item.revenue}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Orders Log */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
               <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Calendar size={18} />
                訂單紀錄
              </h3>
            </div>
            <div className="divide-y max-h-96 overflow-y-auto">
               {orders.length === 0 ? (
                 <div className="p-8 text-center text-gray-400">尚無訂單</div>
               ) : (
                 [...orders].reverse().map((order) => (
                   <div key={order.orderNumber} className="p-4 hover:bg-gray-50 transition-colors">
                     <div className="flex justify-between items-start mb-2">
                       <div>
                         <span className="font-mono font-bold text-gray-500">#{order.orderNumber}</span>
                         <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${order.orderType === 'dine-in' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                           {order.orderType === 'dine-in' ? '內用' : '外帶'}
                         </span>
                       </div>
                       <span className="text-sm text-gray-400">{formatDate(order.timestamp)}</span>
                     </div>
                     <div className="text-sm text-gray-600 space-y-1 pl-4 border-l-2 border-gray-200 mb-2">
                       {order.items.map((item, idx) => (
                         <div key={idx} className="flex justify-between">
                            <span>{item.name} {item.isAddNoodle && '(+麵)'} x{item.quantity}</span>
                         </div>
                       ))}
                     </div>
                     <div className="text-right font-bold text-gray-800">
                       總計: ${order.totalAmount}
                     </div>
                   </div>
                 ))
               )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-gray-200 shrink-0">
           <button 
             onClick={() => {
                if(window.confirm('確定要清除所有今日資料嗎？此操作無法復原。')) {
                    onClearHistory();
                }
             }}
             className="w-full flex items-center justify-center gap-2 text-red-600 bg-red-50 hover:bg-red-100 py-3 rounded-xl font-bold transition-colors"
           >
             <Trash2 size={20} />
             每日結帳 (清除資料)
           </button>
        </div>

      </div>
    </div>
  );
};