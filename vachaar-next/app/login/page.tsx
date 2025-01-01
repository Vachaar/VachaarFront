"use client";

import { Input } from "@nextui-org/input";
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { makeRequest } from "@/utils/request";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () =>
    setIsPasswordVisible(!isPasswordVisible);

  const handleLogin = () => {
    setIsLoading(true);
    makeRequest(
      "usr/login/",
      {
        method: "POST",
        body: { email, password },
      },
      {
        onSuccess: () => {
          toast.success("با موفقیت وارد شدید.");
          router.push("/");
        },
        onError: () => {
          toast.error("ایمیل یا رمز عبور اشتباه است.");
        },
        finally: () => {
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large px-8 pb-10 pt-6">
        <p className="pb-4 text-3xl font-semibold">
          ورود
          <span aria-label="emoji" className="ml-2" role="img">
            👋
          </span>
        </p>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <Input
            isRequired
            label="ایمیل"
            labelPlacement="outside"
            name="email"
            placeholder="ایمیل را وارد کنید"
            type="email"
            variant="bordered"
            value={email}
            onValueChange={setEmail}
          />
          <Input
            isRequired
            endContent={
              <button type="button" onClick={togglePasswordVisibility}>
                {isPasswordVisible ? (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-closed-linear"
                  />
                ) : (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-bold"
                  />
                )}
              </button>
            }
            label="رمز عبور"
            labelPlacement="outside"
            name="password"
            placeholder="رمز عبور را وارد کنید"
            type={isPasswordVisible ? "text" : "password"}
            variant="bordered"
            value={password}
            onValueChange={setPassword}
          />
          <Button
            color="primary"
            type="submit"
            onClick={handleLogin}
            isLoading={isLoading}
          >
            ورود
          </Button>
        </form>
        <p className="text-center text-small">
          <Link href="/register" size="sm">
            حساب کاربری ندارید؟ ثبت نام کنید
          </Link>
        </p>
      </div>
    </div>
  );
}
