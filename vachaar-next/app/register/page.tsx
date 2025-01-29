"use client";

import { Input } from "@nextui-org/input";
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import toast from "react-hot-toast";
import { InputOtp } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { makeRequest } from "@/utils/request";
import { useLocalStorage } from "usehooks-ts";

export default function RegisterPage() {
  const router = useRouter();

  const [loggedIn, setLoggedIn] = useLocalStorage("logged_in", "true", {
    initializeWithValue: false,
  });

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState<string | undefined>();
  const [phoneError, setPhoneError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | undefined>();

  const togglePasswordVisibility = () =>
    setIsPasswordVisible(!isPasswordVisible);

  const handleRegister = () => {
    setIsLoading(true);
    makeRequest(
      "usr/register/",
      {
        method: "POST",
        body: { email, phone, password },
      },
      {
        onSuccess: (res) => {
          setIsCodeSent(true);
          toast("لطفا کد ارسال شده به ایمیل را وارد کنید.");
          return res;
        },
        onError: (res) => {
          res.json().then((data) => {
            setEmailError(data?.email?.[0]);
            setPhoneError(data?.phone?.[0]);
            setPasswordError(data?.password?.[0]);
          });
        },
        finally: () => setIsLoading(false),
      }
    );
  };

  const handleVerifyEmail = () => {
    makeRequest(
      "usr/verify-email/",
      {
        method: "POST",
        body: { email, code },
      },
      {
        onSuccess: () => {
          setLoggedIn("true");
          toast.success("ثبت نام شما با موفقیت انجام شد. لطفا وارد شوید.");
          router.push("/login");
        },
        onError: (res) => {
          res.json().then((data) => setCodeError(data?.message));
        },
        finally: () => setIsLoading(false),
      }
    );
  };

  const handleResendVerificationEmail = () => {
    setIsLoading(true);
    makeRequest(
      "usr/resend-verification-email/",
      {
        method: "POST",
        body: { email },
      },
      {
        onSuccess: () => {
          toast.success("کد تایید بازارسال شد.");
        },
        onError: () => {
          toast.error("خطایی رخ داده است.");
        },
        finally: () => setIsLoading(false),
      }
    );
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large px-8 pb-10 pt-6">
        {isCodeSent ? (
          <>
            <div className="flex flex-col items-center gap-2" dir={"ltr"}>
              <label htmlFor="code" className="block text-sm text-foreground">
                کد ارسال شده به ایمیل را وارد کنید
              </label>
              <InputOtp
                id="code"
                length={6}
                value={code}
                onValueChange={setCode}
                onChange={() => setCodeError(undefined)}
                variant="bordered"
                onComplete={handleVerifyEmail}
                errorMessage={codeError}
                isInvalid={codeError ? true : undefined}
                className={"text-center"}
              />
            </div>
            <div className="flex justify-center">
              <Button
                color="primary"
                type="submit"
                onClick={handleResendVerificationEmail}
                isLoading={isLoading}
                variant="bordered"
                size="sm"
              >
                بازارسال کد تایید
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="pb-4 text-3xl font-semibold">
              ثبت نام
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
                onChange={() => setEmailError(undefined)}
                errorMessage={emailError}
                isInvalid={emailError ? true : undefined}
              />
              <Input
                isRequired
                label="شماره موبایل"
                labelPlacement="outside"
                name="phone"
                placeholder="شماره موبایل خود را وارد کنید."
                type="number"
                variant="bordered"
                value={phone}
                onValueChange={setPhone}
                onChange={() => setPhoneError(undefined)}
                errorMessage={phoneError}
                isInvalid={phoneError ? true : undefined}
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
                onChange={() => setPasswordError(undefined)}
                errorMessage={passwordError}
                isInvalid={passwordError ? true : undefined}
              />
              <Button
                color="primary"
                type="submit"
                onClick={handleRegister}
                isLoading={isLoading}
              >
                ثبت نام
              </Button>
            </form>
            <p className="text-center text-small">
              <Link href="/login" size="sm">
                حساب کاربری دارید؟ وارد شوید
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
