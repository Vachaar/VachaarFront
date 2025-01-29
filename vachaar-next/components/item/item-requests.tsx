"use client";

import React, { useMemo, useState } from "react";
import {
  Alert,
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Chip,
  getKeyValue,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import { ItemRequest } from "@/types/item";
import { makeRequest } from "@/utils/request";
import toast from "react-hot-toast";
import { digitsToPersian } from "@/utils/string";
import { usePathname, useRouter } from "next/navigation";
import Report from "../report/report";

interface Props {
  requests: ItemRequest[];
  itemID: string;
  itemTitle: string;
  isSold: boolean;
}
const columns = [
  {
    key: "id",
    label: "ردیف",
  },
  {
    key: "state",
    label: "وضعیت",
  },
  {
    key: "buyer_user_phone",
    label: "شماره همراه",
  },
  {
    key: "comment",
    label: "توضیحات",
  },
  {
    key: "actions",
    label: "اقدامات",
  },
];
const requestState = {
  sold: {
    label: "فروخته شده",
    color: "success",
  },
  accepted: {
    label: "تایید شده",
    color: "primary",
  },
  pending: {
    label: "در انتظار تایید",
    color: "secondary",
  },
  canceled: {
    label: "تایید نشده",
    color: "warning",
  },
};
export default function ItemRequests(props: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [description, setDescription] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const handleAcceptRequest = (id: number) => {
    makeRequest(
      `/product/purchase-requests/accept/${id}`,
      {
        method: "POST",
      },
      {
        onSuccess: () => {
          toast.success("درخواست با موفقیت تایید شد.");
          router.refresh();
        },
        onError: () => {
          toast.error("خطایی در تایید درخواست به وجود آمده است.");
        },
      }
    );
  };
  const handleFinalizeSale = (id: string) => {
    makeRequest(
      `/product/items/${id}/sold`,
      {
        method: "POST",
      },
      {
        onSuccess: () => {
          toast.success("فرایند فروش با موفقیت تکمیل شد.");
          router.replace(pathname + "?sold=true");
        },
        onError: () => {
          toast.error("خطایی در تکمیل فرایند فروش به وجود آمده است.");
        },
      }
    );
  };
  const handleReactivateItem = (id: string) => {
    makeRequest(
      `/product/items/${id}/reactivate`,
      {
        method: "POST",
      },
      {
        onSuccess: () => {
          toast.success("درخواست با موفقیت لغو شد و آیتم دوباره فعال شد.");
          router.refresh();
        },
        onError: () => {
          toast.error("خطایی در لغو درخواست رخ داده است.");
        },
      }
    );
  };
  const acceptedRequest = useMemo(() => {
    return props.requests.find((request) => request.state == "accepted");
  }, [props.requests]);
  return (
    <>
      <Breadcrumbs size={"lg"} className="mb-1">
        <BreadcrumbItem href="/profile">پروفایل</BreadcrumbItem>
        <BreadcrumbItem>
          <span className="text-tiny">درخواست های خرید برای آگهی</span>
          &quot;{props.itemTitle}&quot;
        </BreadcrumbItem>
      </Breadcrumbs>
      {acceptedRequest && (
        <div className="my-3">
          <Alert color={props.isSold ? "success" : "primary"}>
            <div className="flex items-center justify-between w-full">
              <p>
                این کالا توسط کاربری با شمارۀ &nbsp;
                {digitsToPersian(acceptedRequest?.buyer_user_phone ?? "")}&nbsp;
                {props.isSold ? "خریداری" : "رزرو"} شده است.
              </p>
              {!props.isSold && (
                <Button
                  color="danger"
                  onPress={() => handleReactivateItem(props.itemID)}
                >
                  لغو رزرو
                </Button>
              )}
            </div>
          </Alert>
        </div>
      )}
      <Table aria-label="Example table with dynamic content" className="mt-1">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={props.requests}>
          {(request) => (
            <TableRow key={request.id}>
              {(columnKey) => {
                if (columnKey == "comment") {
                  return (
                    <TableCell>
                      {request.comment ? (
                        <Button
                          onPress={() => {
                            setDescription(request.comment);
                            onOpen();
                          }}
                        >
                          نمایش توضیحات
                        </Button>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  );
                }
                if (columnKey == "state") {
                  let state =
                    requestState[request.state as keyof typeof requestState];
                  if (props.isSold) {
                    if (request.state == "accepted") state = requestState.sold;
                    else state = requestState.canceled;
                  }
                  return (
                    <TableCell>
                      <Chip color={state.color as any}>{state.label}</Chip>
                    </TableCell>
                  );
                }
                if (columnKey == "actions") {
                  if (props.isSold) return <TableCell>-</TableCell>;
                  return (
                    <TableCell>
                      <div className="flex gap-4 justify-center">
                        {request.state == "accepted" ? (
                          <Button
                            onPress={() => handleFinalizeSale(props.itemID)}
                            color="primary"
                          >
                            تکمیل فرایند فروش
                          </Button>
                        ) : (
                          <Button
                            onPress={() => handleAcceptRequest(request.id)}
                            color="primary"
                          >
                            تایید درخواست
                          </Button>
                        )}
                        <Report id={props.itemID} isUser={true} />
                      </div>
                    </TableCell>
                  );
                }
                return <TableCell>{getKeyValue(request, columnKey)}</TableCell>;
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                توضیحات درخواست
              </ModalHeader>
              <ModalBody>{description}</ModalBody>
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
}
