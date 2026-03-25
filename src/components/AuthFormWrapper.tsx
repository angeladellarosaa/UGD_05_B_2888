import React, { ReactNode } from 'react'; 
interface AuthFormWrapperProps { 
    title: string; 
    children: ReactNode; 
}
const AuthFormWrapper = ({ title, children }: AuthFormWrapperProps)=> { 
    return ( 
        <div className="w-full max-w-md bg-white rounded-xl shadowlg p-8">
            <h2 className="text-3x1 font-bold text-center mb-8 textprimary">
                {title}
            </h2>
            {children}
        </div>
    );
};
export default AuthFormWrapper;