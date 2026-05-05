/**
 * Fetches custom menu items from the API and merges them into
 * the static DISHES catalog structure.
 *
 * Returns a merged DISHES-like object with the same category keys.
 */
import { DISHES } from '../data/mockData';

export async function fetchCustomMenuItems() {
    try {
        const res = await fetch('/api/menu-items');
        if (res.ok) {
            return await res.json();
        }
    } catch (error) {
        console.error('Error fetching custom menu items:', error);
    }
    return [];
}

/**
 * Convert raw DB menu items into the same shape as static DISHES entries.
 */
export function normalizeCustomItems(dbItems) {
    return dbItems.map(item => ({
        id: item.dish_id,
        name: item.name,
        costPerHead: parseFloat(item.cost_per_head),
        priceAdj: parseFloat(item.price_adj),
        image: item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400',
        isBestSeller: item.is_best_seller,
        description: item.description || '',
        _isCustom: true,
    }));
}

/**
 * Returns a merged DISHES object that includes both static and custom items.
 */
export function getMergedDishes(customItems = []) {
    const merged = {};
    Object.keys(DISHES).forEach(category => {
        const dbForCategory = customItems.filter(item => item.category === category);
        merged[category] = [
            ...DISHES[category],
            ...normalizeCustomItems(dbForCategory),
        ];
    });
    return merged;
}
