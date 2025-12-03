import React, { useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import { CompletedOrder, MenuItem, Category } from '../types';
import { CATEGORIES_ORDER } from '../constants';
import { X, TrendingUp, ShoppingBag, DollarSign, ListOrdered, Trash2, Calendar, FileDown, Edit, Save, Utensils, Plus } from 'lucide-react';
import { OrderEditModal } from './OrderEditModal';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  orders: CompletedOrder[];
  onClearHistory: () => void;
  menuItems: MenuItem[];
  onUpdateMenuItem: (item: MenuItem) => void;
  onAddMenuItem: (item: MenuItem) => void;
  onUpdateOrder: (order: CompletedOrder) => void;
}

type Tab = 'dashboard' | 'menu';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  orders,
  onClearHistory,
  menuItems,
  onUpdateMenuItem,
  onAddMenuItem,
  onUpdateOrder
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [editingOrder, setEditingOrder] = useState<CompletedOrder | null>(null);

  // Price Editing State
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');

  // Name Editing State
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [tempName, setTempName] = useState<string>('');

  // Add Item State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<Category>(Category.NOODLES);
  const [newItemCanAddNoodle, setNewItemCanAddNoodle] = useState(true);



  // 1. Filter Orders by Date
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const orderDate = new Date(order.timestamp).toISOString().split('T')[0];
      return orderDate === selectedDate;
    });
  }, [orders, selectedDate]);

  // 2. Calculate Summary Stats
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order?.totalAmount || 0), 0);
  const totalOrders = filteredOrders.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // 2. Calculate Item Statistics
  const itemStats = useMemo(() => {
    const stats: Record<string, { count: number; revenue: number }> = {};

    filteredOrders.forEach(order => {
      if (!order || !Array.isArray(order.items)) return;

      order.items.forEach(item => {
        if (!item) return;
        const key = item.name || 'Unknown Item';
        if (!stats[key]) {
          stats[key] = { count: 0, revenue: 0 };
        }

        // Count quantity
        stats[key].count += (item.quantity || 0);

        // Calculate revenue for this item (including noodle add-on)
        const itemTotal = ((item.basePrice || 0) + (item.isAddNoodle ? 10 : 0)) * (item.quantity || 0);
        stats[key].revenue += itemTotal;
      });
    });

    // Convert to array and sort by count (descending)
    return Object.entries(stats)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count);
  }, [filteredOrders]);

  if (!isOpen) return null;

  const exportReport = () => {
    if (filteredOrders.length === 0) {
      window.alert('目前沒有訂單可匯出。');
      return;
    }

    const formatTimestamp = (value: string | Date) => {
      return new Date(value).toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    };

    const header = [
      '訂單編號',
      '下單時間',
      '用餐方式',
      '桌號/客戶資訊',
      '品項',
      '加麵',
      '數量',
      '備註',
      '單價',
      '小計',
      '訂單總計',
    ];

    const rows = filteredOrders.flatMap(order => {
      if (!order || !Array.isArray(order.items)) return [];
      const timestamp = formatTimestamp(order.timestamp);
      const orderTypeLabel = order.orderType === 'dine-in' ? '內用' : '外帶';
      const customerDetail = order.orderType === 'dine-in'
        ? `桌號: ${order.tableNumber || '未指定'}`
        : `${order.customerInfo?.lastName}${order.customerInfo?.title === 'Mr' ? '先生' : '小姐'} (${order.customerInfo?.phone})`;

      return order.items.map(item => {
        if (!item) return [];
        const unitPrice = (item.basePrice || 0) + (item.isAddNoodle ? 10 : 0);
        const lineTotal = unitPrice * (item.quantity || 0);

        return [
          order.orderNumber,
          timestamp,
          orderTypeLabel,
          customerDetail,
          item.name,
          item.isAddNoodle ? '是' : '否',
          item.quantity,
          item.remarks || '',
          unitPrice,
          lineTotal,
          order.totalAmount,
        ];
      });
    });

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);

    // Set column widths
    const wscols = [
      { wch: 10 }, // 訂單編號
      { wch: 20 }, // 下單時間
      { wch: 10 }, // 用餐方式
      { wch: 25 }, // 桌號/客戶資訊
      { wch: 20 }, // 品項
      { wch: 8 },  // 加麵
      { wch: 8 },  // 數量
      { wch: 20 }, // 備註
      { wch: 10 }, // 單價
      { wch: 10 }, // 小計
      { wch: 10 }, // 訂單總計
    ];
    ws['!cols'] = wscols;

    XLSX.utils.book_append_sheet(wb, ws, "營運報表");

    // Generate Excel file
    XLSX.writeFile(wb, `orders-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const startEditingPrice = (item: MenuItem) => {
    setEditingPriceId(item.id);
    setTempPrice(item.price.toString());
  };

  const savePrice = (item: MenuItem) => {
    const newPrice = parseInt(tempPrice);
    if (!isNaN(newPrice) && newPrice >= 0) {
      onUpdateMenuItem({ ...item, price: newPrice });
    }
    setEditingPriceId(null);
  };

  const startEditingName = (item: MenuItem) => {
    setEditingNameId(item.id);
    setTempName(item.name);
  };

  const saveName = (item: MenuItem) => {
    if (tempName.trim()) {
      onUpdateMenuItem({ ...item, name: tempName.trim() });
    }
    setEditingNameId(null);
  };

  const handleAddItem = () => {
    if (!newItemName.trim() || !newItemPrice) return;

    const price = parseInt(newItemPrice);
    if (isNaN(price) || price < 0) return;

    const newItem: MenuItem = {
      id: `new_${Date.now()}`,
      name: newItemName.trim(),
      price: price,
      category: newItemCategory,
      canAddNoodle: newItemCanAddNoodle
    };

    onAddMenuItem(newItem);

    // Reset form and close
    setNewItemName('');
    setNewItemPrice('');
    setNewItemCategory(Category.NOODLES);
    setNewItemCanAddNoodle(true);
    setIsAddModalOpen(false);
  };

  const groupedMenuItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<Category, MenuItem[]>);

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
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold">管理後台</h2>
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'dashboard'
                  ? 'bg-gray-700 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} />
                  <span>營運報表</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('menu')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'menu'
                  ? 'bg-gray-700 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <Utensils size={16} />
                  <span>菜單管理</span>
                </div>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {activeTab === 'dashboard' && (
              <button
                onClick={exportReport}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-amber-100 hover:text-white bg-amber-800 hover:bg-amber-700 rounded-lg transition-colors"
              >
                <FileDown size={18} />
                <span>匯出報表</span>
              </button>
            )}
            <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2 text-white gap-2">
              <Calendar size={18} className="text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent border-none outline-none text-sm font-medium text-white [&::-webkit-calendar-picker-indicator]:invert"
              />
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {activeTab === 'dashboard' ? (
            <>
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
                          <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${index < 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'
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
                  {filteredOrders.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">尚無訂單</div>
                  ) : (
                    [...filteredOrders].reverse().map((order) => (
                      <div key={order.orderNumber} className="p-4 hover:bg-gray-50 transition-colors group">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-mono font-bold text-gray-500">#{order.orderNumber}</span>
                            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${order.orderType === 'dine-in' ? 'bg-amber-100 text-amber-700' : 'bg-stone-200 text-stone-700'}`}>
                              {order.orderType === 'dine-in' ? '內用' : '外帶'}
                            </span>
                            {order.orderType === 'dine-in' && order.tableNumber && (
                              <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-bold">
                                桌號 {order.tableNumber}
                              </span>
                            )}
                            {order.orderType === 'takeout' && order.customerInfo && (
                              <span className="ml-2 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">
                                {order.customerInfo.lastName}{order.customerInfo.title === 'Mr' ? '先生' : '小姐'}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-400">{formatDate(order.timestamp)}</span>
                            <button
                              onClick={() => setEditingOrder(order)}
                              className="p-1 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                              title="編輯訂單"
                            >
                              <Edit size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1 pl-4 border-l-2 border-gray-200 mb-2">
                          {Array.isArray(order.items) && order.items.map((item, idx) => (
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
            </>
          ) : (
            /* Menu Management Tab */
            <div className="space-y-6">
              <div className="flex justify-end">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-bold shadow-sm"
                >
                  <Plus size={18} />
                  新增餐點
                </button>
              </div>

              {Object.entries(groupedMenuItems).map(([category, items]: [string, MenuItem[]]) => (
                <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-3 bg-gray-50 border-b font-bold text-gray-700">
                    {category}
                  </div>
                  <div className="divide-y">
                    {items.map(item => (
                      <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                        <div className="flex-1 mr-4">
                          {editingNameId === item.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                className="flex-1 p-1 border rounded"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') saveName(item);
                                  if (e.key === 'Escape') setEditingNameId(null);
                                }}
                              />
                              <button
                                onClick={() => saveName(item)}
                                className="p-1 text-green-600 hover:bg-green-50 rounded"
                              >
                                <Save size={18} />
                              </button>
                              <button
                                onClick={() => setEditingNameId(null)}
                                className="p-1 text-gray-400 hover:bg-gray-100 rounded"
                              >
                                <X size={18} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 group/name">
                              <span className="font-medium text-gray-800">{item.name}</span>
                              <button
                                onClick={() => startEditingName(item)}
                                className="p-1 text-gray-300 hover:text-amber-600 opacity-0 group-hover/name:opacity-100 transition-all"
                              >
                                <Edit size={14} />
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          {editingPriceId === item.id ? (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500 text-sm">$</span>
                              <input
                                type="number"
                                value={tempPrice}
                                onChange={(e) => setTempPrice(e.target.value)}
                                className="w-20 p-1 border rounded text-right"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') savePrice(item);
                                  if (e.key === 'Escape') setEditingPriceId(null);
                                }}
                              />
                              <button
                                onClick={() => savePrice(item)}
                                className="p-1 text-green-600 hover:bg-green-50 rounded"
                              >
                                <Save size={18} />
                              </button>
                              <button
                                onClick={() => setEditingPriceId(null)}
                                className="p-1 text-gray-400 hover:bg-gray-100 rounded"
                              >
                                <X size={18} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-4">
                              <span className="font-bold text-gray-600">${item.price}</span>
                              <button
                                onClick={() => startEditingPrice(item)}
                                className="p-1 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                              >
                                <Edit size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Footer Actions (Only for Dashboard) */}
        {activeTab === 'dashboard' && (
          <div className="p-4 bg-white border-t border-gray-200 shrink-0">
            <button
              onClick={() => {
                if (window.confirm('確定要清除所有今日資料嗎？此操作無法復原。')) {
                  onClearHistory();
                }
              }}
              className="w-full flex items-center justify-center gap-2 text-amber-800 bg-amber-100 hover:bg-amber-200 py-3 rounded-xl font-bold transition-colors"
            >
              <Trash2 size={20} />
              每日結帳 (清除資料)
            </button>
          </div>
        )}
      </div>

      {/* Order Edit Modal */}
      {editingOrder && (
        <OrderEditModal
          isOpen={!!editingOrder}
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onSave={onUpdateOrder}
          menuItems={menuItems}
        />
      )}

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="p-4 border-b flex justify-between items-center bg-amber-50">
              <h3 className="text-lg font-bold text-amber-900">新增菜單品項</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-amber-100 rounded-full transition-colors">
                <X size={20} className="text-amber-900" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">品名</label>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="例如：海鮮粥"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">價格</label>
                <input
                  type="number"
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="例如：100"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">分類</label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value as Category)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  {CATEGORIES_ORDER.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="canAddNoodle"
                  checked={newItemCanAddNoodle}
                  onChange={(e) => setNewItemCanAddNoodle(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="canAddNoodle" className="text-sm font-bold text-gray-700 cursor-pointer">
                  可加麵 (適用於麵類)
                </label>
              </div>
            </div>

            <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-200 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleAddItem}
                disabled={!newItemName || !newItemPrice}
                className="px-6 py-2 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                新增
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
