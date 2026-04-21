import { useMemo } from 'react';
import { DISHES } from '../../data/mockData';

const CATEGORY_LABELS = {
    starters: 'Starter',
    mains: 'Main Course',
    sides: 'Sides',
    desserts: 'Dessert',
    drinks: 'Refreshments'
};

const BlueprintPanel = ({ bookingData, currentStep }) => {
    const {
        eventType,
        pax,
        time,
        dietaryNotes,
        selectedDishes = {},
        venueDistance,
        isHighRise,
    } = bookingData;

    // Calculate menu total from selected dishes
    const menuTotal = useMemo(() => {
        let total = 0;
        Object.keys(selectedDishes).forEach(category => {
            const dishIds = selectedDishes[category] || [];
            dishIds.forEach(id => {
                const dish = DISHES[category]?.find(d => d.id === id);
                if (dish) {
                    total += dish.costPerHead * (pax || 0);
                }
            });
        });
        return total;
    }, [selectedDishes, pax]);

    // Calculate surcharges
    const transportFee = useMemo(() => {
        if (venueDistance === 'outside-16-30') return 1500;
        if (venueDistance === 'outside-31-50') return 3000;
        return 0;
    }, [venueDistance]);

    const laborSurcharge = useMemo(() => {
        if (isHighRise) return Math.round(menuTotal * 0.03);
        return 0;
    }, [isHighRise, menuTotal]);

    const totalEstimate = menuTotal + transportFee + laborSurcharge;

    // Count total dishes selected
    const totalDishCount = Object.values(selectedDishes).reduce(
        (sum, arr) => sum + (arr?.length || 0), 0
    );

    // Get action button text based on step
    const getButtonText = () => {
        switch (currentStep) {
            case 1: return 'Continue';
            case 2: return 'Continue';
            case 3: return 'Continue';
            case 4: return 'Confirm Menu';
            case 5: return 'Continue';
            case 6: return 'Confirm Booking';
            default: return 'Continue';
        }
    };

    return (
        <div className="w-full lg:w-[380px] flex-shrink-0">
            <div className="bg-gray-900 rounded-2xl shadow-2xl sticky top-24 overflow-hidden">
                {/* Header */}
                <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-white font-bold text-lg tracking-wide">Your Blueprint</h3>
                    </div>
                </div>

                <div className="p-6 space-y-6 max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar">
                    {/* EVENT DETAILS Section */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center">
                            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Event Details
                        </h4>
                        <div className="space-y-2.5">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-sm">Type</span>
                                <span className={`text-sm font-medium ${eventType ? 'text-white' : 'text-gray-600 italic'}`}>
                                    {eventType || '—'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-sm">Guests</span>
                                <span className={`text-sm font-medium ${pax ? 'text-white' : 'text-gray-600 italic'}`}>
                                    {pax ? `${pax} pax` : '—'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-sm">Time</span>
                                <span className={`text-sm font-medium ${time ? 'text-white' : 'text-gray-600 italic'}`}>
                                    {time || '—'}
                                </span>
                            </div>
                            <div className="flex justify-between items-start">
                                <span className="text-gray-500 text-sm">Dietary</span>
                                <span className={`text-sm font-medium text-right max-w-[180px] ${dietaryNotes ? 'text-white' : 'text-gray-600 italic'}`}>
                                    {dietaryNotes || 'None'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gray-700/50"></div>

                    {/* MENU SELECTION Section */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center">
                            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            Menu Selection
                            {totalDishCount > 0 && (
                                <span className="ml-2 bg-primary-600/20 text-primary-400 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                    {totalDishCount} items
                                </span>
                            )}
                        </h4>

                        {totalDishCount === 0 ? (
                            <p className="text-gray-600 text-sm italic">No dishes selected yet</p>
                        ) : (
                            <div className="space-y-4">
                                {Object.keys(CATEGORY_LABELS).map(category => {
                                    const dishIds = selectedDishes[category] || [];
                                    if (dishIds.length === 0) return null;

                                    return (
                                        <div key={category}>
                                            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1.5">
                                                {CATEGORY_LABELS[category]}
                                            </p>
                                            <div className="space-y-1">
                                                {dishIds.map(id => {
                                                    const dish = DISHES[category]?.find(d => d.id === id);
                                                    if (!dish) return null;
                                                    const cost = dish.costPerHead * (pax || 0);
                                                    return (
                                                        <div key={id} className="flex justify-between items-center text-sm animate-fadeIn">
                                                            <span className="text-gray-300 truncate mr-2">
                                                                <span className="text-gray-500 mr-1">-</span>
                                                                {dish.name}
                                                            </span>
                                                            <span className="text-white font-medium whitespace-nowrap">
                                                                ₱{cost.toLocaleString()}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Surcharges (visible from step 5) */}
                    {(transportFee > 0 || laborSurcharge > 0) && (
                        <>
                            <div className="h-px bg-gray-700/50"></div>
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                                    Surcharges
                                </h4>
                                <div className="space-y-2">
                                    {transportFee > 0 && (
                                        <div className="flex justify-between items-center text-sm animate-fadeIn">
                                            <span className="text-gray-400">Transport Fee</span>
                                            <span className="text-yellow-400 font-medium">+₱{transportFee.toLocaleString()}</span>
                                        </div>
                                    )}
                                    {laborSurcharge > 0 && (
                                        <div className="flex justify-between items-center text-sm animate-fadeIn">
                                            <span className="text-gray-400">High-Rise Labor (3%)</span>
                                            <span className="text-yellow-400 font-medium">+₱{laborSurcharge.toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* TOTAL ESTIMATE Section */}
                <div className="border-t border-gray-700 px-6 py-5 bg-gray-800/50">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-400 text-xs uppercase tracking-wider font-bold">Total Estimate</span>
                    </div>
                    <p className="text-3xl font-display font-bold text-white">
                        ₱{totalEstimate.toLocaleString()}
                    </p>
                    {pax > 0 && totalDishCount > 0 && (
                        <p className="text-gray-500 text-xs mt-1">
                            ~₱{Math.round(totalEstimate / pax).toLocaleString()} per head
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlueprintPanel;
