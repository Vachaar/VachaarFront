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
}

const ReportItem: React.FC<Props> = (props) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [reasonID, setReasonID] = useState<number>();
  const handleReportItem = () => {
    //todo: api call
    onClose();
  };
  return (
    <>
      <div>
        <Button color="danger" variant="bordered" onPress={onOpen}>
          گزارش آگهی
        </Button>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                گزارش آگهی
              </ModalHeader>
              <ModalBody>
                <RadioGroup
                  label="مشکل آگهی چیست؟"
                  onChange={(e) => setReasonID(Number(e.target.value))}
                >
                  {ReportReasons.map((reason) => (
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
                <Button color="primary" onPress={handleReportItem}>
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

export default ReportItem;
