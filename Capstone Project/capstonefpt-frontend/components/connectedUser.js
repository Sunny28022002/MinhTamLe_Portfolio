import React from "react";
import { Avatar } from "@douyinfe/semi-ui";

const ConnectedUser = ({ users }) => {
  return (
    <div className="float-left bg-white rounded-lg text-bg-neutral-4 w-52 h-full mr-4 text-center border-solid border-[1px]">
      <div>
        <p className="text-xl font-semibold m-3">Connected Users</p>
      </div>
      {users.map((user, idx) => (
        <div key={idx} className="flex flex-row justify-center mt-3 p-1">
          <Avatar style={{ margin: 4 }} alt={user}>
            {user[0].toUpperCase()}
          </Avatar>
          <p key={idx} className="text-base ml-2 text-black mt-3">
            {user}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ConnectedUser;
