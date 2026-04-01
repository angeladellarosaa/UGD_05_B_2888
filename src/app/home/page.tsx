'use client'
import React, { useEffect, useState } from "react"; 
import { useRouter } from 'next/navigation'; 
import Game1 from "../../components/Game1"; 
export default function Home() { 
    const router = useRouter(); 
    const [checking, setChecking] = useState(true);

    useEffect(() => { 
        const loginStatus = localStorage.getItem('isLoggedIn');

        if (loginStatus !== 'true') { 
            router.replace('/auth/login?error=unauthorized');
        } else { 
            setChecking(false);
        }
    }, [router]);

    if (checking) return null;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen min-w-screen">
            <h1 className="text-4xl font-bold mb-4 text-white">Selamat Datang!</h1><Game1 />
        </div>
    );
}