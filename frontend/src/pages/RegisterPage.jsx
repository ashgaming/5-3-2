import React, { useEffect, useRef } from 'react';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { REGISTER_USER_ERROR, REGISTER_USER_RESET } from '../redux/constants/user.constant'
import Message from '../components/Elements/Message';
import { userRegister } from '../redux/actions/user.action';

const RegisterPage = () => {

  const firstnameRef = useRef(null)
  const lastnameRef = useRef(null)
  const emailRef = useRef(null)
  const passwordRef = useRef(null)

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, success, error, token } = useSelector(state => state.UserRegister)

  const HandleSubmit = (e) => {

    e.preventDefault();

    if (
      !firstnameRef.current.value ||
      !lastnameRef.current.value ||
      !emailRef.current.value ||
      !passwordRef.current.value
    ) {
      dispatch({
        type: REGISTER_USER_ERROR,
        payload: { error: 'All Field required' }
      })

      setTimeout(() => {
        dispatch({ type: REGISTER_USER_RESET });
      }, 5000);

      return
    }

    const data = {

      firstname: firstnameRef.current.value,
      lastname: lastnameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value
    }

    dispatch(userRegister(data));

  }

  useEffect(() => {
    if (token || success) {
      dispatch({ type: REGISTER_USER_RESET });
      navigate(`/`)
    }
  }, [token, success])



  return (
    <div className='w-screen h-screen flex items-center justify-center'>
      <div className="bg-white rounded-xl max-w-2xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600 mt-2">Sign up for your account</p>
        </div>

        {loading && <h1>Loading...</h1>}
        {error && <Message >{error}</Message>}

        <form className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">First Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                ref={firstnameRef}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your first name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">Last Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                ref={lastnameRef}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your last name"
              />
            </div>
          </div>

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
                placeholder="Create a password"
              />
            </div>
          </div>

          <button
            type="submit"
            onClick={e => HandleSubmit(e)}
            disabled={loading}
            className={`w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-white ${loading ? 'bg-gray-600 ' : 'bg-indigo-600'} hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500  `}
          >
            <UserPlus className="h-5 w-5 mr-2" />
            Sign up
          </button>

        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              <Link to={'/users/login'} >
                Sign in
              </Link>
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage
