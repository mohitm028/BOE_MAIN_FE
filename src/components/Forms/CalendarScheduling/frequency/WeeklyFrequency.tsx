import { Controller } from "react-hook-form";
import { weekDayOptions } from "../calendar.types";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
export const WeeklyFrequency = ({ control, errors }: any) => (
    <div className="mb-6">
        <h3 className="text-base font-medium text-gray-800 mb-3">Weekly Frequency</h3>
        <div className="flex items-center gap-2 mb-2">
            <label className="text-sm font-medium text-gray-700">Expected run days of the week:</label>
            <HelpOutlineIcon
                sx={{ fontSize: 16, color: '#9ca3af', cursor: 'help' }}
                titleAccess="Expected Run Days: Specific days of the week on which to run the job"
            />
        </div>
        <Controller
            name="runDays"
            control={control}
            render={({ field }) => {
                const selectedValues: string[] = field.value || [];

                // Define ranges explicitly
                const ranges = {
                    "Mon-Fri": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday","Sat-Sun"],
                    "Sat-Sun": ["Saturday", "Sunday"],
                    "Tue-Sat": ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                    "Mon-Sat": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                };

                // Check if any range is selected
                const selectedRange = Object.keys(ranges).find(range =>
                    selectedValues.includes(range)
                );

                return (
                    <div>
                        {/* Dropdown for selection */}
                        <select
                            className="w-full px-3 py-2 text-sm border border-blue-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value && !selectedValues.includes(value)) {
                                    field.onChange([...selectedValues, value]);
                                }
                            }}
                            value=""
                        >
                            <option value="">Select the days of run</option>
                            {weekDayOptions.map(option => {
                                let disabled = false;

                                if (selectedRange) {
                                    // If a range is selected, disable:
                                    // - any other range
                                    // - any days that fall inside the selected range
                                    if (Object.keys(ranges).includes(option.value)) {
                                    if (option.value !== selectedRange) {
                                            disabled = true; // another range
                                        } 
                                    }else {
                                        disabled =true; // day inside selected range
                                    }
                                   }else{
                                    if (Object.keys(ranges).includes(option.value)) {
                                        const rangeDays = ranges[option.value];
                                        if (selectedValues.some(day => rangeDays.includes(day))) {
                                            disabled = true; // day inside selected range
                                        }
                                    }
                                    if (option.value === "sat-sun" && selectedValues.some(day =>
                                    ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(day))){
                                        disabled = true; // if Mon-Fri is selected, disable Sat-Sun
                                    }   
                                }

                                return (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                        disabled={disabled}
                                    >
                                        {option.label}
                                    </option>
                                );
                            })}
                        </select>

                        {/* Show selected values as tags */}
                        <div className="flex flex-wrap gap-2 mt-2">
                            {selectedValues.map((val: string) => {
                                const option = weekDayOptions.find(opt => opt.value === val);
                                return (
                                    <span
                                        key={val}
                                        className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-md flex items-center gap-1"
                                    >
                                        {option?.label}
                                        <button
                                            type="button"
                                            className="text-red-500 ml-1"
                                            onClick={() =>
                                                field.onChange(selectedValues.filter((v: string) => v !== val))
                                            }
                                        >
                                            ×
                                        </button>
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                );
            }}
        />


        {errors.runDays && (
            <span className="text-xs text-red-500 mt-1 block">{errors.runDays.message}</span>
        )}
    </div>
);