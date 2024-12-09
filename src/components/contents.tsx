import React from "react";

function Contents({
  field,
  value,
}: {
  field: string;
  value: string | JSX.Element;
}) {
  return (
    <div className="flex justify-between">
      <p className="text-sm dark:text-muted-foreground mr-4">{field}</p>
      <p className="text-sm">{value}</p>
    </div>
  );
}

export default Contents;
