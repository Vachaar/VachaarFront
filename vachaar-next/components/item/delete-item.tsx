"use client";

import React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { makeRequest } from "@/utils/request";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
}

const DeleteItem: React.FC<Props> = (props) => {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const handleGetContactInfo = () => {
    onOpen();
  };
  const handleDeleteItem = () => {
    makeRequest(
      `product/items/delete/${props.id}`,
      { method: "DELETE" },
      {
        onError: () => {
          toast.error("خطایی در حذف آگهی رخ داده است.");
        },
        onSuccess: () => {
          toast.success("آگهی با موفقیت حذف شد.");
          router.replace("/");
        },
      }
    );
  };
  return (
    <>
      <div>
        <Button color="danger" onPress={handleGetContactInfo}>
          حذف آگهی
        </Button>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                حذف آگهی
              </ModalHeader>
              <ModalBody>آیا از حذف آگهی مطمئنید؟</ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={handleDeleteItem}>
                  حذف
                </Button>
                <Button color="danger" variant="light" onPress={onClose}>
                  بستن
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteItem;
