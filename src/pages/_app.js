import { useState, useEffect } from 'react';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await fetch('/api/users/verify', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          setIsLogin(data);
          if (!data) {
            localStorage.removeItem('token');
          }
        } catch (err) {
          setIsLogin(false);
          localStorage.removeItem('token');
        }
      } else {
        setIsLogin(false);
      }
    };
    checkLogin();
  }, []);

  return <Component {...pageProps} isLogin={isLogin} setIsLogin={setIsLogin} />;
}