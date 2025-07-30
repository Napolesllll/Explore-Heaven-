'use client';

import * as React from "react";
import { DayPicker, DayPickerSingleProps } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { cn } from "../../../../lib/utils";

export const Calendar = ({
  className,
  classNames,
  ...props
}: DayPickerSingleProps) => {
  return (
    <DayPicker
      className={cn("rounded-md border bg-white p-3 shadow", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-gray-500 rounded-md w-9 font-normal text-xs",
        row: "flex w-full mt-2",
        cell: "text-center text-sm p-1 relative [&:has([aria-selected])]:bg-blue-100",
        day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
        day_selected:
          "bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700",
        day_today: "border border-blue-500",
        ...classNames,
      }}
      {...props}
    />
  );
};
