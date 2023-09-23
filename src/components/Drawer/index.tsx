import React from "react";

type Props = {
  children: React.ReactNode;
  label?: string;
  id?: string;
};

function Drawer({ label, children, id = "my-drawer" }: Props) {
  return (
    <div className="drawer drawer-end z-50">
      <input id={id} type="checkbox" className="drawer-toggle" />
      {label && (
        <div className="drawer-content">
          <label
            htmlFor={id}
            className="btn btn-primary drawer-button rounded-full"
          >
            {label}
          </label>
        </div>
      )}
      <div className="drawer-side">
        <label htmlFor={id} className="drawer-overlay"></label>
        <div className="drawer-style p-5 w-2/3 h-[85%] overflow-y-auto mt-auto">
          {/* Sidebar content here */}
          {children}
        </div>
      </div>
    </div>
  );
}

export { Drawer };
