import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const LoginTester = () => {
  const { login, user } = useAuth();
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testPassword, setTestPassword] = useState('password123');

  const handleTestLogin = async () => {
    try {
      await login(testEmail, testPassword);
      toast.success('Login test successful!');
    } catch (error) {
      toast.error('Login test failed: ' + error.message);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border max-w-sm">
      <h3 className="font-bold text-sm mb-2">Login Test</h3>
      {user ? (
        <div className="text-green-600 text-xs">
          ✅ Logged in as: {user.email}
        </div>
      ) : (
        <div className="space-y-2">
          <input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="Email"
            className="w-full text-xs border rounded px-2 py-1"
          />
          <input
            type="password"
            value={testPassword}
            onChange={(e) => setTestPassword(e.target.value)}
            placeholder="Password"
            className="w-full text-xs border rounded px-2 py-1"
          />
          <button
            onClick={handleTestLogin}
            className="w-full bg-blue-500 text-white text-xs py-1 rounded hover:bg-blue-600"
          >
            Test Login
          </button>
          <p className="text-xs text-gray-500">
            Demo mode: Any credentials work
          </p>
        </div>
      )}
    </div>
  );
};

export default LoginTester;