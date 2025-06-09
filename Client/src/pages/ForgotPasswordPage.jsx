import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowLeft, CheckCircle, Eye, EyeOff } from "lucide-react";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Reset Password
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const requestOTP = async (data) => {
    setIsLoading(true);
    try {
      await authAPI.requestResetOTP({ email: data.email });
      setEmail(data.email);
      setStep(2);
      toast.success("OTP sent to your email!");
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (data) => {
    setIsLoading(true);
    try {
      await authAPI.resetPassword({
        email,
        otp: data.otp,
        newPassword: data.newPassword,
      });
      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    if (step === 1) {
      await requestOTP(data);
    } else {
      await resetPassword(data);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <Link
            to="/login"
            className="inline-flex items-center text-gray-600 hover:text-yoga-purple transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-yoga-purple to-yoga-pink bg-clip-text text-transparent">
              Reset Password
            </h2>
            <p className="text-gray-600 mt-2">
              {step === 1
                ? "Enter your email to receive OTP"
                : "Enter OTP and new password"}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 1
                    ? "bg-yoga-purple text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                1
              </div>
              <div
                className={`w-20 h-1 ${
                  step >= 2 ? "bg-yoga-purple" : "bg-gray-200"
                }`}
              />
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 2
                    ? "bg-yoga-purple text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                2
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email address",
                      },
                    })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yoga-purple focus:border-transparent transition-all"
                    placeholder="your@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            ) : (
              <>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <p className="text-sm text-green-700">
                      OTP sent to {email}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    OTP Code
                  </label>
                  <input
                    type="text"
                    {...register("otp", {
                      required: "OTP is required",
                      minLength: {
                        value: 6,
                        message: "OTP must be 6 digits",
                      },
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yoga-purple focus:border-transparent transition-all text-center text-2xl tracking-widest"
                    placeholder="123456"
                    maxLength="6"
                  />
                  {errors.otp && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.otp.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("newPassword", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters",
                        },
                        pattern: {
                          value:
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                          message:
                            "Password must contain uppercase, lowercase, number and special character",
                        },
                      })}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yoga-purple focus:border-transparent transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 flex items-center justify-center"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : step === 1 ? (
                "Send OTP"
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
