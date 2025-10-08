"use client";

import Image from "next/image";
import React, { useState } from "react";

const ModalDescription = ({ description }: { description: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        className={`w-7 h-7 flex items-center justify-center rounded-full bg-pickYellow`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/viewYellow.png`} alt="" width={20} height={20} />
      </button>
      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md relative bottom-52 w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <h1>{description}</h1>
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="close" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalDescription;
