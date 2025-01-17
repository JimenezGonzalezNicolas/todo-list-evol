import React from "react";
import Logo from '../assets/images/img/evol_logo_blanco-1024x590.png';

interface HeaderProps {
    title: string;
    subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
    return (
        <header className="bg-blue-500 text-white p-4 flex items-center justify-center lg:justify-between">
            <div className="hidden lg:flex lg:flex-col lg:w-7/8">
                <h1 className="text-2xl font-bold">{title}</h1>
                {subtitle && <p className="text-sm">{subtitle}</p>}
            </div>
            <div className="flex justify-center">
                <img
                    src={Logo}
                    alt="EVOL Logo"
                    className="w-16 h-16 object-contain"
                />
            </div>
        </header>
    );
};

export default Header;
