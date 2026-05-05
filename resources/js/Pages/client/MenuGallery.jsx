import { useState, useMemo } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { DISHES } from '../../data/mockData';

const MenuGallery = () => {
    const { auth } = usePage().props;
    const user = auth?.user || null;
    const [activeCategory, setActiveCategory] = useState('all');
    const [priceFilter, setPriceFilter] = useState('all');
    const [sortOrder, setSortOrder] = useState('default');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Menu', path: '/menu' },
    ];

    const categories = [
        { id: 'all', label: 'All Dishes' },
        { id: 'starters', label: 'Starters' },
        { id: 'mains', label: 'Main Courses' },
        { id: 'sides', label: 'Sides' },
        { id: 'desserts', label: 'Desserts' },
        { id: 'drinks', label: 'Refreshments' },
    ];

    const priceRanges = [
        { id: 'all', label: 'All Prices' },
        { id: 'under50', label: 'Under ₱50', min: 0, max: 49 },
        { id: '50to80', label: '₱50 – ₱80', min: 50, max: 80 },
        { id: '80to120', label: '₱80 – ₱120', min: 80, max: 120 },
        { id: 'above120', label: '₱120+', min: 120, max: Infinity },
    ];

    const sortOptions = [
        { id: 'default', label: 'Default' },
        { id: 'cheapest', label: 'Cheapest First' },
        { id: 'expensive', label: 'Most Expensive First' },
    ];

    // Flatten dishes for "All" view or filter by category
    const displayedDishes = useMemo(() => {
        let dishes;
        if (activeCategory === 'all') {
            dishes = Object.entries(DISHES).reduce((acc, [cat, items]) => {
                return [...acc, ...items.map(item => ({ ...item, category: cat }))];
            }, []);
        } else {
            dishes = DISHES[activeCategory].map(item => ({ ...item, category: activeCategory }));
        }

        // Apply price filter
        if (priceFilter !== 'all') {
            const range = priceRanges.find(r => r.id === priceFilter);
            if (range) {
                dishes = dishes.filter(d => d.costPerHead >= range.min && d.costPerHead <= range.max);
            }
        }

        // Apply sort
        if (sortOrder === 'cheapest') {
            dishes = [...dishes].sort((a, b) => a.costPerHead - b.costPerHead);
        } else if (sortOrder === 'expensive') {
            dishes = [...dishes].sort((a, b) => b.costPerHead - a.costPerHead);
        }

        return dishes;
    }, [activeCategory, priceFilter, sortOrder]);

    const bestSellers = Object.values(DISHES).flat().filter(d => d.isBestSeller);

    // Get price range for display
    const allPrices = Object.values(DISHES).flat().map(d => d.costPerHead);
    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);

    return (
        <div className="min-h-screen bg-white">
            {/* Navbar */}
            <nav className="bg-red-900 shadow-lg py-4 relative z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/" className="text-2xl font-bold font-display text-white tracking-wide italic">
                                Eloquente Catering
                            </Link>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.path}
                                    className="text-white hover:text-yellow-400 font-medium text-sm uppercase tracking-wider transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}

                            <div className="border-l border-white/30 h-6 mx-4"></div>

                            {user ? (
                                <div className="flex items-center space-x-4">
                                    <span className="text-white text-sm mr-2">Hello, {user.username}</span>
                                    <Link
                                        href={
                                            user.role === 'Client' ? '/dashboard/client' :
                                                user.role === 'Marketing' ? '/dashboard/ops' :
                                                    user.role === 'Accounting' ? '/dashboard/finance' :
                                                        (user.role === 'Admin') ? '/dashboard/admin' : '/'
                                        }
                                        className="text-white hover:text-yellow-400 text-sm font-medium uppercase tracking-wider"
                                    >
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={() => router.post('/logout')}
                                        className="bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-6 rounded-full text-xs uppercase tracking-wider transition-all border border-white/30"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link href="/login" className="text-white hover:text-yellow-400 text-sm font-medium uppercase tracking-wider">
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="bg-yellow-500 hover:bg-yellow-400 text-red-900 font-bold py-2 px-6 rounded-full text-xs uppercase tracking-wider transition-transform transform hover:scale-105 shadow-lg"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="text-white hover:text-gray-200 focus:outline-none"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {isMobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-red-800 absolute top-full left-0 w-full shadow-xl">
                        <div className="px-4 pt-2 pb-4 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block text-white hover:bg-red-700 px-3 py-2 rounded-md text-base font-medium"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            {user ? (
                                <>
                                    <Link href="/dashboard/client" className="block text-white hover:bg-red-700 px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={() => { router.post('/logout'); setIsMobileMenuOpen(false); }}
                                        className="w-full text-left text-white hover:bg-red-700 px-3 py-2 rounded-md text-base font-medium"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="mt-4 flex flex-col space-y-2">
                                    <Link href="/login" className="block text-center text-white border border-white/30 px-3 py-2 rounded-md" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                                    <Link href="/register" className="block text-center bg-yellow-500 text-red-900 px-3 py-2 rounded-md font-bold" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Header */}
            <div className="bg-red-900 py-16 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                    Our Curated Menu
                </h1>
                <p className="text-red-100 max-w-2xl mx-auto text-lg font-light">
                    Explore our diverse selection of exquisite dishes, crafted to perfection for your special events.
                </p>
                <p className="text-yellow-400 mt-3 text-sm font-medium">
                    Price range: ₱{minPrice} – ₱{maxPrice} per head
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Best Sellers Section (Only show on 'all' view) */}
                {activeCategory === 'all' && priceFilter === 'all' && sortOrder === 'default' && (
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
                                        <p className="text-yellow-300 text-sm font-semibold mt-1">₱{dish.costPerHead}/head</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Category Navigation */}
                <div className="flex overflow-x-auto pb-4 mb-6 border-b border-gray-100 space-x-2 md:justify-center custom-scrollbar">
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

                {/* Filters & Sort Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 bg-gray-50 rounded-xl p-4 border border-gray-100">
                    {/* Price Range Filter */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            <svg className="w-4 h-4 inline mr-1 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                            Price:
                        </span>
                        <div className="flex gap-1.5 flex-wrap">
                            {priceRanges.map(range => (
                                <button
                                    key={range.id}
                                    onClick={() => setPriceFilter(range.id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${priceFilter === range.id
                                        ? 'bg-red-900 text-white shadow-sm'
                                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                        }`}
                                >
                                    {range.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sort */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            <svg className="w-4 h-4 inline mr-1 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
                            Sort:
                        </span>
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-red-900 cursor-pointer"
                        >
                            {sortOptions.map(opt => (
                                <option key={opt.id} value={opt.id}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Results count */}
                <p className="text-sm text-gray-400 mb-6">
                    Showing {displayedDishes.length} {displayedDishes.length === 1 ? 'dish' : 'dishes'}
                    {priceFilter !== 'all' && ` in ${priceRanges.find(r => r.id === priceFilter)?.label}`}
                    {sortOrder !== 'default' && ` · Sorted by ${sortOptions.find(s => s.id === sortOrder)?.label.toLowerCase()}`}
                </p>

                {/* Main Grid */}
                {displayedDishes.length > 0 ? (
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
                                        <span className="text-sm font-medium text-gray-400">Price per head</span>
                                        <span className="font-bold text-red-900 text-lg">
                                            ₱{dish.costPerHead}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        <h3 className="text-lg font-bold text-gray-400 mb-2">No dishes found</h3>
                        <p className="text-gray-400 text-sm">Try adjusting your filters to see more dishes.</p>
                        <button
                            onClick={() => { setPriceFilter('all'); setSortOrder('default'); }}
                            className="mt-4 px-6 py-2 bg-red-900 text-white text-sm font-bold rounded-full hover:bg-red-800 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MenuGallery;
