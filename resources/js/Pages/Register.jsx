import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [showTerms, setShowTerms] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [canAgree, setCanAgree] = useState(false);
    const termsRef = useRef(null);

    useEffect(() => {
        if (showTerms && termsRef.current) {
            if (termsRef.current.scrollHeight <= termsRef.current.clientHeight + 5) {
                setCanAgree(true);
            }
        }
    }, [showTerms]);

    const handleTermsScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollHeight - scrollTop <= clientHeight + 5) {
            setCanAgree(true);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        if (!agreedToTerms) {
            setError("You must agree to the Terms and Conditions to register.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password,
                    email: formData.email,
                    phone: formData.phone,
                    role: 'Client'
                }),
            });

            if (response.ok) {
                // Successful registration
                navigate('/login', { state: { message: "Registration successful! Please login." } });
            } else {
                const data = await response.text();
                setError(data || "Registration failed");
            }
        } catch (err) {
            console.error("Registration error:", err);
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100 relative">
                {/* Back Button */}
                <Link to="/" className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back
                </Link>

                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 font-display">
                        Eloquente Catering
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Create your account
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm mt-1"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm mt-1"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Mobile Number</label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm mt-1"
                                placeholder="Mobile number"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm mt-1"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm mt-1"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                checked={agreedToTerms}
                                onChange={(e) => {
                                    if (e.target.checked && !canAgree) {
                                        setShowTerms(true);
                                    } else {
                                        setAgreedToTerms(e.target.checked);
                                    }
                                }}
                                className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded cursor-pointer"
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="terms" className="font-medium text-gray-700">
                                I agree to the{' '}
                                <button type="button" onClick={() => setShowTerms(true)} className="text-primary-600 hover:text-primary-500 underline">
                                    Terms and Conditions
                                </button>
                            </label>
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${loading ? 'bg-primary-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200`}
                        >
                            {loading ? 'Creating account...' : 'Register'}
                        </button>
                    </div>
                </form>
                <div className="text-center text-sm text-gray-600">
                    <p>
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>

            {/* Terms and Conditions Modal */}
            {showTerms && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900">Terms and Conditions</h3>
                        </div>
                        <div
                            className="p-6 overflow-y-auto flex-1 text-sm text-gray-700 space-y-4"
                            onScroll={handleTermsScroll}
                            ref={termsRef}
                        >
                            <p>Welcome to the Eloquente Catering Services Booking Portal. By accessing our system and reserving our services, you agree to comply with and be bound by the following Terms and Conditions. Please review them carefully.</p>

                            <h4 className="font-bold text-base mt-4">1. Booking & Reservation Policy</h4>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Lead Time:</strong> All bookings must be finalized at least seven (7) days prior to the event date. The system will automatically block reservations that do not meet this lead time.</li>
                                <li><strong>Capacity Limits:</strong> Eloquente accepts a maximum of 10 events per day or a cumulative total of 3,500 pax per day. If your selected date has reached this operational threshold, the system will not permit the booking.</li>
                                <li><strong>Validation:</strong> A submitted booking is considered Pending until reviewed and officially validated by our Marketing Department regarding venue logistics and schedule feasibility.</li>
                            </ul>

                            <h4 className="font-bold text-base mt-4">2. Payment Terms & Financial Integration</h4>
                            <p>All financial transactions are processed securely through our automated online payment gateway.</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Reservation Fee:</strong> A non-refundable 10% reservation fee of the total contract price is required to officially block your date and generate the Digital Contract.</li>
                                <li><strong>Down Payment:</strong> A 70% down payment must be settled at least one (1) month prior to the event date.</li>
                                <li><strong>Final Payment:</strong> The remaining 20% final payment must be settled at least ten (10) days prior to the event date.</li>
                                <li><strong>Automated Processing:</strong> Upon executing a payment via e-wallet or bank transfer through the system's integrated gateway, the platform will automatically authenticate the funds, update your booking status, and issue a digital receipt to your account dashboard.</li>
                            </ul>

                            <h4 className="font-bold text-base mt-4">3. Surcharges and Additional Fees</h4>
                            <p>To ensure the highest quality of service, specific logistical challenges will incur system surcharges based on the details provided during booking:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Out-of-Town Fee:</strong> Events located in categorized &quot;Near Provinces&quot; require additional logistics and fuel. A 20% surcharge will be applied to the Total Contract Amount.</li>
                                <li><strong>High-Rise Building Fee:</strong> Venues located in high-rise buildings requiring the use of elevators or stairs for ingress/egress will incur a 3% surcharge based strictly on the Total Food Amount.</li>
                                <li><strong>Overtime Fee:</strong> Catering services extending beyond the standard contracted hours will be billed a flat rate of ₱5,000.00 per extra hour.</li>
                                <li><strong>Hauling Fee:</strong> The hauling fee is variable and is dynamically assessed depending on the final number of guests (pax) and the specific setup requirements requested by the client.</li>
                                <li><strong>Outside Food &amp; Corkage Rules:</strong> Corkage fees for outside food are set by the venue management. However, Eloquente implements the following operational charges for outside food:
                                    <ul className="list-[circle] pl-5 mt-2 space-y-1">
                                        <li>If clients bring their own lechon (roast pig), an extra manpower charge is applied for our staff to chop and serve the lechon.</li>
                                        <li>If clients bring multiple outside food items or alcoholic beverages, specific rental fees will apply for the use of our catering equipment (e.g., chafing dishes, ice supplies) to accommodate these items.</li>
                                    </ul>
                                </li>
                            </ul>

                            <h4 className="font-bold text-base mt-4">4. Outsourced Services &amp; Third-Party Vendors</h4>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Through the portal, clients may request recommendations for supplementary services (e.g., Emcees, Photographers, Lights &amp; Sounds).</li>
                                <li><strong>Non-Liability:</strong> Eloquente provides these contacts as a courtesy. We do not act as a financial middleman. Clients must negotiate, contract, and pay these third-party vendors directly. Eloquente is not liable for the performance, scheduling, or financial disputes involving outsourced personnel.</li>
                            </ul>

                            <h4 className="font-bold text-base mt-4">5. Client Responsibilities</h4>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Accuracy of Information:</strong> The client is responsible for providing accurate guest headcounts (pax), correct venue addresses, and specific dietary restrictions via the portal's special notes section.</li>
                                <li><strong>Lock-in Period (7-Day Rule):</strong> Event details, including menu customizations, color motifs, and headcount adjustments, cannot be edited anymore once the event is within seven (7) days of the scheduled date. This strict cutoff is required for final kitchen and logistical preparations. Reductions in pax on the day of the event will not result in a refund.</li>
                            </ul>

                            <h4 className="font-bold text-base mt-4">6. Cancellations &amp; Refunds</h4>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Cancellations must be formally submitted through the portal's messaging interface.</li>
                                <li>The initial 10% reservation fee is strictly non-refundable to cover preparatory logistics, administrative blocking of the date, and food sourcing.</li>
                                <li><strong>Strict 7-Day Non-Refundable Policy:</strong> Payments cannot be refunded anymore if the cancellation request is made within seven (7) days of the scheduled event date.</li>
                                <li>Refunds for cancelled events outside of the 7-day window (minus the non-refundable 10% reservation fee) are subject to review by Management and will be processed by the Accounting Department.</li>
                            </ul>

                            <p className="font-semibold text-gray-900 mt-4">By clicking &quot;I Agree&quot; during the checkout process, the Client legally acknowledges and accepts all terms, conditions, and surcharges stipulated in this agreement.</p>
                        </div>
                        <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50 rounded-b-lg">
                            {!canAgree ? (
                                <div className="text-xs text-primary-600 font-medium animate-pulse">
                                    Please scroll to the bottom to agree &darr;
                                </div>
                            ) : (
                                <div className="text-xs text-green-600 font-medium flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    You can now agree
                                </div>
                            )}
                            <div className="flex gap-3 w-full sm:w-auto">
                                <button
                                    type="button"
                                    onClick={() => setShowTerms(false)}
                                    className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    disabled={!canAgree}
                                    onClick={() => {
                                        setAgreedToTerms(true);
                                        setShowTerms(false);
                                    }}
                                    className={`flex-1 sm:flex-none px-6 py-2 text-sm font-medium rounded-md text-white transition-all duration-200 ${canAgree ? 'bg-primary-600 hover:bg-primary-700 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500' : 'bg-gray-300 cursor-not-allowed'}`}
                                >
                                    I Agree
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Register;
