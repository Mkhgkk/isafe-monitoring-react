import React from "react";

function Contents({
  field,
  value,
}: {
  field: string;
  value: string | JSX.Element;
}) {
  return (
    <div className="flex justify-between w-full">
      <p className="text-sm  mr-4">{field}</p>
      <p className="text-sm">{value}</p>
    </div>
  );
}

export default Contents;
