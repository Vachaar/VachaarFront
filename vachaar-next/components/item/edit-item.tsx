"use client";

import React from "react";
import { Button } from "@nextui-org/react";
import Link from "next/link";

interface Props {
  id: string;
}

const EditItem: React.FC<Props> = (props) => {
  return (
    <Link href={`/edit/${props.id}`}>
      <Button color="primary">ویرایش آگهی</Button>
    </Link>
  );
};

export default EditItem;
