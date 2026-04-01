'use client'

import { useState, useEffect, Suspense} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthFormWrapper from '../../../components/AuthFormWrapper';
import SocialAuth from '../../../components/SocialAuth';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { IoEye, IoEyeOff } from 'react-icons/io5'
import { FiRefreshCw } from 'react-icons/fi';
import { HiArrowLeft } from 'react-icons/hi'; 

interface LoginFormData {
    email: string;
    password: string;
    captchaInput: string;
    remberMe?: boolean;
}

interface ErrorObject {
    email?: string;
    password?: string;
    captcha?: string;
}

const generateCaptcha = () => { 
    const chars = 'ABCDEFGHIJKLMNOPQRSTUabcdefghijklmnopqrstuvwxyz123456789'; 
    let result = ''; 
    for (let i = 0; i < 6; i++) { 
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
};

const npm = "241712888"; 
const valid_email = `${npm}@gmail.com`; 
const valid_password = npm; 

const LoginPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams(); 
    const [captcha, setCaptcha] = useState("");
    const [isNotAuthorized, setIsNotAuthorized] = useState(false); 

    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: '',
        captchaInput: ''
    });

    const [errors, setErrors] = useState<ErrorObject>({});
    const [loginAttempts, setLoginAttempts] = useState<number>(3); 
    const [showPassword, setshowPassword] = useState(false);

    useEffect(() => { 
        setCaptcha(generateCaptcha());
    }, []);

    useEffect(() => { 
        if (searchParams.get('error') === 'unauthorized') { 
            setIsNotAuthorized(true);
        }
    }, [searchParams]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: undefined }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors: ErrorObject = {};
        if (!formData.email.trim()) {
            newErrors.email = 'Email tidak boleh kosong';
        } else if (formData.email !== valid_email) { 
            newErrors.email = 'Email harus sesuai dengan format npm kalian (cth. 1905@gmail.com)'
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Password tidak boleh kosong';
        } else if (formData.password !== valid_password) { 
            newErrors.password = 'Password harus sesuai dengan format npm kalian (cth. 220711905)'
        }

        if (!formData.captchaInput.trim()) {
            newErrors.captcha = 'Captcha belum diisi';
        } else if (formData.captchaInput !== captcha) {
            newErrors.captcha = 'Captcha tidak valid';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            
            const nextAttempts = loginAttempts - 1; 
            const finalAttempts = nextAttempts < 0 ? 0 : nextAttempts; 

            setLoginAttempts(finalAttempts); 

            if (finalAttempts === 0) { 
                toast.error('Kesempatan login habis!', { theme: 'dark' });
            } else { 
                toast.error(`Login Gagal! Sisa kesempatan: ${finalAttempts}`, { 
                    theme: 'dark',
                    position: 'top-right'
                });
            }

            return;
        }
        
        toast.success('Login Berhasil!', { theme: 'dark', position: 'top-right' });
        localStorage.setItem('isLoggedIn', 'true');
        document.cookie = "isLoggedIn=true; path=/";
        router.push('/home');
    };
    
    return (
        <AuthFormWrapper title={isNotAuthorized ? "" : "Login"}> 
            {isNotAuthorized ? ( 
                <div className="flex flex-col items-center space-y-6 w-full"> 
                    <div className="w-full rounded-2xl overflow-hidden border border-gray-100 shadow-md"> 
                        <img
                            src="/images/notauthorized.jpg"
                            alt="Not Authorized"
                            className="w-full h-48 object-contain bg-transparent"
                        />
                    </div>
                    <div className="text-center space-y-1.5">
                        <p className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
                            <span className="text-red-500">❌</span> Anda belum login
                        </p>
                        <p className="text-base text-gray-600"> 
                            Silahkan login terlebih dahulu
                        </p>
                    </div>
                    <button 
                        onClick={() => { 
                            setIsNotAuthorized(false); 
                            router.replace('/auth/login'); 
                        }}
                        className="w-fit px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-full flex items-center justify-center gap-2 transition-all shadow-md"
                    >
                        <HiArrowLeft size={18} /> Kembali
                    </button>
                </div>
            ) : (
            <form onSubmit={handleSubmit} className="space-y-4 w-full relative pt-4">
                <div className="text-center mt-2">
                    <p className="text-[15px] font-semibold text-gray-700">
                        Sisa Kesempatan: <span className={`font-bold ${loginAttempts <= 1 ? 'text-red-500' : 'text-blue-600'}`}>{loginAttempts}</span>
                    </p>
                </div>

                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                    <input
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Masukan email"
                    />
                    {errors.email && <p className="text-red-600 text-sm italic mt-1">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Masukan password"
                        />
                        <button 
                            type="button"
                            onClick={() => setshowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                        > 
                            {showPassword ? <IoEyeOff size={22} /> : <IoEye size={22} />}
                        </button>
                    </div>
                    {errors.password && <p className="text-red-600 text-sm italic mt-1">{errors.password}</p>}
                    <div className="flex items-center justify-between mt-2">
                            <label className="flex items-center text-sm text-gray-700">
                                <input
                                    type="checkbox"
                                    name="remberMe"
                                    checked={formData.remberMe || false}
                                    onChange={(e) =>
                                        setFormData(prev => ({ ...prev, remberMe: e.target.checked }))
                                    }
                                    className="mr-2 h-4 w-4 rounded border-gray-300"
                                />
                                Ingat Saya
                            </label>
                            <Link href="/auth/forgot-password" className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
                                Forgot Password?
                            </Link>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium text-gray-700">Captcha:</span>
                            <span className="font-mono text-lg font-bold text-gray-800 bg-gray-100 px-3 py-1.5 rounded">
                                {captcha || "..."}
                            </span>

                            <button 
                                type="button" 
                                onClick={() => setCaptcha(generateCaptcha())}
                                className="text-blue-600 hover:text-blue-800 transition-transform active:rotate-180 duration-500"
                                title="Ganti captcha"
                            >
                                <FiRefreshCw size={20} />
                            </button>
                        </div>
                        <input
                            type="text"
                            name="captchaInput"
                            value={formData.captchaInput}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.captcha ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Masukan captcha"
                        />
                        {errors.captcha && <p className="text-red-600 text-sm italic mt-1">{errors.captcha}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loginAttempts === 0} 
                        className={`w-full text-white font-semibold py-2.5 px-4 rounded-lg
                        ${loginAttempts === 0 
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        Sign In
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setLoginAttempts(3);
                            toast.success('Kesempatan login berhasil direset!', { theme: 'dark', position: 'top-right'}); 
                            }}
                        disabled={loginAttempts !== 0}
                        className={`w-full text-white font-semibold py-2.5 px-4 rounded-lg
                        ${loginAttempts !== 0 
                            ? 'bg-gray-400 text-gray-500 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700'}`}
                    >
                        Reset Kesempatan
                    </button>

                    <SocialAuth />

                    <p className="mt-6 text-center text-sm text-gray-600">
                        Tidak punya akun?{' '}
                        <Link href="/auth/register" className="text-blue-600 hover:text-blue-800 font-semibold">
                            Daftar
                        </Link>
                    </p>
                </form>
                )}
            </AuthFormWrapper>
        );
    };

export default LoginPage;