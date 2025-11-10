import { useState } from 'react';
import loginCss from './login.module.css';
import { useAuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

export const LoginSignup = () => {
    const { login, signup } = useAuthContext();

    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({ email: '', username: '', password: '' });

    const handleChange = (e: any) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            if (isLogin) {
                // handle login
                if ((await login(form)).success) navigate('/');
            } else {
                // handle signup
                if ((await signup(form)).success) {
                    setIsLogin(false);
                }
            }
        } catch (err: any) {
            alert('Error: ' + err.response?.data?.message || err.message);
        }
    };

    return (
        <>
            {/* Apply the .container class from loginCss */}
            <div className={loginCss.container}>
                <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            // Apply the .inputField class
                            className={loginCss.inputField}
                        />
                    )}
                    <input
                        type="text"
                        name="username"
                        placeholder="Enter username"
                        value={form.username}
                        onChange={handleChange}
                        required
                        // Apply the .inputField class
                        className={loginCss.inputField}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        // Apply the .inputField class
                        className={loginCss.inputField}
                    />

                    {/* Apply the .submitButton class */}
                    <button type="submit" className={loginCss.submitButton}>
                        {isLogin ? 'Login' : 'Sign Up'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '10px' }}>
                    {isLogin
                        ? "Don't have an account?"
                        : 'Already have an account?'}{' '}
                    <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        // Apply the .toggleButton class
                        className={loginCss.toggleButton}
                    >
                        {isLogin ? 'Sign up' : 'Login'}
                    </button>
                </p>
            </div>
        </>
    );
};
