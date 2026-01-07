import React from "react";

export default function StatCard({ title, value, icon, color, footer, footerValue, footerIcon, footerColor }) {
    return (
        <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg min-h-[140px]">
            <div className="flex-auto p-4">
              <div className="flex flex-wrap">
                <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                  <h5 className="text-blueGray-400 uppercase font-bold text-xs">
                    {title}
                  </h5>
                  <span className="font-semibold text-xl text-blueGray-700">
                    {value}
                  </span>
                </div>
                <div className="relative w-auto pl-4 flex-initial">
                  <div className={"text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full " + color}>
                    <i className={icon}></i>
                  </div>
                </div>
              </div>
              <p className="text-sm text-blueGray-400 mt-4">
                <span className={footerColor + " mr-2"}>
                  <i className={footerIcon}></i> {footerValue ? footerValue + " " : ""}
                </span>
                <span className="whitespace-nowrap">{footer}</span>
              </p>
            </div>
          </div>
    );
}