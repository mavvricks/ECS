import React from 'react';
import FlashToast from '../Components/common/FlashToast';

/**
 * DefaultLayout — wraps every page so that FlashToast (which
 * relies on usePage()) lives inside the Inertia context tree.
 */
const DefaultLayout = ({ children }) => {
    return (
        <>
            {children}
            <FlashToast />
        </>
    );
};

export default DefaultLayout;
