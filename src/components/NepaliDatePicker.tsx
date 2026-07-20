// ma-nees
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NepaliDatePickerProps {
  value: string;
  onChange: (val: string) => void;
  className?: string;
  placeholder?: string;
}

export function NepaliDatePicker({ value, onChange }: NepaliDatePickerProps) {
  // Value format: "2081-01-01"
  const [year, setYear] = useState("2081");
  const [month, setMonth] = useState("01");
  const [day, setDay] = useState("01");

  useEffect(() => {
    if (value) {
      const parts = value.split("-");
      if (parts.length === 3) {
        setYear(parts[0]);
        setMonth(parts[1]);
        setDay(parts[2]);
      }
    }
  }, [value]);

  const nepaliMonths = [
    { value: "01", label: "Baishakh (01)" },
    { value: "02", label: "Jestha (02)" },
    { value: "03", label: "Ashadh (03)" },
    { value: "04", label: "Shrawan (04)" },
    { value: "05", label: "Bhadra (05)" },
    { value: "06", label: "Ashwin (06)" },
    { value: "07", label: "Kartik (07)" },
    { value: "08", label: "Mangsir (08)" },
    { value: "09", label: "Poush (09)" },
    { value: "10", label: "Magh (10)" },
    { value: "11", label: "Falgun (11)" },
    { value: "12", label: "Chaitra (12)" },
  ];

  const years = Array.from({ length: 31 }).map((_, i) => String(2065 + i));
  const days = Array.from({ length: 32 }).map((_, i) => String(i + 1).padStart(2, "0"));

  const handleYearChange = (y: string) => {
    setYear(y);
    onChange(`${y}-${month}-${day}`);
  };

  const handleMonthChange = (m: string) => {
    setMonth(m);
    onChange(`${year}-${m}-${day}`);
  };

  const handleDayChange = (d: string) => {
    setDay(d);
    onChange(`${year}-${month}-${d}`);
  };

  return (
    <div className="grid grid-cols-3 gap-1.5 w-full">
      <Select value={year} onValueChange={handleYearChange}>
        <SelectTrigger className="h-10 text-xs px-2"><SelectValue placeholder="Year" /></SelectTrigger>
        <SelectContent>
          {years.map(y => <SelectItem key={y} value={y}>{y} BS</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={month} onValueChange={handleMonthChange}>
        <SelectTrigger className="h-10 text-xs px-2"><SelectValue placeholder="Month" /></SelectTrigger>
        <SelectContent>
          {nepaliMonths.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={day} onValueChange={handleDayChange}>
        <SelectTrigger className="h-10 text-xs px-2"><SelectValue placeholder="Day" /></SelectTrigger>
        <SelectContent>
          {days.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}

