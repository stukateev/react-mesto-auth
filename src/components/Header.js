import React from "react";
import logoSvg from "../images/logo.svg";
export default function Header() {
    return (
        <header className="header">
            <img className="header__logo" src={logoSvg} alt="Место логотип" />
        </header>
    );
}