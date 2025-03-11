import React, { useEffect, useRef } from 'react';
import { Mail, Lock, LogIn, Loader } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Elements/Message';
import { userLogin } from '../redux/actions/user.action';

const LoginPage = () => {
  const dispatch = useDispatch();
 

    const { loading ,success ,error } = useSelector(state=>state.UserLogin)

    const emailRef = useRef(null);
    const passwordRef = useRef(null);


    const SubmitHandler = (e) =>{
        e.preventDefault();

        if(!emailRef.current.value || !passwordRef.current.value){
            alert('Enter Email and Password...!')
            return
        }

        const data = {
            email:emailRef.current.value,
            password:passwordRef.current.value
        }

        dispatch(userLogin(data));
    }

    return (
        <div className='w-screen h-screen flex items-center justify-center'>
            <div className="bg-white rounded-xl max-w-2xl self-center shadow-lg p-8 space-y-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
                    <p className="text-gray-600 mt-2">Please sign in to your account</p>
                </div>

                <form className="space-y-4" onSubmit={(e)=>SubmitHandler(e)}>

                    { loading && <Loader />  }
                    { error && <Message type={'error'}>{error}</Message> }
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 block">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="email"
                                ref={emailRef}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 block">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="password"
                                ref={passwordRef}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 text-sm text-gray-600">Remember me</label>
                        </div>
                        <button type="button" className="text-sm text-indigo-600 hover:text-indigo-500">
                            Forgot password?
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <LogIn className="h-5 w-5 mr-2" />
                        Sign in
                    </button>
                </form>

                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <button
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            <Link to={'/register'}>
                                Register now
                            </Link>
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage
