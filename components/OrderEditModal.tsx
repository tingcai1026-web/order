import React, { useState, useEffect } from 'react';
import { CompletedOrder, CartItem, MenuItem, Category } from '../types';
import { X, Plus, Minus, Trash2, Save } from 'lucide-react';

interface OrderEditModalProps {
    order: CompletedOrder;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedOrder: CompletedOrder) => void;
    menuItems: MenuItem[];
}

export const OrderEditModal: React.FC<OrderEditModalProps> = ({
    order,
    isOpen,
    onClose,
    onSave,
    menuItems
}) => {
    const [editedItems, setEditedItems] = useState<CartItem[]>([]);
    const [selectedAddItem, setSelectedAddItem] = useState<string>('');
    const [isAddNoodle, setIsAddNoodle] = useState(false);

    useEffect(() => {
        if (isOpen && order) {
            setEditedItems(JSON.parse(JSON.stringify(order.items))); // Deep copy
        }
    }, [isOpen, order]);

    if (!isOpen) return null;

    const calculateTotal = (items: CartItem[]) => {
        return items.reduce((sum, item) => sum + (item.basePrice + (item.isAddNoodle ? 10 : 0)) * item.quantity, 0);
    };

    const handleQuantityChange = (index: number, delta: number) => {
        setEditedItems(prev => {
            const newItems = [...prev];
            const newQuantity = newItems[index].quantity + delta;
            if (newQuantity < 1) return prev;
            newItems[index].quantity = newQuantity;
            return newItems;
        });
    };

    const handleRemoveItem = (index: number) => {
        if (window.confirm('確定要移除此品項嗎？')) {
            setEditedItems(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleAddItem = () => {
        if (!selectedAddItem) return;

        const menuItem = menuItems.find(item => item.id === selectedAddItem);
        if (!menuItem) return;

        setEditedItems(prev => {
            // Check if same item exists
            const existingIndex = prev.findIndex(
                item => item.itemId === menuItem.id && item.isAddNoodle === isAddNoodle
            );

            if (existingIndex >= 0) {
                const newItems = [...prev];
                newItems[existingIndex].quantity += 1;
                return newItems;
            }

            return [...prev, {
                itemId: menuItem.id,
                name: menuItem.name,
                basePrice: menuItem.price,
                quantity: 1,
                isAddNoodle: isAddNoodle && menuItem.canAddNoodle,
                remarks: ''
            }];
        });

        // Reset selection
        setSelectedAddItem('');
        setIsAddNoodle(false);
    };

    const handleSave = () => {
        const updatedOrder: CompletedOrder = {
            ...order,
            items: editedItems,
            totalAmount: calculateTotal(editedItems)
        };
        onSave(updatedOrder);
        onClose();
    };

    const groupedMenuItems = menuItems.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {} as Record<Category, MenuItem[]>);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="p-4 border-b flex justify-between items-center bg-amber-50">
                    <h3 className="text-lg font-bold text-amber-900">
                        編輯訂單 #{order.orderNumber}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-amber-100 rounded-full transition-colors">
                        <X size={20} className="text-amber-900" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Add Item Section */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                        <h4 className="font-bold text-gray-700 text-sm">新增品項</h4>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <select
                                className="flex-1 p-2 border rounded-lg text-sm"
                                value={selectedAddItem}
                                onChange={(e) => setSelectedAddItem(e.target.value)}
                            >
                                <option value="">選擇餐點...</option>
                                {Object.entries(groupedMenuItems).map(([category, items]: [string, MenuItem[]]) => (
                                    <optgroup key={category} label={category}>
                                        {items.map(item => (
                                            <option key={item.id} value={item.id}>
                                                {item.name} (${item.price})
                                            </option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>

                            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={isAddNoodle}
                                    onChange={(e) => setIsAddNoodle(e.target.checked)}
                                    disabled={!selectedAddItem || !menuItems.find(i => i.id === selectedAddItem)?.canAddNoodle}
                                    className="rounded text-amber-600 focus:ring-amber-500"
                                />
                                加麵 (+$10)
                            </label>

                            <button
                                onClick={handleAddItem}
                                disabled={!selectedAddItem}
                                className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-bold hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                新增
                            </button>
                        </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-3">
                        {editedItems.map((item, index) => (
                            <div key={`${item.itemId}-${index}`} className="flex items-center justify-between p-3 bg-white border rounded-xl shadow-sm">
                                <div className="flex-1">
                                    <div className="font-bold text-gray-800">
                                        {item.name}
                                        {item.isAddNoodle && <span className="text-amber-600 text-sm ml-1">(+麵)</span>}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        單價: ${item.basePrice + (item.isAddNoodle ? 10 : 0)}
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="備註..."
                                        value={item.remarks}
                                        onChange={(e) => {
                                            const newItems = [...editedItems];
                                            newItems[index].remarks = e.target.value;
                                            setEditedItems(newItems);
                                        }}
                                        className="mt-1 w-full text-xs p-1 border rounded bg-gray-50"
                                    />
                                </div>

                                <div className="flex items-center gap-4 ml-4">
                                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                                        <button
                                            onClick={() => handleQuantityChange(index, -1)}
                                            className="p-1 hover:bg-white rounded-md transition-colors text-gray-600"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange(index, 1)}
                                            className="p-1 hover:bg-white rounded-md transition-colors text-gray-600"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>

                                    <div className="font-bold text-gray-800 w-16 text-right">
                                        ${(item.basePrice + (item.isAddNoodle ? 10 : 0)) * item.quantity}
                                    </div>

                                    <button
                                        onClick={() => handleRemoveItem(index)}
                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
                    <div className="text-lg font-bold text-gray-800">
                        總計: <span className="text-amber-600">${calculateTotal(editedItems)}</span>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            取消
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 shadow-lg shadow-amber-600/20 flex items-center gap-2 transition-all active:scale-95"
                        >
                            <Save size={18} />
                            儲存變更
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
