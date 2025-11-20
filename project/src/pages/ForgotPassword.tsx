// src/pages/ForgotPassword.tsx

import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { NeonButton } from "@/components/ui/NeonButton";
import api from "@/services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setMsg("");
    setLoading(true);

    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMsg(res.data.message);
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-blue-900 via-purple-700 to-black">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center text-3xl text-white">
              Forgot Password
            </CardTitle>
            <CardDescription className="text-center text-gray-300">
              Enter your email to receive a reset link
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {msg && <p className="text-green-400 text-center">{msg}</p>}
              {error && <p className="text-red-400 text-center">{error}</p>}

              <div>
                <Label htmlFor="email" className="text-white">Email</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-3 text-gray-300 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-10 bg-white/20 border-white/30 text-white"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <NeonButton type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </NeonButton>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
