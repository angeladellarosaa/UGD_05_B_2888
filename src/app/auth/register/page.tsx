'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthFormWrapper from '../../../components/AuthFormWrapper';
import SocialAuth from '../../../components/SocialAuth';
import { toast } from 'react-toastify';
import { IoEye, IoEyeOff } from 'react-icons/io5'
import { FiRefreshCw } from 'react-icons/fi';

type RegisterFormData = {
    username: string;
    email: string;
    nomorTelp: string;
    password: string;
    confirmPassword: string;
    captcha: string;
}

const generateCaptcha = () => { 
    const chars = 'ABCDEFGHIJKLMNOPQRSTUabcdefghijklmnopqrstuvwxyz123456789'; 
    let result = ''; 
    for (let i = 0; i < 6; i++) { 
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
};

const RegisterPage = () => {
    const router = useRouter();
    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<RegisterFormData>({mode: "onSubmit"});
    const [captcha, setCaptcha] = useState(generateCaptcha());
    const [showPassword, setshowPassword] = useState(false); 
    const [showConfirm, setshowConfirm] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [strength, setStrength] = useState(0); 
    const [confirmStrength, setConfirmStrength] = useState(0); 

    const password = watch('password', '');
    const confirmPassword = watch('confirmPassword', ''); 
    useEffect(() => { 
        const currentStrength = Math.min(
            (password.length > 7 ? 25 : 0) + 
            (/[A-Z]/.test(password) ? 25 : 0) + 
            (/[0-9]/.test(password) ? 25 : 0) + 
            (/[^A-Za-z0-9]/.test(password) ? 25 : 0), 
            100
        );

        setStrength(currentStrength);
    }, [password]);

    useEffect(() => { 
        const currentStrength = Math.min(
            (confirmPassword.length > 7 ? 25 : 0) + 
            (/[A-Z]/.test(confirmPassword) ? 25 : 0) + 
            (/[0-9]/.test(confirmPassword) ? 25 : 0) + 
            (/[^A-Za-z0-9]/.test(confirmPassword) ? 25 : 0), 
            100
        );
        
        setConfirmStrength(currentStrength);
    }, [confirmPassword]); 

    const onSubmit = (data: RegisterFormData) => {
        setIsSubmitted(true); 

        if (data.password !== data.confirmPassword) {
            toast.error('Konfirmasi password tidak cocok.', { theme: 'dark' });
            return;
        }

        if (data.captcha !== captcha) {
            toast.error('Captcha salah.', { theme: 'dark' });
            return;
        }

        toast.success('Register Berhasil!', {theme: 'dark', position: 'top-right'});
        router.push('/auth/login');
    };

    return (
        <AuthFormWrapper title="Register">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">

                <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium text-gray-700">
                        Username <span className="text-gray-500 text-xs">(max 8 karakter)</span>
                    </label>
                    <input
                        id="username"
                        {...register('username', {
                            required: 'Username wajib diisi', 
                            minLength: { 
                                value: 3,
                                message: 'Username minimal 3 karakter'
                            },
                            maxLength: { 
                                value: 8, 
                                message: 'Username maksimal 8 karakter'
                            }
                        })}
                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Masukkan username"
                    />
                    {isSubmitted && errors.username && <p className="text-red-600 text-sm italic mt-1">{errors.username.message}</p>}
                </div>

                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                    <input
                        id="email"
                        type="email"
                        {...register('email', { 
                            required: 'Email wajib diisi',
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.(com|net|co)$/,
                                message: 'Format email tidak valid'
                            }
                        })}
                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Masukkan email"
                    />
                    {isSubmitted && errors.email && <p className="text-red-600 text-sm italic mt-1">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                    <label htmlFor="nomorTelp" className="text-sm font-medium text-gray-700">Nomor Telepon</label>
                    <input
                        id="nomorTelp"
                        type="tel"
                        {...register('nomorTelp', { 
                            required: 'Nomor telepon wajib diisi',
                            minLength: {
                                value: 10, 
                                message: 'Nomor telepon minimal 10 karakter'
                            }, 
                        })}
                        onInput={(e) => {
                            e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
                        }}
                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.nomorTelp ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Masukkan nomor telepon"
                    />
                    {errors.nomorTelp && <p className="text-red-600 text-sm italic mt-1">{errors.nomorTelp.message}</p>}
                </div>

                <div className="space-y-3">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                    <div className='relative'>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            {...register('password', { 
                                required: 'Password wajib diisi',
                                minLength: { 
                                    value: 8, 
                                    message: 'Password minimal 8 karakter'
                                }
                            })}
                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Masukkan password"
                        />
                        <button 
                            type="button"
                            onClick={() => setshowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        > 
                            {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                        </button>
                    </div>

                    {isSubmitted && errors.password && (
                        <p className="text-red-600 text-sm italic min-h-[20px]">
                            {errors.password.message}
                        </p>
                    )}

                    {password.length > 0 && (
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 relative"> 
                            <div
                                className={`h-1.5 rounded-full transition-all duration-500 ${
                                    strength <= 25 ? 'bg-red-500' : 
                                    strength <= 50 ? 'bg-orange-500' : 
                                    'bg-green-500' 
                                }`}
                                style={{ width: `${strength}%`}}
                            ></div>

                            <p className="text-sm text-gray-600 mt-1 font-medium">
                                Strength: <span className="font-bold">{strength}%</span>
                            </p>
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Konfirmasi Password</label>
                    <div className='relative'>
                        <input
                            id="confirmPassword"
                            type={showConfirm ? 'text' : 'password'}
                            {...register('confirmPassword', { 
                                required: 'Konfirmasi password wajib diisi',
                                validate: value => value === password || 'Konfirmasi password tidak cocok' 
                            })}
                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Masukkan ulang password"
                        />
                        <button 
                            type="button"
                            onClick={() => setshowConfirm(!showConfirm)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        > 
                            {showConfirm ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                        </button>
                    </div>

                    {confirmPassword !== "" && (
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-3 relative"> 
                            <div
                                className={`h-1.5 rounded-full transition-all duration-500 ${
                                    confirmStrength <= 25 
                                        ? 'bg-red-500'
                                        : confirmStrength <= 50
                                        ? 'bg-orange-500'
                                        : 'bg-green-500'
                                }`}

                                style={{
                                    width: `${confirmStrength}%`
                                }}
                            ></div>

                            <p className="text-sm text-gray-600 mt-1 font-medium"> 
                                {confirmPassword !== password
                                    ? <span className="text-red-500 italic">Password tidak cocok</span>
                                    : <>Strength: <span className="font-bold">{confirmStrength}%</span></>
                                }
                            </p>
                        </div>
                    )}

                    {isSubmitted && errors.confirmPassword && (
                        <p className="text-red-600 text-sm italic min-h-[20px]">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-700">Captcha:</span>
                        <span className="font-mono text-lg font-bold text-gray-800 bg-gray-100 px-3 py-1.5 rounded">{captcha}</span>
                        <button 
                            type="button" 
                            onClick={() => setCaptcha(generateCaptcha())}
                            className="text-blue-600 hover:text-blue-800 text-xs transition-colors"
                            title='Ganti kode'
                        >
                            <FiRefreshCw size={18} />
                        </button>
                    </div>

                    <input
                        type="text"
                        {...register('captcha', {
                            required: 'Captcha wajib diisi',
                            validate: value => value === captcha || 'Harus sesuai dengan captcha yang ditampilkan' 
                        })}
                        className={`w-full px-4 py-2.5 rounded-lg border ${
                            errors.captcha ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Masukkan captcha"
                    />
                    {isSubmitted && errors.captcha && (
                        <p className='text-red-600 text-sm italic mt-1'>
                            {errors.captcha.message}
                        </p>
                    )}
                </div>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg">
                    Register
                </button>

                <SocialAuth />
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
                Sudah punya akun? <Link href="/auth/login" className="text-blue-600 hover:text-blue-800 font-semibold">Login</Link>
            </p>
        </AuthFormWrapper>
    );
};

export default RegisterPage;