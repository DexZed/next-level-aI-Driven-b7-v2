"use client";

import Link from "next/link";

export default function Navbar() {
    const links = [
        { href: "/", label: "Home" },
        { href: "/explore", label: "Explore" },
        { href: "/services", label: "Services" },
        { href: "/technicians", label: "Technicians" },
    ]
    return <>
        <div className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex={-1}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        {links.map((link) => (
                            <li key={link.href}>
                                <Link href={link.href}>{link.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <a className="btn btn-ghost text-xl">Fix It Now</a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {links.map((link) => (
                        <li key={link.href}>
                            <Link href={link.href}>{link.label}</Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="navbar-end flex gap-2">
                <Link href={'/auth/login'} className="btn btn-outline rounded-md btn-accent">Login</Link>
                <Link href={'/auth/register'} className="btn btn-primary btn-outline rounded-md">Sign Up</Link>
            </div>
        </div></>
}