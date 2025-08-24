"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plane, Users, Gift, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { LoginUser, RegisterUser } from "@/types";
import { Controller, useForm } from "react-hook-form";
import { FetchError } from "ofetch";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const { loginMutation, registerMutation } = useAuth();
  const { toast } = useToast();
  // form login
  const {
    control: loginControl,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
  } = useForm<LoginUser>({ defaultValues: { email: "", password: "" } });

  // form register
  const {
    control: registerControl,
    handleSubmit: handleRegisterSubmit,
    setError: registerSetError,
    formState: { errors: registerErrors, isSubmitting: isRegisterSubmitting },
  } = useForm<RegisterUser>({
    defaultValues: {
      country: "",
      dob: "",
      email: "",
      first_name: "",
      gender: "",
      last_name: "",
      password: "",
    },
  });

  const onLogin = (data: LoginUser) => {
    loginMutation.mutateAsync(data);
  };

  const onRegister = async (data: RegisterUser) => {
    try {
      const res = await registerMutation.mutateAsync(data);
    } catch (error) {
      const objectError = (error as FetchError).data?.errors?.user;
      if (objectError) {
        Object.entries((error as FetchError).data?.errors?.user ?? {}).forEach(
          ([field, message]) => {
            const _field = field === "date_of_birth" ? "dob" : field;
            registerSetError(_field as keyof RegisterUser, {
              type: "server",
              message: message as string,
            });
          }
        );
      } else {
        toast({
          title: "Registration failed",
          description: (error as Error).message,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-grey bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Authentication Forms */}
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-airline-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <Plane className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">LotusMiles</h1>
            <p className="text-gray-600 mt-2">
              Your journey to the skies begins here
            </p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>

            {/* Login Form */}
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome Back</CardTitle>
                  <CardDescription>
                    Sign in to your LotusMiles account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={handleLoginSubmit(onLogin)}
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor="login-email">Email</Label>
                      <Controller
                        name="email"
                        rules={{ required: "Email is required" }}
                        control={loginControl}
                        render={({ field }) => {
                          return (
                            <Input
                              type="email"
                              placeholder="Your Email"
                              {...field}
                            />
                          );
                        }}
                      />

                      {loginErrors.email && (
                        <p className="text-red-500 text-xs">
                          {loginErrors.email.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="login-password">Password</Label>
                      <Controller
                        name="password"
                        rules={{ required: "Password is required" }}
                        control={loginControl}
                        render={({ field }) => {
                          return (
                            <Input
                              type="password"
                              placeholder="Your Password"
                              {...field}
                            />
                          );
                        }}
                      />
                      {loginErrors.password && (
                        <p className="text-red-500 text-xs">
                          {loginErrors.password.message}
                        </p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-airline-blue hover:bg-airline-blue/90"
                      disabled={loginMutation.isPending}
                      data-testid="button-login"
                    >
                      {loginMutation.isPending ? "Signing In..." : "Sign In"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Registration Form */}
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Join LotusMiles</CardTitle>
                  <CardDescription>
                    Create your loyalty account and start earning points
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={handleRegisterSubmit(onRegister)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="first-name">First Name</Label>
                        <Controller
                          name="first_name"
                          rules={{ required: "First Name is required" }}
                          control={registerControl}
                          render={({ field }) => {
                            return (
                              <Input
                                type="text"
                                placeholder="First Name"
                                {...field}
                              />
                            );
                          }}
                        />
                        {registerErrors.first_name && (
                          <p className="text-red-500 text-xs">
                            {registerErrors.first_name.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="last-name">Last Name</Label>
                        <Controller
                          name="last_name"
                          rules={{ required: "Last Name is required" }}
                          control={registerControl}
                          render={({ field }) => {
                            return (
                              <Input
                                type="text"
                                placeholder="Last Name"
                                {...field}
                              />
                            );
                          }}
                        />
                        {registerErrors.first_name && (
                          <p className="text-red-500 text-xs">
                            {registerErrors.first_name.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Controller
                        name="email"
                        rules={{ required: "Email is required" }}
                        control={registerControl}
                        render={({ field }) => {
                          return (
                            <Input
                              type="text"
                              placeholder="Your Email"
                              {...field}
                            />
                          );
                        }}
                      />
                      {registerErrors.email && (
                        <p className="text-red-500 text-xs">
                          {registerErrors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="date-of-birth">Date of Birth</Label>
                      <Controller
                        name="dob"
                        rules={{ required: "DOB is required" }}
                        control={registerControl}
                        render={({ field }) => {
                          return (
                            <Input
                              type="date"
                              placeholder="Your Dob"
                              {...field}
                            />
                          );
                        }}
                      />
                      {registerErrors.dob && (
                        <p className="text-red-500 text-xs">
                          {registerErrors.dob.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="gender">Gender</Label>
                        <Controller
                          name="gender"
                          control={registerControl}
                          rules={{ required: "Gender is required" }}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="m">Male</SelectItem>
                                <SelectItem value="f">Female</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {registerErrors.gender && (
                          <p className="text-red-500 text-xs">
                            {registerErrors.gender.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="nationality">Nationality</Label>

                        <Controller
                          name="country"
                          control={registerControl}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger data-testid="select-nationality">
                                <SelectValue placeholder="Select nationality" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="us">
                                  United States
                                </SelectItem>
                                <SelectItem value="ca">Canada</SelectItem>
                                <SelectItem value="gb">
                                  United Kingdom
                                </SelectItem>
                                <SelectItem value="au">Australia</SelectItem>
                                <SelectItem value="de">Germany</SelectItem>
                                <SelectItem value="fr">France</SelectItem>
                                <SelectItem value="jp">Japan</SelectItem>
                                <SelectItem value="kr">South Korea</SelectItem>
                                <SelectItem value="cn">China</SelectItem>
                                <SelectItem value="in">India</SelectItem>
                                <SelectItem value="br">Brazil</SelectItem>
                                <SelectItem value="mx">Mexico</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Controller
                        name="password"
                        rules={{
                          required: "Password is required",
                          minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters",
                          },
                        }}
                        control={registerControl}
                        render={({ field }) => {
                          return <Input type="password" {...field} />;
                        }}
                      />
                      {registerErrors.password && (
                        <p className="text-red-500 text-xs">
                          {registerErrors.password.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-airline-blue hover:bg-airline-blue/90"
                      disabled={registerMutation.isPending}
                      data-testid="button-register"
                    >
                      {registerMutation.isPending
                        ? "Creating Account..."
                        : "Create Account"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right side - Hero Section */}
        <div className="text-center lg:text-left">
          <h2 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
            Soar Higher with
            <span className="text-airline-blue block">LotusMiles</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join millions of travelers earning points, unlocking exclusive
            benefits, and experiencing premium service that makes every journey
            memorable.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-airline-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Earn Points</h3>
              <p className="text-gray-600 text-sm">
                Every flight earns you valuable points toward free trips and
                upgrades
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-airline-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Exclusive Perks
              </h3>
              <p className="text-gray-600 text-sm">
                Priority boarding, lounge access, and special member-only deals
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-airline-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Premium Service
              </h3>
              <p className="text-gray-600 text-sm">
                Dedicated customer support and personalized travel experiences
              </p>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-airline-blue">2M+</div>
                <div className="text-gray-600 text-sm">Happy Members</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-airline-blue">150+</div>
                <div className="text-gray-600 text-sm">Destinations</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-airline-blue">98%</div>
                <div className="text-gray-600 text-sm">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
