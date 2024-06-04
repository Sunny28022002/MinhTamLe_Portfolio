import { Avatar } from "@douyinfe/semi-ui";
import React from "react";

const AIMessage = ({ data }) => {
  console.log("data: ", data);
  return (
    <div className="flex flex-col gap-4 text-left pr-5 text-lg mt-4 ml-2">
      {data?.map((item, idx) => (
        <>
          {item.user == "user" ? (
            <>
              <div className="flex">
                <div>
                  <Avatar
                    shape="square"
                    style={{ margin: 4 }}
                    alt="User"
                    src="https://static.vecteezy.com/system/resources/previews/000/420/680/original/vector-doctor-icon.jpg"
                  ></Avatar>
                </div>
                <div className="flex flex-col">
                  <div className="text-sm mb-2 ml-1 font-semibold">User</div>
                  <div className="inline-flex mr-auto py-1 px-2 text-base text-black rounded-full">
                    <p className="text-base text-justify -mt-1">
                      {item.message}
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {" "}
              <div className="flex bg-gray-100 p-4 rounded">
                <div>
                  <Avatar
                    shape="square"
                    style={{ margin: 4 }}
                    alt="User"
                    src="https://cdn.dribbble.com/users/722835/screenshots/4082720/bot_icon.gif"
                  ></Avatar>
                </div>
                <div className="flex flex-col">
                  <div className="text-sm mb-2 ml-1 font-semibold">Chat AI</div>
                  <div className="inline-flex mr-auto py-1 px-2 text-base text-black rounded-full">
                    <p className="text-base text-justify -mt-1">
                      {item.message}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      ))}
    </div>
  );
};

export default AIMessage;
