export interface ScheduleFormData {
    frequency: string;
  submitTimeHour: string;
  submitTimeMinute: string;
  holidayAction: string;
  holidaySubAction?: string;
  hasIntervals: boolean;
  runDays?: string[];
  runMonths?: string[];
  runOccurrences?: string[];
  holidays?: string[];
  repeatStartHour?: string;
  repeatStartMinute?: string;
  repeatEndHour?: string;
  repeatEndMinute?: string;
  repeatType?: string;
  repeatIntervalHour?: string;
  repeatIntervalMinute?: string;
}

export const defaultScheduleFormData: ScheduleFormData = {
  frequency: 'Select an Option',
      submitTimeHour: '00',
      submitTimeMinute: '00',
      holidayAction: 'run-on-holiday',
      hasIntervals: false,
      runDays: [],
      runMonths: [],
      runOccurrences: [],
      holidays: [],
      repeatStartHour: '04',
      repeatStartMinute: '07',
      repeatEndHour: '08',
      repeatEndMinute: '13',
      repeatType: '',
      repeatIntervalHour: '00',
      repeatIntervalMinute: '15',
};

  // Frequency options
export const frequencyOptions = [
    'Select an Option', 'Daily', 'Weekly', 'Monthly', 'Annually',
    'Run Only on holiday', 'Run Only on day before holiday', 'Run Only on day after holiday'
  ];

 

  // Day options for weekly
export const weekDayOptions = [
    { value: 'Mon-Fri', label: 'Mon - Fri',type: "range" },
    { value: 'Tue-Sat', label: 'Tue - Sat',type: "range"  },
    { value: 'Mon-Sat', label: 'Mon - Sat', type: "range"  },
    { value: 'Sat-Sun', label: 'Sat & Sun', type: "range"  },
    { value: 'Sunday', label: 'Sunday',type: "day"  },
    { value: 'Monday', label: 'Monday',type: "day"  },
    { value: 'Tuesday', label: 'Tuesday',type: "day"  },
    { value: 'Wednesday', label: 'Wednesday',type: "day"  },
    { value: 'Thursday', label: 'Thursday',type: "day"  },
    { value: 'Friday', label: 'Friday',type: "day"  },
    { value: 'Saturday', label: 'Saturday',type: "day"  }
  ];

  // Month options
 export const monthOptions = [
    'All months', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Occurrence options for monthly
export  const occurrenceOptions = ['First', 'Last', '2nd', '3rd', '4th', '5th', '6th', '7th'];

  // Holiday options
export  const holidayOptions = [
    'Federal Reserve Holidays',
    'IMSL Non Branch Working day (NBW)',
    'IMSE Non Branch Working day (NBW)',
    'IMSF Non Branch Working day (NBW)'
  ];

  // Repeat type options
export  const repeatTypeOptions = [
    { value: 'C', label: 'Clock' },
    { value: 'S', label: 'Start' },
    { value: 'E', label: 'End' }
  ];

  // Generate hour and minute options
export  const hourOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
export  const minuteOptions = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  // Annual day options (1-366)
export  const annualDayOptions = Array.from({ length: 366 }, (_, i) => (i + 1).toString());
export const businessDayOptions = ['Business Day', '1st Business Day', '2nd Business Day', '3rd Business Day', '4th Business Day', '5th Business Day'];
