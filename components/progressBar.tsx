import React from "react";

type Props = {
  value: number;
};
const ProgressBar = (props: Props) => {
  return (
    <div className="w-3/4 bg-gray-200 rounded-md h-2.5 m-auto">
      <div
        className="bg-green-500 h-2.5 rounded-md"
        style={{ width: `${props.value}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
