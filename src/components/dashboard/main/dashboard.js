"use client";

import useAuthStore from "@/stores/auth-store";
import { BookmarkIcon, ClockIcon, ComputerDesktopIcon, HeartIcon, InboxIcon, UserGroupIcon, UsersIcon } from "@heroicons/react/24/outline";

export default function Dashboard({ totalNews, totalReporters, totalPendingNews, totalEditors, totalMails, user }) {

    const dashboardData = [
        {
            title: "Total Posts",
            value: totalNews,
            icon: <ComputerDesktopIcon />
        },
        {
            title: "Total Pending Posts",
            value: totalPendingNews,
            icon: <ClockIcon />
        },
        {
            title: "Total Inbox Mails",
            value: totalMails,
            icon: <InboxIcon />
        },
        {
            title: "Total Reporters",
            value: totalReporters,
            icon: <UserGroupIcon />
        },
        {
            title: "Total Editors",
            value: totalEditors,
            icon: <UserGroupIcon />
        },

        {
            title: "Total Users",
            value: 10,
            icon: <UsersIcon />
        }
    ];

    const userDashboardData = [
        {
            title: "Total Favorite News",
            value: user?.total_favorite_news || 0,
            icon: <HeartIcon />
        },
        {
            title: "Total Bookmarked News",
            value: user?.total_bookmarked_news || 0,
            icon: <BookmarkIcon />
        },
    ]


    return (
        <>
            <div className="mx-auto max-w-7xl mb-4">
                <h1 className="text-xl font-medium text-gray-900"> Welcome to {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} dashboard</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {
                    user?.role === "admin" &&
                    dashboardData.map(data => (
                        <div className="overflow-hidden bg-white shadow sm:rounded-lg" key={data.title}>
                            <div className="px-4 py-5 sm:p-6 space-y-10">
                                <div className="w-8 h-8">
                                    {data.icon}
                                </div>
                                <div className="flex justify-between">
                                    <h3 className="text-base">{data.title}</h3>
                                    <span>{data.value}</span>
                                </div>
                            </div>
                        </div>
                    ))
                }
                {
                    (user?.role === "reporter" || user?.role === "editor") &&
                    dashboardData.slice(0, 1).map(data => (
                        <div className="overflow-hidden bg-white shadow sm:rounded-lg" key={data.title}>
                            <div className="px-4 py-5 sm:p-6 space-y-10">
                                <div className="w-8 h-8">
                                    {data.icon}
                                </div>
                                <div className="flex justify-between">
                                    <h3 className="text-base">{data.title}</h3>
                                    <span>{data.value}</span>
                                </div>
                            </div>
                        </div>
                    ))
                }
                {
                    (user?.role === "user" || user?.role === "editor" || user?.role === "reporter") &&
                    userDashboardData.map(data => (
                        <div className="overflow-hidden bg-white shadow sm:rounded-lg" key={data.title}>
                            <div className="px-4 py-5 sm:p-6 space-y-10">
                                <div className="w-8 h-8">
                                    {data.icon}
                                </div>
                                <div className="flex justify-between">
                                    <h3 className="text-base">{data.title}</h3>
                                    <span>{data.value}</span>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}


