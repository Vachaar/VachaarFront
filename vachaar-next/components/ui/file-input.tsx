"use client";

import { Icon } from "@iconify/react";
import { Image } from "@nextui-org/react";
import React, { useRef } from "react";

interface Props {
  label: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  files: { id: number; file: File }[];
}

const FileInputFC: React.FC<Props> = (props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <label htmlFor="file-input" className="block text-sm text-foreground">
        {props.label}
      </label>
      <div className="mt-2 flex flex-wrap gap-4 items-center">
        <input
          type="file"
          ref={inputRef}
          className="hidden"
          accept="image/*"
          onChange={props.onChange}
        />
        <button
          className="flex items-center justify-center w-20 h-20 rounded-lg border-2 border-default-400 cursor-pointer"
          onClick={() => inputRef.current?.click()}
          type="button"
        >
          <Icon
            className="pointer-events-none text-2xl text-default-400"
            icon="solar:add-circle-outline"
          />
        </button>
        {props.files.map((file) => (
          <Image
            key={file.id}
            src={URL.createObjectURL(file.file)}
            alt="image"
            width={80}
            height={80}
            className="rounded-lg border-2 border-default-400"
          />
        ))}
      </div>
    </div>
  );
};

export const FileInput = React.memo(FileInputFC);
