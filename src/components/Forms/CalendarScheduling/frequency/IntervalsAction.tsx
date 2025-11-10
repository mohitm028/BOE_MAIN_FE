import { Controller } from "react-hook-form";
import {
     hourOptions, 
     minuteOptions, 
     repeatTypeOptions,
    } from "../calendar.types";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
export const IntervalsAction = ({ control, errors }: any) => (
 <div className="mt-4 border border-gray-200 rounded-md p-4 bg-gray-50">
        <span className="text-xs text-gray-600 block mb-3">
            Enables below form if selected
            </span>

        <div className="grid grid-cols-2 gap-4">
            {/* Repeat Start Time */}
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-medium text-gray-700">
                        Repeat Start Time
                        </label>
                    <HelpOutlineIcon
                        sx={{ fontSize: 16, color: "#9ca3af", cursor: "help" }}
                        titleAccess="End Time: Same as Job Submit Time"
                    />
                </div>
                <div className="flex gap-2">
                    <div className="flex-1">
                        <span className="text-xs text-gray-500 block mb-1">HH</span>
                        <Controller
                            name="repeatStartHour"
                            control={control}
                            render={({ field }) => (
                                <select
                                    {...field}
                                    disabled
                                    className="w-full px-3 py-2 text-sm border rounded-md bg-gray-100 border-gray-300 text-gray-600"
                                >
                                    {hourOptions.map(hour => (
                                        <option key={hour} value={hour}>
                                            {hour}
                                            </option>
                                    ))}
                                </select>
                            )}
                        />
                    </div>
                    <div className="flex-1">
                        <span className="text-xs text-gray-500 block mb-1">MM</span>
                        <Controller
                            name="repeatStartMinute"
                            control={control}
                            render={({ field }) => (
                                <select
                                    {...field}
                                    disabled
                                    className="w-full px-3 py-2 text-sm border rounded-md bg-gray-100 border-gray-300 text-gray-600"
                                >
                                    {minuteOptions.map((minute) => (
                                        <option key={minute} value={minute}>
                                            {minute}
                                            </option>
                                    ))}
                                </select>
                            )}
                        />
                    </div>
                </div>
            </div>

            {/* Repeat End Time */}
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-medium text-gray-700">
                        Repeat End Time
                        </label>
                    <HelpOutlineIcon
                        sx={{ fontSize: 16, color: "#9ca3af", cursor: "help" }}
                        titleAccess="End Time: For repeat scheduling, the time after which the job should not be repeated"
                    />
                </div>
                <div className="flex gap-2">
                    <div className="flex-1">
                        <span className="text-xs text-gray-500 block mb-1">HH</span>
                        <Controller
                            name="repeatEndHour"
                            control={control}
                            render={({ field }) => (
                                <select
                                    {...field}
                                    className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.repeatEndHour 
                                        ? "border-red-300"
                                         : "border-gray-300"
                                    }`}
                                >
                                    {hourOptions.map((hour) => (
                                        <option key={hour} value={hour}>
                                            {hour}
                                        </option>
                                    ))} 
                                    </select>
                            )}
                        />
                    </div>
                    <div className="flex-1">
                        <span className="text-xs text-gray-500 block mb-1">MM</span>
                        <Controller
                            name="repeatEndMinute"
                            control={control}
                            render={({ field }) => (
                                <select
                                    {...field}
                                    className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.repeatEndMinute 
                                        ? "border-red-300"
                                         : "border-gray-300"
                                    }`}
                                >
                                    {minuteOptions.map((minute) => (
                                        <option key={minute} value={minute}>    
                                            {minute}
                                        </option>
                                    ))}
                                </select>
                            )}
                        />
                    </div>
                </div>
                {(errors.repeatEndHour || errors.repeatEndMinute) && (
                    <span className="text-xs text-red-500 mt-1 block">
                        {errors.repeatEndHour?.message || errors.repeatEndMinute?.message}
                    </span>
                )}
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
            {/* Repeat Type */}
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-medium text-gray-700">
                        Repeat Type
                        </label>
                    <HelpOutlineIcon
                        sx={{ fontSize: 16, color: "#9ca3af", cursor: "help" }}
                        titleAccess="Repeat Type: For repeat scheduling, how the next iteration should be calculated. Values are C = Clock; S = Start; E = End"
                    />
                </div>
                <Controller
                    name="repeatType"
                    control={control}
                    render={({ field }) => (
                        <select
                            {...field}
                            className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.repeatType ? "border-red-300" : "border-gray-300"
                                }`}
                        >
                            <option value="">Select Repeat Type</option>
                            {repeatTypeOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.value} = {option.label}
                                </option>
                            ))}
                        </select>
                    )}
                />
                {errors.repeatType && (
                    <span className="text-xs text-red-500 mt-1 block">
                        {errors.repeatType.message}
                        </span>
                )}
            </div>

            {/* Repeat Interval */}
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-medium text-gray-700">
                        Repeat Interval
                        </label>
                    <HelpOutlineIcon
                        sx={{ fontSize: 16, color: "#9ca3af", cursor: "help" }}
                        titleAccess="Value should be equal or greater than 00:15 And less than the difference of start time and end time"
                    />
                </div>
                <div className="flex gap-2">
                    <div className="flex-1">
                        <span className="text-xs text-gray-500 block mb-1">HH</span>
                        <Controller
                            name="repeatIntervalHour"
                            control={control}
                            render={({ field }) => (
                                <select
                                    {...field}
                                    className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.repeatIntervalHour 
                                        ? "border-red-300" 
                                        : "border-gray-300"
                                        }`}
                                >
                                    {hourOptions.map((hour) => (
                                        <option key={hour} value={hour}>
                                            {hour}
                                            </option>
                                    ))}
                                </select>
                            )}
                        />
                    </div>
                    <div className="flex-1">
                        <span className="text-xs text-gray-500 block mb-1">MM</span>
                        <Controller
                            name="repeatIntervalMinute"
                            control={control}
                            render={({ field }) => (
                                <select
                                    {...field}
                                    className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.repeatIntervalMinute 
                                        ? "border-red-300"
                                         : "border-gray-300"
                                        }`}
                                >
                                    {minuteOptions.map((minute) => (
                                        <option key={minute} value={minute}>
                                            {minute}
                                            </option>
                                    ))}
                                </select>
                            )}
                        />
                    </div>
                </div>
                {(errors.repeatIntervalHour || errors.repeatIntervalMinute) && (
                    <span className="text-xs text-red-500 mt-1 block">
                        {errors.repeatIntervalHour?.message ||
                         errors.repeatIntervalMinute?.message}
                    </span>
                )}
            </div>
        </div>
    </div>
);