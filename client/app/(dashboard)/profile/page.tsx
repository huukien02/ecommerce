"use client";

import { useMe, useLogout } from "@/features/auth/auth.hooks";
import { Button } from "@/components/ui/button";
import { LogOut, User as UserIcon, Mail } from "lucide-react";

export default function ProfilePage() {
    const { data } = useMe();
    const { mutate: logout, isPending: isLoggingOut } = useLogout();


    const userName = data?.data?.name || "User";
    const userEmail = data?.data?.email || "Unknown Email";
    const userRole = data?.data?.role || "Member";

    return (
        <div className="min-h-[calc(100vh-16rem)] bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden w-full">
            {/* Background elements */}
            <div className="absolute w-[800px] h-[800px] bg-violet-600/10 rounded-full blur-[100px] -top-40 -right-40 animate-pulse duration-1000"></div>
            <div className="absolute w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] bottom-0 -left-20 dark:mix-blend-screen mix-blend-multiply"></div>

            <div className="w-full max-w-xl relative z-10">
                <div className="bg-card border border-border backdrop-blur-2xl rounded-3xl p-8 shadow-2xl">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-24 h-24 bg-gradient-to-br from-violet-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-violet-500/30 mb-4 border-2 border-background">
                            <span className="text-4xl text-white font-bold uppercase">
                                {userName.charAt(0)}
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">
                            {userName}
                        </h1>
                        <p className="text-muted-foreground mt-1">Role: {userRole}</p>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-center p-4 rounded-2xl bg-muted/50 border border-border">
                            <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center mr-4">
                                <UserIcon className="w-5 h-5 text-violet-500 dark:text-violet-300" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Full Name</p>
                                <p className="text-foreground font-medium">{userName}</p>
                            </div>
                        </div>

                        <div className="flex items-center p-4 rounded-2xl bg-muted/50 border border-border">
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-4">
                                <Mail className="w-5 h-5 text-blue-500 dark:text-blue-300" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Email Address</p>
                                <p className="text-foreground font-medium">{userEmail}</p>
                            </div>
                        </div>

                    </div>

                    <Button
                        onClick={() => logout()}
                        disabled={isLoggingOut}
                        variant="destructive"
                        className="w-full h-12 text-base font-semibold rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 dark:text-red-400 border border-red-500/20 hover:border-red-500/30 transition-all shadow-none"
                    >
                        <LogOut className="w-5 h-5 mr-2" />
                        {isLoggingOut ? "Logging out..." : "Logout"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
