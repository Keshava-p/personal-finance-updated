// src/pages/ResetPassword.tsx

import React, { useState } from "react";
import { Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { NeonButton } from "@/components/ui/NeonButton";
import api from "@/services/api";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: any) => {
    e.preventDefault();
    setError("");
    setMsg("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password });
      setMsg("Password updated successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid or expired reset token");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-xl border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-3xl text-white">
              Reset Password
            </CardTitle>
            <CardDescription className="text-center text-gray-300">
              Enter your new password below
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleReset} className="space-y-4">

              {msg && <p className="text-green-400 text-center">{msg}</p>}
              {error && <p className="text-red-400 text-center">{error}</p>}

              <div>
                <Label htmlFor="password" className="text-white">New Password</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-3 text-gray-300 w-5 h-5" />
                  <Input
                    id="password"
                    type="password"
                    className="pl-10 bg-white/20 border-white/30 text-white"
                    placeholder="•••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="confirm" className="text-white">Confirm Password</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-3 text-gray-300 w-5 h-5" />
                  <Input
                    id="confirm"
                    type="password"
                    className="pl-10 bg-white/20 border-white/30 text-white"
                    placeholder="•••••••"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                  />
                </div>
              </div>

              <NeonButton type="submit" className="w-full" disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </NeonButton>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
