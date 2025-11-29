import React, { useState } from 'react';
import { MenuItem } from '../types';
import { Plus, Check } from 'lucide-react';

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, isAddNoodle: boolean) => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({ item, onAddToCart }) => {
  const [isAddNoodle, setIsAddNoodle] = useState(false);
  const [isAddedAnimation, setIsAddedAnimation] = useState(false);

  const handleAddClick = () => {
    onAddToCart(item, isAddNoodle);
    setIsAddedAnimation(true);
    setTimeout(() => setIsAddedAnimation(false), 500);
    // Reset selection after adding
    setIsAddNoodle(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-4 flex flex-col justify-between h-full transition-transform hover:scale-[1.01] active:scale-[0.99]">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-800 leading-tight">{item.name}</h3>
        </div>
        <p className="text-amber-700 font-bold text-xl">
          ${item.price}
        </p>
      </div>

      <div className="mt-4 space-y-3">
        {item.canAddNoodle && (
          <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer select-none">
            <div className="relative flex items-center">
              <input 
                type="checkbox" 
                checked={isAddNoodle}
                onChange={(e) => setIsAddNoodle(e.target.checked)}
                className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 transition-all checked:border-amber-600 checked:bg-amber-600"
              />
              <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                <Check size={14} strokeWidth={3} />
              </div>
            </div>
            <span>加麵 (+$10)</span>
          </label>
        )}

        <button
          onClick={handleAddClick}
          className={`w-full py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 font-medium transition-all duration-200
            ${isAddedAnimation 
              ? 'bg-green-600 text-white' 
              : 'bg-amber-50 text-amber-700 hover:bg-amber-100 active:bg-amber-200'
            }`}
        >
          {isAddedAnimation ? (
            <>
              <Check size={18} />
              <span>已加入</span>
            </>
          ) : (
            <>
              <Plus size={18} />
              <span>加入</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
