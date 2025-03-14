import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

export const RightSideMenu = () => {
    const menuItems = [
        { icon: '👤', label: 'Hemantth Gowda', href: '/profile' },
        { icon: '👥', label: 'Friends', href: '/friends' },
        { icon: '📘', label: 'Welcome', href: '/welcome' },
        { icon: '⏳', label: 'Memories', href: '/memories' },
        { icon: '💾', label: 'Saved', href: '/saved' },
        { icon: '👥', label: 'Groups', href: '/groups' },
        { icon: '🎥', label: 'Video', href: '/video' },
        { icon: '🏬', label: 'Marketplace', href: '/marketplace' },
        { icon: '📡', label: 'Feeds', href: '/feeds' },
        { icon: '📅', label: 'Events', href: '/events' },
        { icon: '📊', label: 'Ads Manager', href: '/ads-manager' },
        { icon: '⋯', label: 'See more', href: '/see-more' },
    ];

    return (
        <div className="w-64 h-screen bg-white shadow-lg border-l border-gray-200">

            <ScrollArea className="h-[calc(100vh-120px)]">
                <div className="p-2">
                    {menuItems.map((item, index) => (
                        <a
                            key={index}
                            href={item.href}
                            className="flex items-center space-x-3 p-3 hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors duration-200"
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span className="text-sm font-medium">{item.label}</span>
                        </a>
                    ))}
                </div>
            </ScrollArea>
            <div className="p-4 text-xs text-gray-500 border-t border-gray-200">
                <p>Privacy · Terms · Advertising · Ad choices ▶</p>
                <p>Cookies · More · Meta © 2025</p>
            </div>
        </div>
    );
};



