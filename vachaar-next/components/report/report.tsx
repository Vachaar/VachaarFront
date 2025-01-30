"use client";

import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  useDisclosure,
} from "@nextui-org/react";
import { makeRequest } from "@/utils/request";
import toast from "react-hot-toast";
import { ReportReasons } from "@/data/config";

interface Props {
  id: string;
  isUser?: boolean;
}

const Report: React.FC<Props> = (props) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [reasonID, setReasonID] = useState<number>();
  const handleReport = () => {
    const entity = props.isUser ? "user" : "item";
    makeRequest(
      `/report/${props.isUser ? "user" : "item"}`,
      {
        method: "POST",
        body: {
          [entity]: props.id,
          reason_id: reasonID,
        },
      },
      {
        onError: () => toast.error("خطایی در ارسال گزارش رخ داده است."),
        onSuccess: () => toast.success("گزارش با موفقیت ارسال شد."),
      }
    );
    onClose();
  };
  const title = `گزارش ${props.isUser ? "کاربر" : "آگهی"}`;
  return (
    <>
      <div>
        <Button color="danger" variant="bordered" onPress={onOpen}>
          {title}
        </Button>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
              <ModalBody>
                <RadioGroup
                  label="دلیل گزارش را انتخاب کنید."
                  onChange={(e) => setReasonID(Number(e.target.value))}
                >
                  {ReportReasons.filter(
                    (reason) => !props.isUser || reason.isItemSpecific
                  ).map((reason) => (
                    <Radio value={reason.id.toString()} key={reason.id}>
                      {reason.title}
                    </Radio>
                  ))}
                </RadioGroup>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  بستن
                </Button>
                <Button color="primary" onPress={handleReport}>
                  اعمال
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default Report;
