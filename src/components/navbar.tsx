"use client";
import React from 'react';
import Link from 'next/link';

interface NavbarProps {
  ThemeButton: React.ReactNode; // Accepts a ThemeButton component as a prop
}

export default function Navbar({ ThemeButton }: NavbarProps) {
  return (
    <div className="navbar fixed glass h-[80px] z-10">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li><Link href="/edit" className="font-black mr-5">Edit</Link></li>
            <li><Link href="/print" className="font-black mr-5">Print</Link></li>
          </ul>
        </div>
        <Link href="/" className="text-5xl ml-10 subpixel-antialiased font-black">BestWay</Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link href="/edit" className="font-black mr-5 text-xl">Edit</Link></li>
          <li><Link href="/print" className="font-black mr-5 text-xl">Print</Link></li>
        </ul>
      </div>
      <div className="navbar-end font-black">
        {ThemeButton}
      </div>
    </div>
  );
}
