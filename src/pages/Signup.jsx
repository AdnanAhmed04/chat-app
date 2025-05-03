import React, { useState } from 'react';

const Signup = ({ switchPage, closeModal }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (form.name.trim().length < 3) newErrors.name = 'Name must be at least 3 characters';
    if (!form.email.includes('@')) newErrors.email = 'Valid email required';
    if (form.password.length < 6) newErrors.password = 'Minimum 6 characters required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    console.log('Signup data:', form);
    closeModal(); 
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <h2 className="text-xl font-bold text-center mb-4 text-gray-200">Create Your Account</h2>

      <div className="mb-3">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          className={`text-gray-200 w-full px-4 py-2 border rounded-lg ${
            errors.name ? 'border-red-500' : 'border-gray-500'
          }`}
          required
        />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
      </div>

      <div className="mb-3">
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className={`w-full px-4 py-2 text-gray-200 border rounded-lg ${
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
          className={`w-full text-gray-200 px-4 py-2 border rounded-lg ${
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

      <button
        type="submit"
        className="w-full bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-lg"
      >
        Sign Up
      </button>

      <p className="mt-4 text-sm text-center text-gray-500">
        Already have an account?{' '}
        <button type="button" onClick={switchPage} className="text-gray-400 hover:underline">
          Log in
        </button>
      </p>
    </form>
  );
};

export default Signup;
