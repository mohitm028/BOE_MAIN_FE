import { Controller } from "react-hook-form";
import { holidayOptions } from "../calendar.types";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
export const HolidayFrequency = ({ control,errors }: any) => (

    <div className="mb-6">
        <h3 className="text-base font-medium text-gray-800 mb-3">
            Run on Holiday/Day before holiday/Day after holiday
        </h3>
        <div className="flex items-center gap-2 mb-2">
            <label className="text-sm font-medium text-gray-700">Expected run days of the year:</label>
            <HelpOutlineIcon
                sx={{ fontSize: 16, color: '#9ca3af', cursor: 'help' }}
                titleAccess="Select the holidays when job would run"
            />
        </div>
        <Controller
            name="holidays"
            control={control}
            render={({ field }) => (
                <div>
                    <select
                        className="w-full px-3 py-2 text-sm border border-blue-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value && !field.value?.includes(value)) {
                                field.onChange([...(field.value || []), value]);
                            }
                        }}
                        value=""
                    >
                        <option value="">Select the holidays when job would run</option>
                        {holidayOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                 {/* Show chips */}
                            <div className="flex flex-wrap gap-2 mt-2">
                                {field.value.map((val: string) => (
                                    <span
                                        key={val}
                                        className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-md flex items-center gap-1"
                                    >
                                        {val}
                                        <button
                                            type="button"
                                            className="text-red-500 ml-1"
                                            onClick={() => {
                                                field.onChange(field.value.filter(v => v !== val));
                                            }}
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                </div>
            )}
        />
        {errors.holidays && (
            <span className="text-xs text-red-500 mt-1 block">{errors.holidays.message}</span>
        )}
    </div>
);