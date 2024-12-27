"use client";

import { Input } from "@nextui-org/input";
import React from "react";
import { Icon } from "@iconify/react";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";

export enum AuthType {
  Login,
  Register,
}

interface AuthFormProps {
  type: AuthType;
}

export const AuthForm: React.FC<AuthFormProps> = (props) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    //todo
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-4 rounded-large px-8 pb-10 pt-6">
      <p className="pb-4 text-3xl font-semibold">
        {props.type === AuthType.Login ? "ورود" : "ثبت نام"}
        <span aria-label="emoji" className="ml-2" role="img">
          👋
        </span>
      </p>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {props.type === AuthType.Register && (
          <Input
            isRequired
            label="نام کاربری"
            labelPlacement="outside"
            name="username"
            placeholder="نام کاربری را وارد کنید"
            type="text"
            variant="bordered"
          />
        )}
        <Input
          isRequired
          label="ایمیل"
          labelPlacement="outside"
          name="email"
          placeholder="ایمیل را وارد کنید"
          type="email"
          variant="bordered"
        />
        <Input
          isRequired
          endContent={
            <button type="button" onClick={toggleVisibility}>
              {isVisible ? (
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
          type={isVisible ? "text" : "password"}
          variant="bordered"
        />
        <Button color="primary" type="submit">
          {props.type === AuthType.Login ? "ورود" : "ثبت نام"}
        </Button>
      </form>
      <p className="text-center text-small">
        {props.type === AuthType.Login ? (
          <Link href="/register" size="sm">
            حساب کاربری ندارید؟ ثبت نام کنید
          </Link>
        ) : (
          <Link href="/login" size="sm">
            حساب کاربری دارید؟ وارد شوید
          </Link>
        )}
      </p>
    </div>
  );
};
