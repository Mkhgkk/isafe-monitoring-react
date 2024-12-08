import React from "react";

function SettingItem({ label, children }) {
  return (
    <div className="flex justify-between py-2 px-4 items-center">
      <p className="text-sm">{label}</p>
      {children}
    </div>
  );
}

export default SettingItem;
