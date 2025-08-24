import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: false
  });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login/signup - redirect to dashboard
    navigate("/");
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex items-center justify-between">
        
        {/* Left Side - Branding and Illustration */}
        <div className="hidden lg:flex flex-col justify-center flex-1 pr-12">
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-emerald-400 mb-4">FinMate</h1>
            <p className="text-xl text-slate-300">Smarter Family Budgeting, Together.</p>
          </div>
          
          {/* Illustration Placeholder */}
          <div className="w-full max-w-lg mx-auto">
            <div className="relative">
              {/* Family illustration with coins and house */}
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-green-400/20 to-transparent"></div>
                
                {/* House illustration */}
                <div className="relative z-10 flex items-end justify-center space-x-4">
                  <div className="w-32 h-24 bg-yellow-300 rounded-t-full relative">
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-yellow-600 rounded"></div>
                    <div className="absolute top-2 left-1/4 w-4 h-4 bg-purple-400 rounded"></div>
                    <div className="absolute top-8 right-1/4 w-4 h-4 bg-purple-400 rounded"></div>
                  </div>
                  
                  {/* Coins */}
                  <div className="space-y-2">
                    <div className="w-8 h-8 bg-yellow-400 rounded-full border-2 border-yellow-600"></div>
                    <div className="w-10 h-10 bg-yellow-400 rounded-full border-2 border-yellow-600"></div>
                    <div className="w-12 h-12 bg-yellow-400 rounded-full border-2 border-yellow-600"></div>
                  </div>
                  
                  {/* Money/Bills */}
                  <div className="w-16 h-10 bg-green-500 rounded transform rotate-12"></div>
                </div>
                
                {/* Trees */}
                <div className="absolute bottom-0 left-4">
                  <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                  <div className="w-2 h-8 bg-green-700 mx-auto"></div>
                </div>
                <div className="absolute bottom-0 right-8">
                  <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                  <div className="w-2 h-10 bg-green-700 mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-slate-600">
                {isLogin ? "Please sign in to your account" : "Please fill in your information"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10 h-12 border-slate-200 focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10 pr-10 h-12 border-slate-200 focus:border-emerald-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field (Sign Up only) */}
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-700">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className="pl-10 h-12 border-slate-200 focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Remember Me & Forgot Password (Login only) */}
              {isLogin && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) => handleInputChange("rememberMe", checked as boolean)}
                    />
                    <Label htmlFor="remember" className="text-sm text-slate-600">
                      Remember me
                    </Label>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-emerald-600 hover:text-emerald-700"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg"
              >
                {isLogin ? "Log In" : "Sign Up"}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500">or</span>
                </div>
              </div>

              {/* Google Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-slate-200 hover:bg-slate-50"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>
            </form>

            {/* Toggle between Login/Signup */}
            <div className="text-center mt-6">
              <p className="text-slate-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  {isLogin ? "Sign Up" : "Log In"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;