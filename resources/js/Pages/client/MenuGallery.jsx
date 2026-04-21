import { useState } from 'react';
import { DISHES } from '../../data/mockData';

const MenuGallery = () => {
    const [activeCategory, setActiveCategory] = useState('all');

    const categories = [
        { id: 'all', label: 'All Dishes' },
        { id: 'starters', label: 'Starters' },
        { id: 'mains', label: 'Main Courses' },
        { id: 'sides', label: 'Sides' },
        { id: 'desserts', label: 'Desserts' },
        { id: 'drinks', label: 'Refreshments' },
    ];

    // Flatten dishes for "All" view or filter by category
    const getDisplayedDishes = () => {
        if (activeCategory === 'all') {
            return Object.entries(DISHES).reduce((acc, [cat, items]) => {
                return [...acc, ...items.map(item => ({ ...item, category: cat }))];
            }, []);
        }
        return DISHES[activeCategory].map(item => ({ ...item, category: activeCategory }));
    };

    const displayedDishes = getDisplayedDishes();
    const bestSellers = Object.values(DISHES).flat().filter(d => d.isBestSeller);

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-red-900 py-20 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 mt-16">
                    Our Authenticated Menu
                </h1>
                <p className="text-red-100 max-w-2xl mx-auto text-lg font-light">
                    Explore our diverse selection of exquisite dishes, crafted to perfection for your special events.
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Best Sellers Section (Only show on 'all' view) */}
                {activeCategory === 'all' && (
                    <div className="mb-20">
                        <div className="flex items-center mb-8">
                            <span className="w-1 h-8 bg-yellow-500 mr-4"></span>
                            <h2 className="text-2xl font-bold font-display text-gray-900">Best Sellers</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {bestSellers.slice(0, 4).map(dish => (
                                <div key={dish.id} className="group relative rounded-xl overflow-hidden shadow-lg aspect-w-1 aspect-h-1">
                                    <img
                                        src={dish.image}
                                        alt={dish.name}
                                        className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400'; }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
                                    <div className="absolute bottom-0 left-0 p-4">
                                        <span className="bg-yellow-500 text-red-900 text-xs font-bold px-2 py-1 rounded-full mb-2 inline-block">Best Seller</span>
                                        <h3 className="text-white font-bold text-lg leading-tight">{dish.name}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Category Navigation */}
                <div className="flex overflow-x-auto pb-4 mb-8 border-b border-gray-100 space-x-2 md:justify-center custom-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeCategory === cat.id
                                ? 'bg-red-900 text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn">
                    {displayedDishes.map(dish => (
                        <div key={dish.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={dish.image}
                                    alt={dish.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400'; }}
                                />
                                {dish.isBestSeller && (
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-1 rounded-full shadow-sm">
                                        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                    </div>
                                )}
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{dish.category || activeCategory}</span>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{dish.name}</h3>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{dish.description}</p>

                                <div className="mt-auto flex justify-between items-center border-t border-gray-50 pt-4">
                                    <span className="text-sm font-medium text-gray-400">Upgrade Price</span>
                                    <span className={`font-bold ${dish.priceAdj > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        {dish.priceAdj > 0 ? `+₱${dish.priceAdj}` : 'Included'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MenuGallery;
