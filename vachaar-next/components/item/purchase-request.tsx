"use client";

import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { makeRequest } from "@/utils/request";
import toast from "react-hot-toast";

interface Props {
  id: string;
}

const PurchaseRequest: React.FC<Props> = (props) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [comment, setComment] = useState("");
  const handleCreatePurchaseRequest = () => {
    makeRequest(
      `/product/purchase-requests/create`,
      {
        method: "POST",
        body: {
          item_id: props.id,
          comment,
        },
      },
      {
        onError: () => {
          toast.error("خطایی در ارسال درخواست خرید رخ داده است.");
        },
        onSuccess: () => {
          toast.success("درخواست خرید با موفقیت ارسال شد.");
          onClose();
        },
      }
    );
  };
  return (
    <>
      <div>
        <Button color="primary" variant="bordered" onPress={onOpen}>
          درخواست خرید
        </Button>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                ارسال درخواست خرید
              </ModalHeader>
              <ModalBody>
                <Textarea
                  className="w-full"
                  label="توضیحات"
                  placeholder="توضیحات درخواست را بنویسید..."
                  value={comment}
                  onValueChange={setComment}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  بستن
                </Button>
                <Button color="primary" onPress={handleCreatePurchaseRequest}>
                  ارسال
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default PurchaseRequest;
