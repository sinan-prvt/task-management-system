import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await API.post('/login/', formData);
      localStorage.setItem('access', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);
      localStorage.setItem('username', formData.username);
      navigate('/dashboard');
    } catch (err) {
      console.log(err);
      setError('Invalid Credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      
      {/* Left Side - Illustration with Custom Brick Blob Background */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center bg-white p-8 relative overflow-hidden">
        
        {/* Background blobs with brick pattern */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          
          <div className="relative w-[400px] h-[350px]">
            {/* The SVG Brick Pattern definition inside a style block for easy use */}
            <style dangerouslySetInnerHTML={{__html: `
              .brick-bg {
                background-image: url("data:image/svg+xml,%3Csvg width='40' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='40' height='20' fill='%23eaeff5' /%3E%3Cpath d='M0,10 H40 M20,10 V20 M0,0 V10 M40,0 V10' stroke='%23ffffff' stroke-width='2' fill='none' /%3E%3C/svg%3E");
              }
            `}} />
            
            {/* Top right pill */}
            <div className="absolute -top-6 -right-12 w-48 h-16 rounded-full brick-bg"></div>
            
            {/* Top small pill */}
            <div className="absolute -top-10 left-12 w-24 h-12 rounded-full brick-bg"></div>

            {/* Left sticking out pill */}
            <div className="absolute top-20 -left-16 w-32 h-20 rounded-full brick-bg"></div>

            {/* Bottom left pill */}
            <div className="absolute bottom-16 -left-10 w-40 h-24 rounded-full brick-bg"></div>

            {/* Main large center blob */}
            <div className="absolute inset-0 rounded-[3rem] brick-bg shadow-sm"></div>

            {/* Black base floor */}
            <div className="absolute -bottom-6 -left-12 -right-8 h-6 bg-[#0a0f12] rounded-full"></div>
            {/* Small black dot on the right of the base */}
            <div className="absolute -bottom-6 -right-14 w-4 h-4 bg-[#0a0f12] rounded-full"></div>
            {/* Small black rectangle on the left */}
            <div className="absolute -bottom-8 -left-4 w-12 h-3 bg-[#0a0f12] rounded-full"></div>
          </div>

        </div>

        {/* The actual illustration image placed on top */}
        <img 
          src="/illustration.png" 
          alt="Login Illustration" 
          className="relative z-10 max-w-[85%] h-auto object-contain transform translate-y-4"
        />
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Login</h2>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="relative">
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-700 pr-12"
              />
              <div className="absolute right-4 top-3.5 text-gray-800">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••"
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-700 pr-12"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-gray-800 hover:text-blue-500 focus:outline-none"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>



            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#4285F4] hover:bg-blue-600 text-white font-medium rounded-full shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 flex justify-center items-center gap-2"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-500 hover:underline font-medium">
                Get started for free
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
