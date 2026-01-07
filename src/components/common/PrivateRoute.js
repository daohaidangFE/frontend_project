import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

export default function PrivateRoute({ component: Component, allowedRoles, ...rest }) {
    const { isLoggedIn, user, isLoading } = useAuth();
    const { t } = useTranslation();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <i className="fas fa-spinner fa-spin text-4xl text-brand"></i>
                <p className="ml-3 text-lg">{t('loading', 'Loading...')}</p>
            </div>
        );
    }
    
    return (
        <Route
            {...rest}
            render={(props) => {
                if (!isLoggedIn) {
                    // 1. Chưa đăng nhập -> Chuyển hướng đến trang Login
                    return <Redirect to="/auth/login" />;
                }

                // Lấy role đã được chuẩn hóa (chữ hoa)
                const userRole = user.role.toUpperCase(); 
                
                // 2. Kiểm tra vai trò
                if (allowedRoles && !allowedRoles.includes(userRole)) {
                    // Đã đăng nhập nhưng sai vai trò -> Cảnh báo và chuyển hướng đến trang chủ
                    alert(t('access_forbidden', 'You do not have permission to view this page.'));
                    return <Redirect to="/" />;
                }
                
                // 3. Đã đăng nhập và đúng vai trò -> Cho phép truy cập
                return <Component {...props} />;
            }}
        />
    );
}

PrivateRoute.propTypes = {
    component: PropTypes.oneOfType([PropTypes.elementType, PropTypes.func]).isRequired,
    allowedRoles: PropTypes.arrayOf(PropTypes.string),
};
