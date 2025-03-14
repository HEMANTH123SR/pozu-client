


"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, MessageCircle, Bell, Menu, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export function Navbar() {
    const [isMobile, setIsMobile] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768)
            if (window.innerWidth >= 768) {
                setIsMenuOpen(false)
            }
        }

        checkIfMobile()
        window.addEventListener("resize", checkIfMobile)

        return () => {
            window.removeEventListener("resize", checkIfMobile)
        }
    }, [])

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    return (
        <header className="sticky top-0 z-50 w-full bg-white shadow-md">
            <div className="flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <span className="text-3xl font-bold text-primary">POZU</span>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                {isMobile && (
                    <Button variant="ghost" size="icon" onClick={toggleMenu} className="md:hidden">
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                )}

                {/* Search Bar - Hide on Mobile */}
                <div className="relative hidden md:block max-w-md w-full mx-4">
                    <div className="relative flex items-center">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
                        <Input
                            type="search"
                            placeholder="Search Facebook"
                            className="w-full rounded-full bg-[#F0F3F4] border-none pl-12 focus-visible:ring-0 focus-visible:ring-offset-0 py-1 text-xl"
                        />
                    </div>
                </div>

                {/* Right Side Controls */}
                <div className="flex items-center gap-2">
                    <SignedIn>
                        <div className="relative">
                            <Button variant="ghost" size="icon" className="rounded-full border bg-bgsec text-black">
                                <MessageCircle className="h-7 w-7" />
                            </Button>
                        </div>

                        <div className="relative">
                            <Button variant="ghost" size="icon" className="rounded-full border bg-bgsec text-black">
                                <Bell className="h-7 w-7" />
                            </Button>
                        </div>

                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>

                    <SignedOut>
                        <div className="hidden md:flex gap-2">
                            <SignInButton mode="modal">
                                <Button variant="outline" size="sm">Sign In</Button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <Button size="sm">Sign Up</Button>
                            </SignUpButton>
                        </div>
                    </SignedOut>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobile && isMenuOpen && (
                <div className="md:hidden bg-white p-4 shadow-lg">
                    <div className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                type="search"
                                placeholder="Search"
                                className="w-full rounded-full bg-[#F0F3F4] border-none pl-10 py-1"
                            />
                        </div>

                        <SignedOut>
                            <div className="flex flex-col gap-2">
                                <SignInButton mode="modal">
                                    <Button className="w-full" variant="outline">Sign In</Button>
                                </SignInButton>
                                <SignUpButton mode="modal">
                                    <Button className="w-full">Sign Up</Button>
                                </SignUpButton>
                            </div>
                        </SignedOut>
                    </div>
                </div>
            )}
        </header>
    )
}