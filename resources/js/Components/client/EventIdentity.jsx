import { useState } from 'react';
import { EVENT_TYPES } from '../../data/mockData';

const EventIcon = ({ type, className = "w-10 h-10" }) => {
    const icons = {
        wedding: (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
        ),
        crown: (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2 17l3-11 4 4 3-6 3 6 4-4 3 11H2z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 17h16v2H4z" />
            </svg>
        ),
        cake: (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8V4m-3 4v-1a1 1 0 012 0v1m2 0v-1a1 1 0 012 0v1M4 12h16v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6zm0 0a4 4 0 014-4h8a4 4 0 014 4" />
            </svg>
        ),
        briefcase: (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
        ),
        users: (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
        ),
        heart: (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 13l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
        ),
        academic: (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
            </svg>
        ),
        sparkles: (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
        )
    };
    return icons[type] || icons.sparkles;
};

const EventIdentity = ({ bookingData, updateBooking, onNext, onBack }) => {
    const [selected, setSelected] = useState(bookingData.eventType || '');

    const handleSelect = (eventType) => {
        setSelected(eventType.label);
        updateBooking({ eventType: eventType.label });
    };

    const handleNext = () => {
        if (!selected) return;
        onNext();
    };

    return (
        <div className="flex flex-col h-full justify-between animate-fadeIn">
            <div className="space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-display font-bold text-gray-900">
                        What kind of event are we celebrating?
                    </h2>
                    <p className="text-gray-500 mt-2">
                        Hello! Let's start by understanding your event so we can tailor the perfect experience.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 max-w-4xl mx-auto">
                    {EVENT_TYPES.map((eventType) => {
                        const isSelected = selected === eventType.label;
                        return (
                            <button
                                key={eventType.id}
                                onClick={() => handleSelect(eventType)}
                                className={`group relative h-40 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${isSelected
                                    ? 'ring-4 ring-primary-500 shadow-lg'
                                    : 'hover:ring-2 hover:ring-primary-300'
                                    }`}
                            >
                                {/* Background Image */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                    style={{ backgroundImage: `url(${eventType.image})` }}
                                ></div>

                                {/* Overlay gradient */}
                                <div className={`absolute inset-0 transition-opacity duration-300 ${isSelected ? 'bg-primary-900/60' : 'bg-black/50 group-hover:bg-black/40'}`}></div>

                                {/* Checkmark for selected state */}
                                {isSelected && (
                                    <div className="absolute top-3 right-3 bg-primary-500 text-white p-1 rounded-full z-10 shadow-md">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}

                                {/* Content */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 p-4">
                                    <div className={`mb-2 transform transition-all duration-300 ${isSelected ? 'scale-110 text-white' : 'text-gray-200 group-hover:text-white group-hover:scale-110'}`}>
                                        <EventIcon type={eventType.icon} className="w-12 h-12 drop-shadow-md" />
                                    </div>
                                    <h3 className="font-bold text-lg mb-1 drop-shadow-md text-center">
                                        {eventType.label}
                                    </h3>
                                    <p className="text-xs text-center text-gray-200 drop-shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-h-0 group-hover:max-h-10 overflow-hidden line-clamp-2">
                                        {eventType.description}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex justify-between pt-12 items-center border-t border-gray-100 mt-8">
                <button
                    onClick={onBack}
                    className="text-gray-500 font-bold hover:text-gray-800 px-6 py-3 transition-colors flex items-center"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>
                <button
                    onClick={handleNext}
                    disabled={!selected}
                    className={`px-10 py-4 rounded-xl font-bold shadow-lg transition-all transform hover:-translate-y-1 flex items-center ${selected
                        ? 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-xl'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    Next Step
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default EventIdentity;
