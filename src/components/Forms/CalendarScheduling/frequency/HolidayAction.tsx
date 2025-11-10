import { Controller, useWatch } from "react-hook-form";
import { useState } from "react";

export const HolidayAction = ({ control, errors, watchHolidayAction, watchFrequency ,subOption , setSubOption }: any) => {
    const [selectedAction, setSelectedAction] = useState("");

return (
    <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 mb-3 block">
            Please select appropriate action for holidays
        </label>
        <Controller
            name="holidayAction"
            control={control}
            render={({ field }) => (
                <div className="space-y-2">
                    <div className="items-center">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                {...field}
                                value="run-on-holiday"
                                checked={field.value === "run-on-holiday"}
                                className="text-blue-600"
                                onChange={(e) => {
                                    const value = e.target.value;
                                    field.onChange(value);
                                    setSelectedAction(value);
                                    setSubOption(""); // Reset sub-option when main option changes
                                }}
                            />
                            <span className="text-sm text-gray-700">Run the job</span>
                        </label>
                        <div>
                            {selectedAction === "run-on-holiday" && (
                                <div style={{ marginLeft: "20px" }}>
                                    <input
                                        type="radio"
                                        id="opt1a"
                                        disabled ={watchFrequency === "Daily" }
                                        name="dayBeforeHoliday"
                                        value="dayBeforeHoliday"
                                        checked={subOption === "dayBeforeHoliday"}
                                        onChange={(e) => {
                                            setSubOption(e.target.value);
                                        field.onChange("run-on-holiday:dayBeforeHoliday");
                                        }}
                                    />
                                    <label htmlFor="opt1a"> on the day before holiday</label>
                                    <br />
                                    <input
                                        type="radio"
                                        id="opt1b"
                                        disabled ={watchFrequency=== "Daily" }
                                        name="dayAfterHoliday"
                                        value="dayAfterHoliday"
                                        checked={subOption === "dayAfterHoliday"}
                                        onChange={(e) => {
                                            setSubOption(e.target.value);
                                            field.onChange("run-on-holiday:dayAfterHoliday");
                                        }}
                                    />
                                    <label htmlFor="opt1b"> on the day after holiday</label>
                                    <br />
                                    <input
                                        type="radio"
                                        id="opt1c"
                                        name="onHoliday"
                                        value="onHoliday"
                                        checked={subOption === "onHoliday"}
                                        onChange={(e) => {
                                            setSubOption(e.target.value);
                                            field.onChange("run-on-holiday:onHoliday");
                                        }}
                                    />
                                    <label htmlFor="opt1c"> on holiday</label>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="flex items-center cursor-pointer">
                            <div className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    {...field}
                                    value="do-not-run"
                                    checked={field.value === "do-not-run"}
                                    className="text-blue-600"
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        field.onChange(value);
                                        setSelectedAction(value);
                                        setSubOption(""); // Reset sub-option when main option changes
                                    }}
                                />
                                <span className="text-sm text-gray-700">Do not run the job</span>
                            </div>
                        </label>

                        {selectedAction === "do-not-run" && (
                            <Controller
                                name="holidaySubAction"
                                control={control}
                                render={({ field: subField }) => (
                                    <div className="ml-6 mt-2">
                                    <input
                                        type="radio"
                                        id="opt2a"
                                       {...subField}           
                                        value="onHoliday"
                                        checked={subField.value === "onHoliday"}
                                        onChange={(e) => {
                                            subField.onChange(e.target.value);
                                            field.onChange("do-not-run:onHoliday");
                                        }}
                                       />
                                    <label htmlFor="opt2a"> on holiday</label>
                                    <br/>
                                    <input
                                        type="radio"
                                        id="opt2b"
                                        {...subField}           
                                        value="after-holiday"
                                        checked={subField.value === 'after-holiday'}
                                        onChange={(e) => {
                                            subField.onChange(e.target.value);
                                            field.onChange("do-not-run:after-holiday");
                                        }}
                                        />
                                        <label htmlFor="opt2b">on the day after holiday</label>
                                    </div>
                                )}
                            />
                        )}
                    </div>
                </div>
            )}
        />
        {errors.holidayAction && (
            <span className="text-xs text-red-500 mt-1 block">{errors.holidayAction.message}</span>
        )}
    </div>
);
};

export default HolidayAction;
