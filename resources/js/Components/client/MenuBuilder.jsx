import { useState, useEffect, useMemo } from 'react';
import { DISHES, CURATED_PACKAGES } from '../../data/mockData';
import { fetchCustomMenuItems, getMergedDishes } from '../../utils/menuUtils';

const TabIcon = ({ type, className = 'w-4 h-4' }) => {
    const icons = {
        starters: <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m18-4.5a9 9 0 11-18 0" /></svg>,
        mains: <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1.001A3.75 3.75 0 0012 18z" /></svg>,
        sides: <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>,
        desserts: <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513M6 13.121v3.629c0 1.135.845 2.098 1.976 2.192a48.424 48.424 0 008.048 0c1.131-.094 1.976-1.057 1.976-2.192v-3.629" /></svg>,
        drinks: <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" /></svg>
    };
    return icons[type] || null;
};

const CATEGORY_TABS = [
    { key: 'starters', label: 'Starters' },
    { key: 'mains', label: 'Main Course' },
    { key: 'sides', label: 'Sides' },
    { key: 'desserts', label: 'Dessert' },
    { key: 'drinks', label: 'Refreshments' }
];

const MenuBuilder = ({ bookingData, updateBooking, onNext, onBack }) => {
    const { pax, selectedDishes: existingDishes } = bookingData;
    const [phase, setPhase] = useState('budget'); // 'budget' | 'path' | 'menu'
    const [budget, setBudget] = useState(bookingData.budget || '');
    const [hasBudget, setHasBudget] = useState(false);
    const [activeTab, setActiveTab] = useState('starters');
    const [selections, setSelections] = useState({
        starters: [],
        mains: [],
        sides: [],
        desserts: [],
        drinks: []
    });

    // Pricing overrides from server
    const [pricingOverrides, setPricingOverrides] = useState({});
    const [customItems, setCustomItems] = useState([]);

    useEffect(() => {
        const fetchOverrides = async () => {
            try {
                const res = await fetch('/api/pricing');
                if (res.ok) {
                    const data = await res.json();
                    setPricingOverrides(data.overrides || {});
                }
            } catch (error) {
                console.error("Error fetching pricing overrides:", error);
            }
        };
        fetchOverrides();
        fetchCustomMenuItems().then(items => setCustomItems(items));
    }, []);

    // Merged static + custom dishes
    const mergedDishes = useMemo(() => getMergedDishes(customItems), [customItems]);

    // Restore existing selections if coming back
    useEffect(() => {
        if (existingDishes && Object.keys(existingDishes).some(k => existingDishes[k]?.length > 0)) {
            setSelections({
                starters: existingDishes.starters || [],
                mains: existingDishes.mains || [],
                sides: existingDishes.sides || [],
                desserts: existingDishes.desserts || [],
                drinks: existingDishes.drinks || []
            });
            setPhase('menu');
        }
    }, []);

    // Get effective cost per head for a dish
    const getDishCost = (dish) => {
        const overrideId = `dish_${dish.id}`;
        if (pricingOverrides[overrideId] !== undefined) {
            return pricingOverrides[overrideId];
        }
        return dish.costPerHead;
    };

    // Calculate total from selections
    const menuTotal = useMemo(() => {
        let total = 0;
        Object.keys(selections).forEach(category => {
            selections[category].forEach(id => {
                const dish = mergedDishes[category]?.find(d => d.id === id);
                if (dish) total += getDishCost(dish) * (pax || 0);
            });
        });
        return total;
    }, [selections, pax, pricingOverrides]);

    // Update parent whenever selections change
    useEffect(() => {
        if (phase === 'menu') {
            updateBooking({
                selectedDishes: selections,
                totalCost: menuTotal
            });
        }
    }, [selections, menuTotal, phase]);

    // Per-category dish limits
    const CATEGORY_LIMITS = {
        starters: 3,
        mains: 4,
        sides: 4,
        desserts: 4,
        drinks: 3
    };

    // Toggle a dish selection (with category limit enforcement)
    const toggleDish = (category, dishId) => {
        setSelections(prev => {
            const currentList = prev[category];
            if (currentList.includes(dishId)) {
                return { ...prev, [category]: currentList.filter(id => id !== dishId) };
            } else {
                // Check limit
                const limit = CATEGORY_LIMITS[category] || 5;
                if (currentList.length >= limit) {
                    return prev; // Don't add — limit reached
                }
                return { ...prev, [category]: [...currentList, dishId] };
            }
        });
    };

    // Budget Maximizer: round-robin across categories to spread dishes evenly
    const applyBudgetMaximizer = () => {
        if (!budget || !pax) return;
        const totalBudget = parseInt(budget);
        const newSelections = { starters: [], mains: [], sides: [], desserts: [], drinks: [] };
        let runningTotal = 0;

        const categories = ['starters', 'mains', 'sides', 'desserts', 'drinks'];

        // Build sorted dish lists per category (most expensive first to maximize budget usage)
        const categoryQueues = {};
        categories.forEach(cat => {
            categoryQueues[cat] = [...(mergedDishes[cat] || [])]
                .map(dish => ({
                    ...dish,
                    category: cat,
                    totalCost: getDishCost(dish) * pax
                }))
                .sort((a, b) => b.totalCost - a.totalCost); // expensive first
        });

        // Round-robin: cycle through categories, picking one dish at a time from each
        let changed = true;
        while (changed) {
            changed = false;
            for (const cat of categories) {
                const limit = CATEGORY_LIMITS[cat] || 5;
                if (newSelections[cat].length >= limit) continue; // Category full

                // Find the next best dish in this category that fits the budget
                const queue = categoryQueues[cat];
                let picked = false;
                for (let i = 0; i < queue.length; i++) {
                    const dish = queue[i];
                    if (newSelections[cat].includes(dish.id)) continue; // Already selected
                    if (runningTotal + dish.totalCost <= totalBudget) {
                        newSelections[cat].push(dish.id);
                        runningTotal += dish.totalCost;
                        picked = true;
                        changed = true;
                        break;
                    }
                }

                // If most expensive doesn't fit, try cheaper ones
                if (!picked) {
                    const cheapQueue = [...queue].reverse();
                    for (const dish of cheapQueue) {
                        if (newSelections[cat].includes(dish.id)) continue;
                        if (runningTotal + dish.totalCost <= totalBudget) {
                            newSelections[cat].push(dish.id);
                            runningTotal += dish.totalCost;
                            changed = true;
                            break;
                        }
                    }
                }
            }
        }

        // Fallback: if budget is too low for even one per category, pick cheapest from each
        const totalPicked = Object.values(newSelections).reduce((sum, arr) => sum + arr.length, 0);
        if (totalPicked === 0) {
            categories.forEach(cat => {
                const sorted = [...(mergedDishes[cat] || [])].sort((a, b) => getDishCost(a) - getDishCost(b));
                if (sorted.length > 0) {
                    const cheapest = sorted[0];
                    const cost = getDishCost(cheapest) * pax;
                    if (runningTotal + cost <= totalBudget * 1.1) {
                        newSelections[cat].push(cheapest.id);
                        runningTotal += cost;
                    }
                }
            });
        }

        setSelections(newSelections);
        setPhase('menu');
    };

    // Apply a curated package
    const applyCuratedPackage = (pkg) => {
        setSelections({ ...pkg.prefilledDishes });
        setPhase('menu');
    };

    // Apply blank canvas
    const applyBlankCanvas = () => {
        setSelections({ starters: [], mains: [], sides: [], desserts: [], drinks: [] });
        setPhase('menu');
    };

    const handleBuildMenu = () => {
        setHasBudget(true);
        updateBooking({ budget: parseInt(budget) || 0 });
        setPhase('path');
    };

    const handleSkipBudget = () => {
        setHasBudget(false);
        updateBooking({ budget: 0 });
        setPhase('path');
    };

    const handleConfirmMenu = () => {
        const totalDishes = Object.values(selections).reduce((sum, arr) => sum + arr.length, 0);
        if (totalDishes === 0) return;

        // Build full menu selection with dish objects for submission, including any pricing overrides
        const fullMenuSelection = {};
        Object.keys(selections).forEach(cat => {
            fullMenuSelection[cat] = selections[cat].map(id => {
                const dish = mergedDishes[cat].find(d => d.id === id);
                return {
                    ...dish,
                    costPerHead: getDishCost(dish),
                    priceAdj: getDishCost(dish)
                };
            });
        });

        updateBooking({
            selectedDishes: selections,
            customMenu: fullMenuSelection,
            totalCost: menuTotal,
            budget: budget ? parseInt(budget) : 0
        });
        onNext();
    };

    const totalDishCount = Object.values(selections).reduce((sum, arr) => sum + arr.length, 0);

    // ==========================================
    // PHASE: BUDGET ENTRY
    // ==========================================
    if (phase === 'budget') {
        return (
            <div className="flex flex-col h-full justify-between animate-fadeIn">
                <div className="space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-display font-bold text-gray-900">
                            Let's Build Your Menu
                        </h2>
                        <p className="text-gray-500 mt-2">
                            Do you have a target budget in mind? This helps us suggest the best dishes for you.
                        </p>
                    </div>

                    <div className="max-w-lg mx-auto space-y-6 mt-10">
                        <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                            <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                                Target Budget (PHP)
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-lg">₱</span>
                                <input
                                    type="number"
                                    min="0"
                                    step="1000"
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                    placeholder="e.g. 50000"
                                    className="w-full pl-10 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none shadow-sm text-gray-900 font-bold text-xl"
                                />
                            </div>
                            {budget && pax && (
                                <p className="text-sm text-primary-600 mt-3 font-medium text-center">
                                    ≈ ₱{Math.round(parseInt(budget) / pax).toLocaleString()} per head for {pax} guests
                                </p>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleBuildMenu}
                                disabled={!budget || parseInt(budget) <= 0}
                                className={`flex-1 py-4 rounded-xl font-bold shadow-lg transition-all transform active:scale-95 flex items-center justify-center ${budget && parseInt(budget) > 0
                                    ? 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-xl'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                Build My Menu
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </button>
                            <button
                                onClick={handleSkipBudget}
                                className="px-8 py-4 rounded-xl font-bold text-gray-500 border-2 border-gray-200 hover:border-gray-300 hover:text-gray-700 transition-all"
                            >
                                Skip
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-start pt-12 items-center border-t border-gray-100 mt-8">
                    <button
                        onClick={onBack}
                        className="text-gray-500 font-bold hover:text-gray-800 px-6 py-3 transition-colors flex items-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                    </button>
                </div>
            </div>
        );
    }

    // ==========================================
    // PHASE: PATH SELECTION
    // ==========================================
    if (phase === 'path') {
        return (
            <div className="flex flex-col h-full justify-between animate-fadeIn">
                <div className="space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-display font-bold text-gray-900">
                            Choose Your Approach
                        </h2>
                        <p className="text-gray-500 mt-2">
                            {hasBudget
                                ? `With your ₱${parseInt(budget).toLocaleString()} budget, how would you like to build your menu?`
                                : 'How would you like to build your menu?'
                            }
                        </p>
                    </div>

                    <div className={`grid grid-cols-1 ${hasBudget ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6 max-w-4xl mx-auto mt-8`}>
                        {/* Budget Maximizer - only when budget is entered */}
                        {hasBudget && (
                            <button
                                onClick={applyBudgetMaximizer}
                                className="group text-left p-8 rounded-2xl border-2 border-gray-100 bg-white hover:border-primary-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4 text-primary-600 group-hover:bg-primary-100 transition-colors">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Budget Maximizer</h3>
                                <p className="text-sm text-gray-500 mb-3">Smart assisted selection</p>
                                <p className="text-xs text-gray-400">
                                    We'll automatically pick the best dishes that fit your ₱{parseInt(budget).toLocaleString()} budget. You can modify everything after.
                                </p>
                                <div className="mt-4 text-primary-600 font-semibold text-sm flex items-center group-hover:translate-x-1 transition-transform">
                                    Auto-fill menu →
                                </div>
                            </button>
                        )}

                        {/* Curated Packages */}
                        <button
                            onClick={() => setPhase('curated')}
                            className="group text-left p-8 rounded-2xl border-2 border-gray-100 bg-white hover:border-primary-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4 text-primary-600 group-hover:bg-primary-100 transition-colors">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Curated Packages</h3>
                            <p className="text-sm text-gray-500 mb-3">Pre-set menu packages</p>
                            <p className="text-xs text-gray-400">
                                Choose from Economy, Standard, or Premium packages with price-per-head ranges. All items can be modified.
                            </p>
                            <div className="mt-4 text-primary-600 font-semibold text-sm flex items-center group-hover:translate-x-1 transition-transform">
                                Browse packages →
                            </div>
                        </button>

                        {/* Blank Canvas */}
                        <button
                            onClick={applyBlankCanvas}
                            className="group text-left p-8 rounded-2xl border-2 border-gray-100 bg-white hover:border-primary-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4 text-primary-600 group-hover:bg-primary-100 transition-colors">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Blank Canvas</h3>
                            <p className="text-sm text-gray-500 mb-3">Build from scratch</p>
                            <p className="text-xs text-gray-400">
                                Start with an empty menu and hand-pick every dish yourself. Full creative freedom!
                            </p>
                            <div className="mt-4 text-primary-600 font-semibold text-sm flex items-center group-hover:translate-x-1 transition-transform">
                                Start fresh →
                            </div>
                        </button>
                    </div>
                </div>

                <div className="flex justify-start pt-12 items-center border-t border-gray-100 mt-8">
                    <button
                        onClick={() => setPhase('budget')}
                        className="text-gray-500 font-bold hover:text-gray-800 px-6 py-3 transition-colors flex items-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                    </button>
                </div>
            </div>
        );
    }

    // ==========================================
    // PHASE: CURATED PACKAGES
    // ==========================================
    if (phase === 'curated') {
        return (
            <div className="flex flex-col h-full justify-between animate-fadeIn">
                <div className="space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-display font-bold text-gray-900">
                            Select a Package
                        </h2>
                        <p className="text-gray-500 mt-2">
                            Each package pre-fills your menu. You can customize all items afterward.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-8">
                        {CURATED_PACKAGES.map((pkg, index) => {
                            // Calculate price per head for this package
                            let pkgTotal = 0;
                            Object.keys(pkg.prefilledDishes).forEach(category => {
                                pkg.prefilledDishes[category].forEach(id => {
                                    const dish = mergedDishes[category]?.find(d => d.id === id);
                                    if (dish) pkgTotal += getDishCost(dish);
                                });
                            });

                            const totalDishes = Object.values(pkg.prefilledDishes).reduce(
                                (sum, arr) => sum + arr.length, 0
                            );

                            return (
                                <div
                                    key={pkg.id}
                                    className={`relative bg-white border-2 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col ${index === 1 ? 'border-primary-200 ring-2 ring-primary-100' : 'border-gray-100 hover:border-primary-200'
                                        }`}
                                >
                                    {index === 1 && (
                                        <div className="bg-primary-600 text-white text-center py-1.5 text-xs font-bold uppercase tracking-wider">
                                            Most Popular
                                        </div>
                                    )}
                                    <div className="h-2 w-full bg-gradient-to-r from-primary-500 to-primary-600"></div>

                                    <div className="p-8 flex-1 flex flex-col">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{pkg.name}</h3>
                                        <p className="text-gray-500 text-sm mb-4">{pkg.description}</p>
                                        <p className="text-primary-600 font-bold text-lg mb-2">{pkg.priceRange}</p>
                                        <p className="text-xs text-gray-400 mb-6">{totalDishes} dishes included</p>

                                        <div className="mt-auto">
                                            <div className="text-sm text-gray-500 mb-4">
                                                <p className="font-semibold text-gray-700 mb-1">₱{pkgTotal.toLocaleString()}/head</p>
                                                <p className="text-xs">Total: ₱{(pkgTotal * pax).toLocaleString()} for {pax} guests</p>
                                            </div>
                                            <button
                                                onClick={() => applyCuratedPackage(pkg)}
                                                className="w-full py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition-all transform active:scale-95 bg-gray-900 text-white hover:bg-primary-600 hover:shadow-lg shadow-md"
                                            >
                                                Select {pkg.name}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex justify-start pt-12 items-center border-t border-gray-100 mt-8">
                    <button
                        onClick={() => setPhase('path')}
                        className="text-gray-500 font-bold hover:text-gray-800 px-6 py-3 transition-colors flex items-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                    </button>
                </div>
            </div>
        );
    }

    // ==========================================
    // PHASE: TABULAR MENU BUILDER
    // ==========================================
    return (
        <div className="flex flex-col h-full animate-fadeIn">
            <div className="mb-6">
                <h2 className="text-3xl font-display font-bold text-gray-900">Customize Your Menu</h2>
                <p className="text-gray-500 mt-1">
                    Select your dishes per category. <span className="text-primary-600 font-medium">Limits apply per category.</span>
                </p>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl overflow-x-auto">
                {CATEGORY_TABS.map(tab => {
                    const count = selections[tab.key]?.length || 0;
                    const limit = CATEGORY_LIMITS[tab.key] || 5;
                    const isActive = activeTab === tab.key;
                    const isFull = count >= limit;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex-1 min-w-fit px-4 py-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${isActive
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <TabIcon type={tab.key} className="w-4 h-4 inline-block mr-0.5" />
                            {tab.label}
                            <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isFull
                                ? 'bg-green-100 text-green-700'
                                : count > 0
                                    ? (isActive ? 'bg-primary-100 text-primary-700' : 'bg-gray-200 text-gray-600')
                                    : 'bg-gray-200 text-gray-400'
                                }`}>
                                {count}/{limit}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Dish Grid */}
            <div className="flex-1 overflow-y-auto max-h-[450px] pr-2 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...(mergedDishes[activeTab] || [])]
                        .sort((a, b) => {
                            if (a.isBestSeller !== b.isBestSeller) return b.isBestSeller ? 1 : -1;
                            return getDishCost(a) - getDishCost(b);
                        })
                        .map(dish => {
                            const isSelected = selections[activeTab]?.includes(dish.id);
                            const cost = getDishCost(dish);
                            const categoryCount = selections[activeTab]?.length || 0;
                            const categoryLimit = CATEGORY_LIMITS[activeTab] || 5;
                            const isLimitReached = !isSelected && categoryCount >= categoryLimit;

                            return (
                                <div
                                    key={dish.id}
                                    className={`relative rounded-xl overflow-hidden border-2 transition-all duration-200 ${isSelected
                                        ? 'border-primary-500 bg-primary-50 shadow-md'
                                        : isLimitReached
                                            ? 'border-gray-100 bg-gray-50 opacity-50'
                                            : 'border-gray-100 bg-white hover:border-gray-200'
                                        }`}
                                >
                                    <div className="flex items-start gap-4 p-4">
                                        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                                            <img
                                                src={dish.image}
                                                alt={dish.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400'; }}
                                            />
                                            {dish.isBestSeller && (
                                                <div className="absolute top-1 left-1 bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded text-[8px] font-bold flex items-center">
                                                    <svg className="w-2.5 h-2.5 mr-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h5 className={`font-bold text-sm mb-0.5 ${isSelected ? 'text-primary-900' : 'text-gray-900'}`}>
                                                {dish.name}
                                            </h5>
                                            <p className="text-xs text-gray-400 line-clamp-1 mb-2">{dish.description}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-primary-700 font-bold text-sm">
                                                    ₱{cost}/head
                                                </span>
                                                {pax > 0 && (
                                                    <span className="text-gray-400 text-xs">
                                                        = ₱{(cost * pax).toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => toggleDish(activeTab, dish.id)}
                                            disabled={isLimitReached}
                                            className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${isSelected
                                                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                                : isLimitReached
                                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                    : 'bg-primary-600 text-white hover:bg-primary-700'
                                                }`}
                                        >
                                            {isSelected ? 'Remove' : isLimitReached ? 'Full' : 'Add'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="flex justify-between pt-6 items-center border-t border-gray-100 mt-6">
                <button
                    onClick={() => setPhase('path')}
                    className="text-gray-500 font-bold hover:text-gray-800 px-6 py-3 transition-colors flex items-center"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Change Approach
                </button>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Menu Total</p>
                        <p className="text-xl font-bold text-gray-900">₱{menuTotal.toLocaleString()}</p>
                    </div>
                    <button
                        onClick={handleConfirmMenu}
                        disabled={totalDishCount === 0}
                        className={`px-8 py-4 rounded-xl font-bold shadow-lg transition-all transform active:scale-95 flex items-center ${totalDishCount > 0
                            ? 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-xl'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        Confirm Menu
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MenuBuilder;
