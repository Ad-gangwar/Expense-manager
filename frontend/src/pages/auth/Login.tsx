import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import HashLoader from 'react-spinners/HashLoader';
import Carousel from "../../components/Carousel";
import { LOGIN_USER } from "../../api/authAPIs";

const LoginPage = () => {
  let navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const slides = [
    'https://github.com/Ad-gangwar/Web-Relay/blob/main/Screenshot_2024-07-27_151555-removebg-preview.png?raw=true',
    'https://github.com/Ad-gangwar/Web-Relay/blob/main/Screenshot_2024-07-27_151618-removebg-preview.png?raw=true'
  ]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    const data = { email, password };
    try {
      const response = await LOGIN_USER(data);
      if (response.success) {
        const token = response.token;
        localStorage.setItem("expToken", token || "");
        localStorage.setItem("expUser", JSON.stringify(response.data));
        toast.success("Logged in Successfully!");
        navigate("/");
      } else {
        toast.error(response.error || "Enter valid Credentials!");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="flex w-[800px] h-[600px] bg-white rounded-xl rounded-bl-[65px] overflow-hidden">
        <div className="w-2/5 bg-gradient-to-b from-teal-500 to-teal-700 flex items-center justify-center m-3 rounded-xl rounded-bl-[65px] rounded-tr-[65px]">
          <Carousel autoSlide={true} >
            {[...slides.map((s) => (
              <img src={s} alt="Expense-Ease" />
            ))]}
          </Carousel>
        </div>

        <div className="w-3/5 p-6 px-8 mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            We are <span className="text-teal-600">ExpenseEase</span>
          </h2>
          <p className="text-gray-600 mb-6">
            <span className="text-2xl">👋</span> Welcome back! Log in to your account.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <label className="block text-gray-600 mb-1" htmlFor="email">
                Email
              </label>
              <input
                className="w-full p-3 rounded-lg bg-gray-200 text-gray-900"
                type="email"
                placeholder="Enter your Email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-12">
              <label className="block text-gray-600 mb-1" htmlFor="password">
                Password
              </label>
              <input
                className="w-full p-3 rounded-lg bg-gray-200 text-gray-900"
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              className="w-full p-3 rounded-full bg-teal-600 text-white hover:bg-teal-700"
              type="submit"
            >
              {loading ? <HashLoader size={35} color='white' /> : 'Login'}
            </button>
          </form>
          <div className="text-gray-600 mt-6 text-center">Not signed up? <span className="text-teal-700 font-semibold"><Link to="/signup">Sign Up</Link></span></div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
