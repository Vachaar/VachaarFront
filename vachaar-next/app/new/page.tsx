"use client";

import { Input, Textarea } from "@nextui-org/input";
import React, { useCallback, useState } from "react";
import { Button } from "@nextui-org/button";
import { Select, SelectItem } from "@nextui-org/react";
import { FileInput } from "@/components/ui/file-input";
import { categories } from "@/data/mock-data";
import { makeRequest } from "@/utils/request";
import toast from "react-hot-toast";

export default function AddItemPage() {
  const [categoryId, setCategoryId] = useState<number>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const handleCreateItem: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    makeRequest(
      "product/items/create",
      {
        method: "POST",
        body: {
          title,
          description,
          price,
          category_id: categoryId,
          banners: files.map((file, index) => {
            return { image_id: file.id, order: index + 1 };
          }),
        },
      },
      {
        onSuccess: () => {
          toast.success("آگهی با موفقیت ساخته شد.");
        },
        onError: () => {
          toast.error("خطا در ساخت آگهی");
        },
      }
    );
  };

  const [files, setFiles] = useState<{ id: number; file: File }[]>([]);
  const handleUploadFile: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("file", file);
      makeRequest(
        "product/images/upload",
        {
          method: "POST",
          formData,
        },
        {
          onError: () => {
            toast.error("خطا در آپلود تصویر");
          },
          onSuccess: (res) => {
            toast.success("تصویر با موفقیت آپلود شد.");
            res.json().then((data) => {
              setFiles((files) => [...files, { id: data.id, file }]);
            });
          },
        }
      );
    }, []);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large px-8 pb-10 pt-6">
        <p className="pb-4 text-3xl font-semibold">
          افزودن آگهی
          <span aria-label="emoji" className="ml-2" role="img">
            🆕
          </span>
        </p>
        <form className="flex flex-col gap-4" onSubmit={handleCreateItem}>
          <Select
            isRequired
            label="دسته بندی"
            placeholder="دسته بندی آگهی را انتخاب کنید"
            variant="bordered"
            onChange={(e) => setCategoryId(Number(e.target.value))}
            value={categoryId}
          >
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.title}
              </SelectItem>
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
            value={title}
            onValueChange={setTitle}
          />
          <Textarea
            label="توضیحات"
            labelPlacement="outside"
            name="description"
            placeholder="توضیحات آگهی را وارد کنید"
            type="text"
            variant="bordered"
            value={description}
            onValueChange={setDescription}
          />
          <Input
            isRequired
            label="قیمت (تومان)"
            labelPlacement="outside"
            name="cost"
            placeholder="قیمت را به تومان وارد کنید"
            type="number"
            variant="bordered"
            value={price}
            onValueChange={setPrice}
          />
          <FileInput
            onChange={handleUploadFile}
            files={files}
            label="افزودن تصویر"
          />
          <Button color="primary" type="submit">
            ثبت آگهی
          </Button>
        </form>
      </div>
    </div>
  );
}
