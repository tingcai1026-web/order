import React, { useState, useMemo, useEffect } from 'react';
import { CATEGORIES_ORDER, MENU_ITEMS } from './constants';
import { Category, MenuItem, CartItem, OrderType, CompletedOrder } from './types';
import { MenuCard } from './components/MenuCard';
import { CartDrawer } from './components/CartDrawer';
import { OrderConfirmation } from './components/OrderConfirmation';
import { AdminDashboard } from './components/AdminDashboard';
import { ShoppingCart, Phone, MapPin, Search, ClipboardList } from 'lucide-react';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>(Category.NOODLES);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('tainan_nabeyaki_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [orderType, setOrderType] = useState<OrderType>('dine-in');
  const [searchTerm, setSearchTerm] = useState('');
  const [completedOrder, setCompletedOrder] = useState<CompletedOrder | null>(null);

  // Initialize history from local storage
  const [orderHistory, setOrderHistory] = useState<CompletedOrder[]>(() => {
    const savedOrders = localStorage.getItem('tainan_nabeyaki_orders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  // Initialize menu items from localStorage or constants
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const savedMenu = localStorage.getItem('tainan_nabeyaki_menu');
    return savedMenu ? JSON.parse(savedMenu) : MENU_ITEMS;
  });

  // Save menu items to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('tainan_nabeyaki_menu', JSON.stringify(menuItems));
  }, [menuItems]);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('tainan_nabeyaki_cart', JSON.stringify(cart));
  }, [cart]);

  // Save history to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('tainan_nabeyaki_orders', JSON.stringify(orderHistory));
  }, [orderHistory]);

  // Group items by category for rendering
  const itemsByCategory = useMemo(() => {
    return menuItems.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<Category, MenuItem[]>);
  }, [menuItems]);

  const handleAddMenuItem = (newItem: MenuItem) => {
    setMenuItems(prev => [...prev, newItem]);
  };

  const handleUpdateMenuItem = (updatedItem: MenuItem) => {
    setMenuItems(prev => prev.map(item =>
      item.id === updatedItem.id ? updatedItem : item
    ));
  };

  const handleUpdateOrder = (updatedOrder: CompletedOrder) => {
    setOrderHistory(prev => prev.map(order =>
      order.orderNumber === updatedOrder.orderNumber ? updatedOrder : order
    ));
  };

  const addToCart = (item: MenuItem, isAddNoodle: boolean) => {
    setCart(prev => {
      // Check if exact item with same options exists
      const existingIndex = prev.findIndex(
        cartItem => cartItem.itemId === item.id && cartItem.isAddNoodle === isAddNoodle
      );

      if (existingIndex >= 0) {
        const newCart = [...prev];
        newCart[existingIndex].quantity += 1;
        return newCart;
      }

      return [...prev, {
        itemId: item.id,
        name: item.name,
        basePrice: item.price,
        quantity: 1,
        isAddNoodle,
        remarks: ''
      }];
    });
  };

  const updateQuantity = (index: number, delta: number) => {
    setCart(prev => {
      const newCart = [...prev];
      const newQuantity = newCart[index].quantity + delta;
      if (newQuantity < 1) return prev;
      newCart[index].quantity = newQuantity;
      return newCart;
    });
  };

  const updateRemarks = (index: number, text: string) => {
    setCart(prev => {
      const newCart = [...prev];
      newCart[index].remarks = text;
      return newCart;
    });
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const handleCheckout = () => {
    const total = cart.reduce((sum, item) => sum + (item.basePrice + (item.isAddNoodle ? 10 : 0)) * item.quantity, 0);

    // Generate a random 3-digit order number for demo purposes
    const randomOrderNumber = Math.floor(Math.random() * 900 + 100).toString();

    const newOrder: CompletedOrder = {
      orderNumber: randomOrderNumber,
      items: [...cart], // Copy cart items
      totalAmount: total,
      orderType: orderType,
      timestamp: new Date()
    };

    setCompletedOrder(newOrder);
    setOrderHistory(prev => [...prev, newOrder]); // Add to history
    setCart([]); // Clear cart
    setIsCartOpen(false); // Close cart drawer
  };

  const handleCloseConfirmation = () => {
    setCompletedOrder(null);
  };

  const handleClearHistory = () => {
    setOrderHistory([]);
    localStorage.removeItem('tainan_nabeyaki_orders');
    setIsAdminOpen(false);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Filter items based on search
  const filteredItems = (items: MenuItem[]) => {
    if (!searchTerm) return items;
    return items.filter(item => item.name.includes(searchTerm));
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="bg-amber-800 text-amber-50 shadow-lg sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">台南古早味 鍋燒</h1>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-amber-100 text-sm mt-1">
                  <a href="tel:0933038130" className="flex items-center gap-1 hover:text-amber-50 transition-colors">
                    <Phone size={14} /> 0933-038-130
                  </a>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=大里區文化街83-1號"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 hover:text-amber-50 transition-colors"
                  >
                    <MapPin size={14} /> 大里區文化街83-1號
                  </a>
                </div>
              </div>

              {/* Mobile Admin Button (visible on small screens next to title) */}
              <button
                onClick={() => setIsAdminOpen(true)}
                className="md:hidden p-2 text-amber-200 hover:text-amber-50 bg-amber-900/40 rounded-full"
              >
                <ClipboardList size={20} />
              </button>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              {/* Search Bar */}
              <div className="relative flex-1 md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-amber-200" />
                </div>
                <input
                  type="text"
                  placeholder="搜尋菜單..."
                  className="w-full bg-amber-900 text-amber-50 placeholder-amber-200 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-amber-950 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Desktop Admin Button */}
              <button
                onClick={() => setIsAdminOpen(true)}
                className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-medium text-amber-100 hover:text-amber-50 bg-amber-900 hover:bg-amber-700 rounded-lg transition-colors"
                title="營運報表"
              >
                <ClipboardList size={18} />
                <span>報表</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="bg-amber-50/10 backdrop-blur-md overflow-x-auto no-scrollbar">
          <div className="max-w-4xl mx-auto px-4 flex whitespace-nowrap">
            {CATEGORIES_ORDER.map(category => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  setSearchTerm('');
                  document.getElementById(category)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`py-3 px-4 text-sm font-bold border-b-2 transition-colors ${activeCategory === category
                  ? 'border-amber-50 text-amber-50'
                  : 'border-transparent text-amber-100 hover:text-amber-50'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-8">
        {CATEGORIES_ORDER.map(category => {
          const items = itemsByCategory[category] || [];
          const displayItems = filteredItems(items);

          if (displayItems.length === 0) return null;

          return (
            <section key={category} id={category} className="scroll-mt-36">
              <div className="flex items-center gap-4 mb-4">
                <h2 className="text-xl font-bold text-gray-800 border-l-4 border-amber-700 pl-3">
                  {category}
                </h2>
                <div className="h-px bg-gray-200 flex-1"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {displayItems.map(item => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            </section>
          );
        })}

        {/* Empty Search State */}
        {menuItems.filter(item => item.name.includes(searchTerm)).length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>找不到符合 "{searchTerm}" 的餐點</p>
          </div>
        )}
      </main>

      {/* Floating Cart Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsCartOpen(true)}
          className="bg-amber-900 text-amber-50 rounded-full p-4 shadow-2xl hover:bg-amber-800 transition-transform hover:scale-105 active:scale-95 flex items-center gap-3 pr-6 relative group"
        >
          <div className="relative">
            <ShoppingCart size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-600 text-amber-50 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-amber-900 animate-bounce">
                {totalItems}
              </span>
            )}
          </div>
          <span className="font-bold">
            查看購物車
          </span>
          {cart.length > 0 && (
            <span className="border-l border-amber-800 pl-3 text-sm font-normal text-amber-100">
              ${cart.reduce((sum, item) => sum + (item.basePrice + (item.isAddNoodle ? 10 : 0)) * item.quantity, 0)}
            </span>
          )}
        </button>
      </div>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQuantity={updateQuantity}
        updateRemarks={updateRemarks}
        removeFromCart={removeFromCart}
        orderType={orderType}
        setOrderType={setOrderType}
        onCheckout={handleCheckout}
      />

      {/* Order Confirmation Modal */}
      {completedOrder && (
        <OrderConfirmation
          order={completedOrder}
          onClose={handleCloseConfirmation}
        />
      )}

      {/* Admin Dashboard */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        orders={orderHistory}
        onClearHistory={handleClearHistory}
        menuItems={menuItems}
        onUpdateMenuItem={handleUpdateMenuItem}
        onAddMenuItem={handleAddMenuItem}
        onUpdateOrder={handleUpdateOrder}
      />
    </div>
  );
};

export default App;
