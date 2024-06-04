import React from "react";

const HeaderAdminManagementComponent = ({ content }) => {
  return (
    <div className="bg-gray-100 w-[95%] text-center h-16 p-[16px] font-bold rounded-lg">
      <span className="text-2xl text-bg-neutral-4">{content}</span>
    </div>
  );
};

export default HeaderAdminManagementComponent;
