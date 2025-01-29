"use client";

import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { makeRequest } from "@/utils/request";
import { digitsToPersian } from "@/utils/string";
import toast from "react-hot-toast";
import { Icon } from "@iconify/react";
import { useLocalStorage } from "usehooks-ts";

interface Props {
  id: string;
}

const ContactInfo: React.FC<Props> = (props) => {
  const [loggedIn, setLoggedIn] = useLocalStorage("logged_in", "false", {
    initializeWithValue: false,
  });
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [phone, setPhone] = useState<number>();
  const handleGetContactInfo = () => {
    onOpen();
    makeRequest(
      `product/items/contact-info/${props.id}`,
      { method: "GET" },
      {
        onError: (res) => {
          if (res.status !== 401) {
            toast.error("خطایی در دریافت اطلاعات تماس رخ داده است.");
          }
          onClose();
        },
        onSuccess: (res) => {
          res.json().then((data) => {
            setPhone(data.phone);
          });
        },
      },
      setLoggedIn
    );
  };
  return (
    <>
      <div>
        <Button color="primary" onPress={handleGetContactInfo}>
          اطلاعات تماس
        </Button>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                اطلاعات تماس
              </ModalHeader>
              <ModalBody>
                {phone ? (
                  <div className="flex justify-between items-center">
                    <p>شماره تماس</p>
                    <div className="flex items-center gap-2 cursor">
                      <a href={`tel:${phone}`}>
                        {digitsToPersian(phone.toString())}
                      </a>
                      <Button
                        isIconOnly
                        aria-label="Copy"
                        color="primary"
                        onPress={() => {
                          navigator.clipboard.writeText(phone.toString());
                          toast.success("شماره تماس کپی شد.");
                        }}
                      >
                        <Icon
                          className="pointer-events-none text-2xl"
                          icon="solar:copy-outline"
                        />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Spinner />
                )}
              </ModalBody>
              <ModalFooter>
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

export default ContactInfo;
