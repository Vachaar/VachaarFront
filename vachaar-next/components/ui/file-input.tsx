import { Icon } from "@iconify/react";
import { Image } from "@nextui-org/react";
import { useRef, useState } from "react";

interface Props {
  label: string;
}

export const FileInput: React.FC<Props> = (props) => {
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleChange = () => {
    const file = inputRef.current?.files?.[0];
    if (file) {
      setFiles([file]);
    }
  };
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
          onChange={handleChange}
        />
        <div
          className="flex items-center justify-center w-20 h-20 rounded-lg border-2 border-default-400 cursor-pointer"
          onClick={() => inputRef.current?.click()}
        >
          <Icon
            className="pointer-events-none text-2xl text-default-400"
            icon="solar:add-circle-outline"
          />
        </div>
        {files.map((file, index) => (
          <Image
            key={index}
            src={URL.createObjectURL(file)}
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
