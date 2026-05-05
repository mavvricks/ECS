import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';

/**
 * FlashToast — Shows flash messages from the Laravel session as
 * an animated toast notification matching the Eloquente Catering theme.
 * Red/maroon + gold accent colors with Outfit/Inter fonts.
 */
const FlashToast = () => {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('success'); // 'success' | 'error'
    const [exiting, setExiting] = useState(false);

    useEffect(() => {
        if (flash?.message) {
            setMessage(flash.message);
            setType('success');
            setVisible(true);
            setExiting(false);
        } else if (flash?.error) {
            setMessage(flash.error);
            setType('error');
            setVisible(true);
            setExiting(false);
        }
    }, [flash?.message, flash?.error]);

    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => {
                setExiting(true);
                setTimeout(() => {
                    setVisible(false);
                    setExiting(false);
                }, 400);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [visible, message]);

    if (!visible) return null;

    const isSuccess = type === 'success';

    return (
        <div
            style={{
                position: 'fixed',
                top: '24px',
                right: '24px',
                zIndex: 99999,
                animation: exiting
                    ? 'toast-slide-out 0.4s ease-in forwards'
                    : 'toast-slide-in 0.5s cubic-bezier(0.21, 1.02, 0.73, 1) forwards',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    padding: '18px 22px',
                    minWidth: '340px',
                    maxWidth: '460px',
                    borderRadius: '14px',
                    background: isSuccess
                        ? 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 50%, #7f1d1d 100%)'
                        : 'linear-gradient(135deg, #1e1e1e 0%, #374151 100%)',
                    color: '#fff',
                    boxShadow: isSuccess
                        ? '0 20px 50px rgba(127, 29, 29, 0.4), 0 8px 20px rgba(0,0,0,0.2), 0 0 0 1px rgba(234, 179, 8, 0.2) inset'
                        : '0 20px 50px rgba(0,0,0,0.3), 0 8px 20px rgba(0,0,0,0.15)',
                    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                    border: isSuccess
                        ? '1px solid rgba(234, 179, 8, 0.25)'
                        : '1px solid rgba(255,255,255,0.1)',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Subtle gold shimmer overlay */}
                {isSuccess && (
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(105deg, transparent 40%, rgba(234, 179, 8, 0.06) 50%, transparent 60%)',
                            pointerEvents: 'none',
                        }}
                    />
                )}

                {/* Icon */}
                <div
                    style={{
                        flexShrink: 0,
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: isSuccess
                            ? 'linear-gradient(135deg, #eab308, #f59e0b)'
                            : 'rgba(239, 68, 68, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 700,
                        color: isSuccess ? '#7f1d1d' : '#fca5a5',
                        boxShadow: isSuccess
                            ? '0 2px 8px rgba(234, 179, 8, 0.4)'
                            : 'none',
                        position: 'relative',
                        zIndex: 1,
                    }}
                >
                    {isSuccess ? '✓' : '✕'}
                </div>

                {/* Message */}
                <div style={{ flex: 1, minWidth: 0, position: 'relative', zIndex: 1 }}>
                    <div
                        style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            lineHeight: 1.6,
                            wordBreak: 'break-word',
                            color: isSuccess ? '#fef3c7' : '#f9fafb',
                            letterSpacing: '0.01em',
                        }}
                    >
                        {message}
                    </div>
                </div>

                {/* Close button */}
                <button
                    onClick={() => {
                        setExiting(true);
                        setTimeout(() => {
                            setVisible(false);
                            setExiting(false);
                        }, 400);
                    }}
                    style={{
                        flexShrink: 0,
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        borderRadius: '8px',
                        color: isSuccess ? '#fde68a' : '#d1d5db',
                        cursor: 'pointer',
                        width: '26px',
                        height: '26px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        transition: 'all 0.2s',
                        position: 'relative',
                        zIndex: 1,
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(255,255,255,0.2)';
                        e.target.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(255,255,255,0.1)';
                        e.target.style.transform = 'scale(1)';
                    }}
                    aria-label="Dismiss notification"
                >
                    ✕
                </button>
            </div>

            {/* Progress bar with gold accent */}
            <div
                style={{
                    marginTop: '0',
                    height: '3px',
                    borderRadius: '0 0 14px 14px',
                    overflow: 'hidden',
                    background: isSuccess
                        ? 'rgba(127, 29, 29, 0.5)'
                        : 'rgba(55, 65, 81, 0.5)',
                }}
            >
                <div
                    style={{
                        height: '100%',
                        background: isSuccess
                            ? 'linear-gradient(90deg, #eab308, #f59e0b, #fbbf24)'
                            : 'rgba(239, 68, 68, 0.6)',
                        animation: 'toast-progress 5.4s linear forwards',
                        borderRadius: '0 0 14px 14px',
                    }}
                />
            </div>

            {/* Keyframe animations */}
            <style>{`
                @keyframes toast-slide-in {
                    0% {
                        opacity: 0;
                        transform: translateY(-20px) scale(0.96);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                @keyframes toast-slide-out {
                    0% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(-20px) scale(0.96);
                    }
                }
                @keyframes toast-progress {
                    0% { width: 100%; }
                    100% { width: 0%; }
                }
            `}</style>
        </div>
    );
};

export default FlashToast;
