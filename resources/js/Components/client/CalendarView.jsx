import { useState } from 'react';
import Modal from '../common/Modal';

const CalendarView = ({ bookingData, updateBooking, onNext }) => {
    const [selectedDate, setSelectedDate] = useState(bookingData.date || '');
    const [selectedTime, setSelectedTime] = useState(bookingData.time || '');
    const [availability, setAvailability] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const getMinDate = () => {
        const today = new Date();
        today.setDate(today.getDate() + 7);
        return today.toISOString().split('T')[0];
    };

    const formatTimeRange = (timeStr) => {
        if (!timeStr) return '';
        const [hours, minutes] = timeStr.split(':').map(Number);

        const formatAMPM = (h, m) => {
            const ampm = h >= 12 ? 'PM' : 'AM';
            h = h % 12;
            h = h ? h : 12;
            const mStr = m < 10 ? '0' + m : m;
            return `${h}:${mStr} ${ampm}`;
        };

        const endHours = (hours + 4) % 24;
        return `${formatAMPM(hours, minutes)} - ${formatAMPM(endHours, minutes)}`;
    };

    const handleDateChange = async (e) => {
        const date = e.target.value;
        setSelectedDate(date);
        setAvailability(null);
        setError('');

        if (date) {
            setLoading(true);
            try {
                const response = await fetch(`/api/bookings/availability/${date}`);
                const data = await response.json();

                if (data.isFull) {
                    setError("Sorry, this date is fully booked.");
                } else {
                    setAvailability(data);
                }
            } catch (err) {
                console.error("Error fetching availability:", err);
                setError("Failed to check availability. Please try again.");
            } finally {
                setLoading(false);
            }
        }
    };

    const [modal, setModal] = useState({ isOpen: false, type: 'info', title: '', message: '' });

    const handleNext = () => {
        if (!selectedDate || !selectedTime) {
            setModal({
                isOpen: true,
                title: 'Incomplete Selection',
                message: 'Please select both a date and a time for your event.',
                type: 'error'
            });
            return;
        }
        if (error) {
            setModal({
                isOpen: true,
                title: 'Invalid Date',
                message: 'The selected date is unavailable. Please choose another date.',
                type: 'error'
            });
            return;
        }
        if (availability) {
            updateBooking({
                date: selectedDate,
                time: formatTimeRange(selectedTime),
                remainingPax: availability.remainingPax
            });
        } else {
            updateBooking({ date: selectedDate, time: formatTimeRange(selectedTime) });
        }
        onNext();
    };

    return (
        <div className="flex flex-col h-full justify-between">
            <Modal
                isOpen={modal.isOpen}
                onClose={() => setModal({ ...modal, isOpen: false })}
                title={modal.title}
                message={modal.message}
                type={modal.type}
            />
            <div className="space-y-8 animate-fadeIn">
                <div className="text-center">
                    <h2 className="text-3xl font-display font-bold text-gray-900">Mark Your Calendar</h2>
                    <p className="text-gray-500 mt-2">Let's start planning the perfect date for your event.</p>
                    <p className="text-xs text-amber-600 mt-1 font-semibold">Note: Bookings must be made at least 7 days in advance.</p>
                </div>

                <div className="max-w-2xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                    {/* Date Input */}
                    <div className={`bg-gray-50 p-6 rounded-xl border transition-colors ${error ? 'border-red-300 bg-red-50' : 'border-gray-100 hover:border-primary-300'}`}>
                        <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Select Date</label>
                        <input
                            type="date"
                            min={getMinDate()}
                            value={selectedDate}
                            onChange={handleDateChange}
                            className={`w-full p-4 border rounded-lg focus:ring-2 outline-none shadow-sm text-gray-700 font-medium ${error ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-primary-500 focus:border-transparent'}`}
                        />
                        {loading && <p className="mt-2 text-xs text-blue-500">Checking availability...</p>}
                        {error && <p className="mt-2 text-xs text-red-600 font-bold">{error}</p>}
                        {availability && !error && (
                            <div className="mt-3 text-xs text-green-600 space-y-1">
                                <p className="font-bold flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    Date Available!
                                </p>
                                <p>Remaining Slots: {availability.remainingEvents}</p>
                                <p>Remaining Capacity: {availability.remainingPax} pax</p>
                            </div>
                        )}
                        {!availability && !loading && !error && (
                            <p className="mt-3 text-xs text-gray-400 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Dates in red would be unavailable.
                            </p>
                        )}
                    </div>

                    {/* Time Input */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:border-primary-300 transition-colors">
                        <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Select Event Start Time</label>
                        <input
                            type="time"
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none shadow-sm text-gray-700 font-medium bg-white"
                        />
                        {selectedTime && (
                            <p className="mt-3 font-medium text-lg text-primary-700 block bg-primary-50 p-3 rounded-lg border border-primary-200 text-center shadow-sm">
                                {formatTimeRange(selectedTime)}
                            </p>
                        )}
                        <p className="text-xs text-gray-500 mt-3 flex items-start gap-1">
                            <svg className="w-4 h-4 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>Standard catering duration is <strong>4 hours</strong> from start time. An additional <strong>₱5,000 per hour</strong> will apply for overtime.</span>
                        </p>
                    </div>
                </div>


            </div>

            <div className="flex justify-end pt-12">
                <button
                    onClick={handleNext}
                    className="bg-primary-600 text-white px-10 py-4 rounded-xl font-bold shadow-lg hover:bg-primary-700 hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center"
                >
                    Next Step
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
            </div>
        </div>
    );
};

export default CalendarView;
