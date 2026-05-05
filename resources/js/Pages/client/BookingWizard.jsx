import { useState } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import CalendarView from '../../components/client/CalendarView';
import EventIdentity from '../../components/client/EventIdentity';
import GuestLogistics from '../../components/client/GuestLogistics';
import MenuBuilder from '../../components/client/MenuBuilder';
import EventSurcharges from '../../components/client/EventSurcharges';
import FoodTastingStep from '../../components/client/FoodTastingStep';
import BlueprintPanel from '../../components/client/BlueprintPanel';
import Modal from '../../components/common/Modal';

const BookingWizard = () => {
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [bookingData, setBookingData] = useState({
        // Step 1
        date: null,
        time: '',
        remainingPax: null,
        // Step 2
        eventType: '',
        // Step 3
        pax: 20,
        dietaryNotes: '',
        // Step 4
        budget: 0,
        selectedDishes: {
            starters: [],
            mains: [],
            sides: [],
            desserts: [],
            drinks: []
        },
        customMenu: {},
        totalCost: 0,
        // Step 5
        client_full_name: '',
        venue_address_line: '',
        venue_street: '',
        venue_city: '',
        venue_province: '',
        venue_zip_code: '',
        client_email: '',
        client_phone: '',
        venueDistance: 'metro-manila',
        isHighRise: false,
        // Step 6
        wantsTasting: false,
        tasting_guest_name: '',
        tasting_guest_email: '',
        tasting_guest_phone: '',
        tasting_preferred_date: '',
        tasting_preferred_time: '',
        tasting_notes: ''
    });

    const updateBooking = (data) => {
        setBookingData(prev => ({ ...prev, ...data }));
    };

    const nextStep = () => setCurrentStep(prev => prev + 1);
    const prevStep = () => setCurrentStep(prev => prev - 1);

    const [modal, setModal] = useState({
        isOpen: false,
        type: 'info',
        title: '',
        message: '',
        onConfirm: null,
        confirmText: null
    });

    const showModal = (type, title, message, onConfirm = null, confirmText = null) => {
        setModal({ isOpen: true, type, title, message, onConfirm, confirmText });
    };

    const closeModal = () => {
        setModal(prev => ({ ...prev, isOpen: false }));
    };

    const submitBooking = async (extraData = {}) => {
        if (!user) {
            showModal('error', 'Login Required', 'You must be logged in to book.', () => navigate('/login'));
            return;
        }

        const merged = { ...bookingData, ...extraData };

        // Calculate final total with surcharges
        let transportFee = 0;
        if (merged.venueDistance === 'outside-16-30') transportFee = 1500;
        if (merged.venueDistance === 'outside-31-50') transportFee = 3000;
        const laborSurcharge = merged.isHighRise ? Math.round((merged.totalCost || 0) * 0.03) : 0;
        const finalTotal = (merged.totalCost || 0) + transportFee + laborSurcharge;

        const payload = {
            user_id: user.id,
            event_date: merged.date,
            event_time: merged.time,
            event_type: merged.eventType,
            pax: merged.pax,
            budget: merged.budget,
            dietary_notes: merged.dietaryNotes,
            package_id: 'custom',
            client_full_name: merged.client_full_name,
            venue_address_line: merged.venue_address_line,
            venue_street: merged.venue_street,
            venue_city: merged.venue_city,
            venue_province: merged.venue_province,
            venue_zip_code: merged.venue_zip_code,
            client_email: merged.client_email,
            client_phone: merged.client_phone,
            venue_distance: merged.venueDistance,
            is_high_rise: merged.isHighRise,
            transport_fee: transportFee,
            labor_surcharge: laborSurcharge,
            total_cost: finalTotal,
            selected_menu: merged.customMenu
        };

        try {
            const response = await axios.post('/api/bookings', payload);

            // If food tasting requested, submit that too
            if (merged.wantsTasting) {
                try {
                    await axios.post('/api/food-tasting', {
                        guest_name: merged.tasting_guest_name,
                        guest_email: merged.tasting_guest_email,
                        guest_phone: merged.tasting_guest_phone,
                        preferred_date: merged.tasting_preferred_date,
                        preferred_time: merged.tasting_preferred_time,
                        notes: merged.tasting_notes
                    });
                } catch (err) {
                    console.error("Food tasting submission error:", err);
                }
            }

            showModal(
                'success',
                'Booking Confirmed! 🎉',
                'Your booking has been successfully submitted! You can fill in additional event details such as Reservation Time, Serving Time, Event Timeline, and Color Motif in your Dashboard under the "My Events" tab.',
                () => router.get('/dashboard/client'),
                'Go to My Events'
            );
        } catch (error) {
            console.error("Submission Error:", error);
            let errorMsg = 'An error occurred while submitting your booking. Please try again.';
            
            if (error.response && error.response.data) {
                const data = error.response.data;
                errorMsg = data.error || data.message || errorMsg;
                
                if (data.errors) {
                    const validationErrors = Object.values(data.errors).flat().join(' ');
                    errorMsg += ' ' + validationErrors;
                }
            }
            
            showModal('error', 'Booking Failed', errorMsg);
        }
    };

    const totalSteps = 6;

    const stepLabels = [
        { step: 1, label: "Schedule" },
        { step: 2, label: "Event Type" },
        { step: 3, label: "Guests" },
        { step: 4, label: "Menu" },
        { step: 5, label: "Venue & Fees" },
        { step: 6, label: "Tasting" }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8 pt-24">
            <Modal
                isOpen={modal.isOpen}
                onClose={closeModal}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                onConfirm={modal.onConfirm}
                confirmText={modal.confirmText}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Stepper Progress Bar */}
                <div className="mb-12 max-w-4xl mx-auto">
                    <div className="relative flex justify-between items-center w-full">
                        {/* Connecting Line Background */}
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 transform -translate-y-1/2 rounded-full"></div>

                        {/* Connecting Line Progress */}
                        <div
                            className="absolute top-1/2 left-0 h-1 bg-primary-600 -z-10 transform -translate-y-1/2 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                        ></div>

                        {stepLabels.map((item) => (
                            <div key={item.step} className="flex flex-col items-center relative group cursor-default">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-4 ${currentStep > item.step
                                        ? 'bg-primary-600 border-primary-600 text-white shadow-lg scale-110'
                                        : currentStep === item.step
                                            ? 'bg-white border-primary-600 text-primary-600 shadow-xl scale-125 ring-2 ring-primary-100'
                                            : 'bg-white border-gray-300 text-gray-400'
                                        }`}
                                >
                                    {currentStep > item.step ? (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    ) : (
                                        item.step
                                    )}
                                </div>
                                <span className={`absolute top-14 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors duration-300 ${currentStep >= item.step ? 'text-primary-800' : 'text-gray-400'
                                    }`}>
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content: Step + Blueprint Panel */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left: Step Content */}
                    <div className="flex-1 bg-white rounded-2xl shadow-xl border border-gray-100 p-8 min-h-[600px] transition-all duration-300">
                        {currentStep === 1 && (
                            <CalendarView
                                bookingData={bookingData}
                                updateBooking={updateBooking}
                                onNext={nextStep}
                            />
                        )}
                        {currentStep === 2 && (
                            <EventIdentity
                                bookingData={bookingData}
                                updateBooking={updateBooking}
                                onNext={nextStep}
                                onBack={prevStep}
                            />
                        )}
                        {currentStep === 3 && (
                            <GuestLogistics
                                bookingData={bookingData}
                                updateBooking={updateBooking}
                                onNext={nextStep}
                                onBack={prevStep}
                            />
                        )}
                        {currentStep === 4 && (
                            <MenuBuilder
                                bookingData={bookingData}
                                updateBooking={updateBooking}
                                onNext={nextStep}
                                onBack={prevStep}
                            />
                        )}
                        {currentStep === 5 && (
                            <EventSurcharges
                                bookingData={bookingData}
                                updateBooking={updateBooking}
                                onNext={nextStep}
                                onBack={prevStep}
                                user={user}
                            />
                        )}
                        {currentStep === 6 && (
                            <FoodTastingStep
                                bookingData={bookingData}
                                updateBooking={updateBooking}
                                onSubmit={submitBooking}
                                onBack={prevStep}
                            />
                        )}
                    </div>

                    {/* Right: Blueprint Panel */}
                    <BlueprintPanel
                        bookingData={bookingData}
                        currentStep={currentStep}
                    />
                </div>
            </div>
        </div>
    );
};

export default BookingWizard;
