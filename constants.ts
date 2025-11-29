import { Category, MenuItem } from './types';

export const MENU_ITEMS: MenuItem[] = [
  // 麵類 (Noodles) - canAddNoodle: true
  { id: 'n1', name: '蝦多多鍋燒麵', price: 200, category: Category.NOODLES, canAddNoodle: true },
  { id: 'n2', name: '海鮮意麵', price: 140, category: Category.NOODLES, canAddNoodle: true },
  { id: 'n3', name: '海鮮冬粉', price: 140, category: Category.NOODLES, canAddNoodle: true },
  { id: 'n4', name: '海鮮烏龍麵', price: 140, category: Category.NOODLES, canAddNoodle: true },
  { id: 'n5', name: '海鮮雞絲麵', price: 140, category: Category.NOODLES, canAddNoodle: true },
  { id: 'n6', name: '牛奶意麵', price: 100, category: Category.NOODLES, canAddNoodle: true },
  { id: 'n7', name: '牛奶雞絲麵', price: 100, category: Category.NOODLES, canAddNoodle: true },
  { id: 'n8', name: '牛奶冬粉', price: 100, category: Category.NOODLES, canAddNoodle: true },
  { id: 'n9', name: '牛奶烏龍麵', price: 100, category: Category.NOODLES, canAddNoodle: true },
  { id: 'n10', name: '鍋燒意麵', price: 90, category: Category.NOODLES, canAddNoodle: true },
  { id: 'n11', name: '鍋燒冬粉', price: 90, category: Category.NOODLES, canAddNoodle: true },
  { id: 'n12', name: '鍋燒烏龍麵', price: 90, category: Category.NOODLES, canAddNoodle: true },
  { id: 'n13', name: '鍋燒泡麵', price: 90, category: Category.NOODLES, canAddNoodle: true },
  { id: 'n14', name: '鍋燒雞絲麵', price: 90, category: Category.NOODLES, canAddNoodle: true },

  // 飯・粥類 (Rice/Porridge)
  { id: 'r1', name: '海鮮粥', price: 140, category: Category.RICE_PORRIDGE, canAddNoodle: false },
  { id: 'r2', name: '松板豬肉粥', price: 120, category: Category.RICE_PORRIDGE, canAddNoodle: false },
  { id: 'r3', name: '魚肚粥', price: 100, category: Category.RICE_PORRIDGE, canAddNoodle: false },
  { id: 'r4', name: '鮮蚵蛤蜊粥', price: 90, category: Category.RICE_PORRIDGE, canAddNoodle: false },
  { id: 'r5', name: '鍋燒粥', price: 90, category: Category.RICE_PORRIDGE, canAddNoodle: false },
  { id: 'r6', name: '雞腿粥', price: 90, category: Category.RICE_PORRIDGE, canAddNoodle: false },
  { id: 'r7', name: '排骨飯', price: 70, category: Category.RICE_PORRIDGE, canAddNoodle: false },
  { id: 'r8', name: '豬油拌飯', price: 35, category: Category.RICE_PORRIDGE, canAddNoodle: false },
  { id: 'r9', name: '魯肉飯', price: 35, category: Category.RICE_PORRIDGE, canAddNoodle: false },
  { id: 'r10', name: '白飯', price: 10, category: Category.RICE_PORRIDGE, canAddNoodle: false },

  // 小菜類 (Side Dishes)
  { id: 's1', name: '香煎魚肚', price: 160, category: Category.SIDES, canAddNoodle: false },
  { id: 's2', name: '鹽蒸海蝦', price: 130, category: Category.SIDES, canAddNoodle: false },
  { id: 's3', name: '川燙小卷', price: 100, category: Category.SIDES, canAddNoodle: false },
  { id: 's4', name: '香煎松板豬', price: 100, category: Category.SIDES, canAddNoodle: false },
  { id: 's5', name: '蒜泥白肉', price: 100, category: Category.SIDES, canAddNoodle: false },
  { id: 's6', name: '鮮蚵煎蛋', price: 110, category: Category.SIDES, canAddNoodle: false },
  { id: 's7', name: '蔥爆蛋', price: 60, category: Category.SIDES, canAddNoodle: false },
  { id: 's8', name: '川燙魚皮', price: 60, category: Category.SIDES, canAddNoodle: false },
  { id: 's9', name: '炸排骨', price: 50, category: Category.SIDES, canAddNoodle: false },
  { id: 's10', name: '燙青菜', price: 30, category: Category.SIDES, canAddNoodle: false },
  { id: 's11', name: '荷包蛋', price: 15, category: Category.SIDES, canAddNoodle: false },

  // 湯類 (Soups)
  { id: 't1', name: '海鮮湯', price: 120, category: Category.SOUPS, canAddNoodle: false },
  { id: 't2', name: '魚肚湯', price: 80, category: Category.SOUPS, canAddNoodle: false },
  { id: 't3', name: '蛤蜊湯', price: 50, category: Category.SOUPS, canAddNoodle: false },
  { id: 't4', name: '鮮蚵湯', price: 50, category: Category.SOUPS, canAddNoodle: false },
  { id: 't5', name: '蛋花湯', price: 30, category: Category.SOUPS, canAddNoodle: false },
];

export const CATEGORIES_ORDER = [
  Category.NOODLES,
  Category.RICE_PORRIDGE,
  Category.SIDES,
  Category.SOUPS,
];