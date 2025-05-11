import React, { useState, useEffect, useRef } from 'react';
import { auth } from '../../firebase';
import { 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  // Form state
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);  
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate();

  // Animation refs
  const leftCharacterRef = useRef(null);
  const rightCharacterRef = useRef(null);
  const formRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is already logged in, redirect to dashboard
        navigate('/dashboard');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    // Animate left character with more complex movement
    if (leftCharacterRef.current) {
      leftCharacterRef.current.animate([
        { transform: 'translateY(-20px) scale(1) rotate(-5deg)' },
        { transform: 'translateY(0px) scale(1.05) rotate(0deg)' },
        { transform: 'translateY(20px) scale(1) rotate(5deg)' },
        { transform: 'translateY(0px) scale(1.02) rotate(0deg)' },
        { transform: 'translateY(-20px) scale(1) rotate(-5deg)' }
      ], {
        duration: 6000,
        iterations: Infinity,
        easing: 'ease-in-out'
      });
    }

    // Animate right character with different timing
    if (rightCharacterRef.current) {
      rightCharacterRef.current.animate([
        { transform: 'translateY(20px) scale(1) rotate(5deg)' },
        { transform: 'translateY(0px) scale(1.05) rotate(0deg)' },
        { transform: 'translateY(-20px) scale(1) rotate(-5deg)' },
        { transform: 'translateY(0px) scale(1.02) rotate(0deg)' },
        { transform: 'translateY(20px) scale(1) rotate(5deg)' }
      ], {
        duration: 6500,
        iterations: Infinity,
        easing: 'ease-in-out'
      });
    }

    // Enhanced form animation with better timing
    if (formRef.current) {
      formRef.current.animate([
        { opacity: 0, transform: 'translateY(30px) scale(0.95)' },
        { opacity: 1, transform: 'translateY(0) scale(1)' }
      ], {
        duration: 1000,
        fill: 'forwards',
        easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)'
      });
    }

    // Enhanced parallax effect for bubbles
    if (containerRef.current) {
      const handleMouseMove = (e) => {
        const bubbles = document.querySelectorAll('.login-bubble');
        const { width, height, left, top } = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        
        bubbles.forEach((bubble, i) => {
          const depth = (i % 5 + 1) / 5; // Create depth factor
          const moveX = x * 30 * depth;
          const moveY = y * 30 * depth;
          bubble.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) scale(${1 + (i % 3) * 0.05})`;
        });
      };
      
      containerRef.current.addEventListener('mousemove', handleMouseMove);
      
      // Clean up event listener
      return () => {
        if (containerRef.current) {
          containerRef.current.removeEventListener('mousemove', handleMouseMove);
        }
      };
    }
  }, []);

  // Handle form toggle with animation
  const toggleForm = () => {
    if (formRef.current) {
      // Add animation when toggling form
      formRef.current.animate([
        { opacity: 1, transform: 'translateY(0) scale(1)' },
        { opacity: 0.5, transform: 'translateY(10px) scale(0.98)' },
        { opacity: 1, transform: 'translateY(0) scale(1)' }
      ], {
        duration: 400,
        easing: 'ease-out'
      });
    }
    
    setIsLogin(!isLogin);
    setError('');
    setSuccessMsg('');
  };

  // Handle email/password login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');
    
    try {
      if (isLogin) {
        // Login
        await signInWithEmailAndPassword(auth, email, password);
        setSuccessMsg('Login successful!');
        navigate('/dashboard'); // redirect on login
      } else {
        // Register
        await createUserWithEmailAndPassword(auth, email, password);
        setSuccessMsg('Account created successfully!');
        // Additional actions like updating profile with username, etc.
      }
    } catch (err) {
      console.error(err);
      setError(isLogin ? 'Login failed. Please check your credentials.' : 'Registration failed. Please try again.');
    }
    
    setLoading(false);
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    setSuccessMsg('');
    
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setSuccessMsg('Google login successful!');
      navigate('/dashboard'); // redirect on Google login
    } catch (err) {
      console.error(err);
      setError('Google login failed. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="login-container" ref={containerRef}>
      {/* Background bubbles */}
      {[...Array(10)].map((_, index) => (
        <div 
          key={index}
          className="login-bubble"
        />
      ))}

      {/* Left animated character - updated with glowing icon */}
      <div className="character left" ref={leftCharacterRef}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          <defs>
            <radialGradient id="leftGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#a742ff" />
              <stop offset="100%" stopColor="#8a2be2" />
            </radialGradient>
            <filter id="leftBlur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
            </filter>
          </defs>
          <circle cx="60" cy="60" r="55" fill="url(#leftGlow)" opacity="0.7" filter="url(#leftBlur)" />
          <circle cx="60" cy="60" r="50" fill="url(#leftGlow)" />
        </svg>
      </div>

      {/* Right animated character - updated with glowing icon */}
      <div className="character right" ref={rightCharacterRef}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          <defs>
            <radialGradient id="rightGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#ff7eb6" />
              <stop offset="100%" stopColor="#e84393" />
            </radialGradient>
            <filter id="rightBlur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
            </filter>
          </defs>
          <circle cx="60" cy="60" r="55" fill="url(#rightGlow)" opacity="0.7" filter="url(#rightBlur)" />
          <circle cx="60" cy="60" r="50" fill="url(#rightGlow)" />
        </svg>
      </div>

      {/* Login/Registration form - with glassmorphism */}
      <div className="form-container" ref={formRef}>
        <form onSubmit={handleEmailLogin} className="login-form">
          <h2>{isLogin ? 'Login' : 'Create Account'}</h2>
          
          {!isLogin && (
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required={!isLogin}
                autoComplete="username"
              />
            </div>
          )}
          
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              autoComplete="email"
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isLogin ? "Enter your password" : "Create a password"}
              required
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          {successMsg && <div className="success-message">{successMsg}</div>}
          
          <button 
            type="submit" 
            className="primary-button"
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner"></span>
            ) : isLogin ? 'Login' : 'Create Account'}
          </button>
          
          <div className="divider">
            <span>OR</span>
          </div>
          
          <button 
            type="button" 
            className="google-button"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            Continue with Google
          </button>
          
          <div className="form-footer">
            <button 
              type="button" 
              className="toggle-button"
              onClick={toggleForm}
            >
              {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}