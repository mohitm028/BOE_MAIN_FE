// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';
// const LoginPage: React.FC = () => {
//   const [name, setName] = useState('');
//   const [mbkId, setMbkId] = useState('');
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const handleLogin = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (name && mbkId) {
//       localStorage.setItem('name', name);
//       localStorage.setItem('mbkId', mbkId);
//       login({name, mbkId});
//       navigate('/userprofile');
//     } else {
//       alert('Please fill in both fields');
//     }
//   };

//   return (
//     <div className="flex min-h-screen">
//       {/* Sidebar */}
//       <div className="hidden md:block">
//         {/* Import and use your Sidebar component here if you want */}
//       </div>
//       {/* Login Card */}
//       <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
//         <form
//           onSubmit={handleLogin}
//           className="bg-white rounded-xl shadow-2xl p-10 w-full max-w-md flex flex-col gap-6"
//         >
//           <h2 className="text-3xl font-bold text-blue-800 mb-2 text-center">Welcome Back</h2>
//           <p className="text-gray-500 text-center mb-4">Sign in to your account</p>
//           <input
//             type="text"
//             placeholder="Enter Name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="border border-blue-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//           <input
//             type="text"
//             placeholder="Enter MBKID"
//             value={mbkId}
//             onChange={(e) => setMbkId(e.target.value)}
//             className="border border-blue-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//           <button
//             type="submit"
//             className="bg-blue-700 text-white font-semibold py-2 rounded hover:bg-blue-800 transition"
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;
