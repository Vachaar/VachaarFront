"use client";

import { Input, Textarea } from "@nextui-org/input";
import React from "react";
import { Button } from "@nextui-org/button";
import { Select, SelectItem } from "@nextui-org/react";
import { categories } from "@/data/mock-data";
import { FileInput } from "@/components/ui/file-input";

export default function AddItemPage() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large px-8 pb-10 pt-6">
        <p className="pb-4 text-3xl font-semibold">
          افزودن آگهی
          <span aria-label="emoji" className="ml-2" role="img">
            🆕
          </span>
        </p>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <Select
            isRequired
            label="دسته بندی"
            placeholder="دسته بندی آگهی را انتخاب کنید"
            variant="bordered"
          >
            {categories.map((category, index) => (
              <SelectItem key={index}>{category}</SelectItem>
            ))}
          </Select>
          <Input
            isRequired
            label="عنوان"
            labelPlacement="outside"
            name="title"
            placeholder="عنوان آگهی را وارد کنید"
            type="text"
            variant="bordered"
          />
          <Textarea
            label="توضیحات"
            labelPlacement="outside"
            name="description"
            placeholder="توضیحات آگهی را وارد کنید"
            type="text"
            variant="bordered"
          />
          <Input
            isRequired
            label="قیمت (تومان)"
            labelPlacement="outside"
            name="cost"
            placeholder="قیمت را به تومان وارد کنید"
            type="number"
            variant="bordered"
          />
          <FileInput label="افزودن تصویر" />
          <Button color="primary" type="submit">
            ثبت آگهی
          </Button>
        </form>
      </div>
    </div>
  );
}
