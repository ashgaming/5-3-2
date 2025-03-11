import React, { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const Wrapper = memo(({ children }) => {
    const { user } = useSelector(state => state.UserData);
    const location = useLocation();
    const navigate = useNavigate();

  //  process.stdout.write('MyComponent rendered\n');

    useEffect(() => {
        const { pathname } = location;
        
        const timer = setTimeout(() => {
            
            if (pathname !== '/users/login' && pathname !== '/users/register') {
                if (!user?.user?._id) {
                    navigate('/users/login');
                    return;
                }
            }


            if (pathname === '/users/login' ||  pathname === '/users/register') {
                if (user?.user?._id) {
                    navigate('/');
                    return;
                }
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [user, location, navigate]);

    return (
        <>
            {children}
        </>
    );
});

export default Wrapper;