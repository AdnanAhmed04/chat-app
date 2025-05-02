import React, { useState, useEffect } from 'react';

const Login = ({ switchPage, closeModal }) => {
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setForm((prev) => ({ ...prev, email: rememberedEmail, remember: true }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.email.includes('@')) newErrors.email = 'Valid email required';
    if (form.password.length < 6) newErrors.password = 'Minimum 6 characters required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (form.remember) {
      localStorage.setItem('rememberedEmail', form.email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    console.log('Login data:', form);
    closeModal(); // Simulate login success
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <h2 className="text-xl font-bold text-center mb-4 text-gray-200">Login</h2>

      <div className="mb-3">
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className={`w-full px-4 py-2 text-gray-200 bg-transparent border rounded-lg ${
            errors.email ? 'border-red-500' : 'border-gray-500'
          }`}
          required
        />
        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
      </div>

      <div className="mb-3 relative">
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className={`w-full px-4 py-2 text-gray-200 bg-transparent border rounded-lg ${
            errors.password ? 'border-red-500' : 'border-gray-500'
          }`}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute top-2.5 right-3 text-sm text-gray-500 hover:text-gray-400"
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
        {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
      </div>

      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="remember"
          name="remember"
          checked={form.remember}
          onChange={handleChange}
          className="mr-2"
        />
        <label htmlFor="remember" className="text-sm text-gray-500">
          Remember me
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-lg"
      >
        Login
      </button>

      <p className="mt-4 text-sm text-center text-gray-500">
        Don’t have an account?{' '}
        <button type="button" onClick={switchPage} className="text-gray-400 hover:underline">
          Sign up
        </button>
      </p>
    </form>
  );
};

export default Login;
