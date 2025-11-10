import React, { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useFrequency } from '../../../contexts/FrequencyContext';
import { scheduleSchema } from '../../../schemas/schedule.schema';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CloseIcon from '@mui/icons-material/Close';
import { WeeklyFrequency } from './frequency/WeeklyFrequency';
import { DailyFrequency } from './frequency/DailyFrequency';
import { AnnuallyFrequency } from './frequency/AnnuallyFrequency';
import { HolidayFrequency } from './frequency/HolidayFrequency';
import { ScheduleFormData,defaultScheduleFormData, frequencyOptions,hourOptions,minuteOptions,repeatTypeOptions  } from './calendar.types';
import { MonthFrequency } from './frequency/MonthFrequency';
import { HolidayAction } from './frequency/HolidayAction';
import { IntervalsAction } from './frequency/IntervalsAction';
interface CalendarSchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (data: any) => void;
  modelMessage?: string;
  modelIcon?: 'success' | 'error';
}

const CalendarSchedulingModal: React.FC<CalendarSchedulingModalProps> = ({ isOpen, onClose, onAdd,modelMessage,modelIcon }) => {
  const { addSchedule, schedules} = useFrequency();
  const [showSuccess, setShowSuccess] = useState(false);
  const { 
    control, 
    handleSubmit, 
    watch, 
    reset, 
    setValue, 
    formState: { errors, isValid } 
  } = useForm<ScheduleFormData>({
    resolver: yupResolver(scheduleSchema),
    defaultValues: {
      defaultValues: defaultScheduleFormData,
    },
    mode: 'onChange'
  });

  const watchFrequency = watch('frequency');
  const watchHolidayAction = watch('holidayAction');
  const watchHasIntervals = watch('hasIntervals');
  const watchSubmitTimeHour = watch('submitTimeHour');
  const watchSubmitTimeMinute = watch('submitTimeMinute');
  const [selectedValue, setSelectedValue] = useState('');
  const [subOption, setSubOption] = useState("");


  // Sync repeat start time with submit time when intervals are enabled
  useEffect(() => {
    setSelectedValue('');
    if (watchHasIntervals) {
      setValue('repeatStartHour', watchSubmitTimeHour);
      setValue('repeatStartMinute', watchSubmitTimeMinute);
    }
  }, [watchHasIntervals, watchSubmitTimeHour, watchSubmitTimeMinute, setValue]);

  // Reset conditional fields when frequency changes
  useEffect(() => {
    setValue('runDays', []);
    setValue('runMonths', []);
    setValue('runOccurrences', []);
    setValue('holidays', []);

    // Set defaults based on frequency
    if (watchFrequency === 'Monthly') {
      setValue('runMonths', ['All months']);
    }
  }, [watchFrequency, setValue]);

  if (!isOpen) return null;

  const onSubmit = (data: ScheduleFormData) => {
     const calculatesubmitTimes= (schedule) => {
      const submitTimes=[];
      let currentHour = parseInt(schedule.submitTimeHour, 10);
      let currentMinute = parseInt(schedule.submitTimeMinute, 10);

     // submitTimes.push('${currentHour}:${currentMinute}');
     submitTimes.push(currentHour.toString() + ":" + currentMinute.toString());
      if (schedule.hasIntervals && schedule.repeatType === 'clock') {
        const endHour = parseInt(schedule.repeatEndHour, 10);
        const endMinute = parseInt(schedule.repeatEndMinute, 10);
        const intervalHour = parseInt(schedule.repeatIntervalHour, 10) || 0;
        const intervalMinute = parseInt(schedule.repeatIntervalMinute, 10) || 0;

        while (currentHour < endHour || 
          (currentHour === endHour && currentMinute <= endMinute)
        ) {
          currentMinute += intervalMinute;
          currentHour +=intervalHour + Math.floor(currentMinute / 60);
          currentMinute %= 60;

          if(
            currentHour < endHour ||
            (currentHour === endHour && currentMinute <= endMinute)
          ) {
            submitTimes.push(`${currentHour}:${currentMinute}`);
          }   
        }
      }
          
      return submitTimes;
    };

    const newScheduleSubmitTimes = calculatesubmitTimes(data);
console.log('New schedule submit times:', newScheduleSubmitTimes);
    //check for conflicts with existing schedules
    const hasConflict = schedules.some((existingSchedule) => {
      const existingSubmitTimes = calculatesubmitTimes(existingSchedule);
      console.log('Existing schedule submit times:', existingSubmitTimes);
      return existingSubmitTimes.some((time) => 
        newScheduleSubmitTimes.includes(time)
    );
    });

    if (hasConflict) {
      alert(
        "This schedule conflicts with an existing schedule. Please choose a different time or interval"
      );
      return;
    }

    // Calculate the SCHID based on frequency
    const frequencyBase: Record<string, number> = {
      daily: 10,
      weekly: 20,
      monthly: 30,
      annually: 40,
    };

    const frequencyKey = data.frequency.toLowerCase();
    const baseSchid = frequencyBase[frequencyKey];

    if (baseSchid === undefined) {
      alert(`Invalid frequency: ${data.frequency}`);
      return;
    }

    const existingSchedules = schedules.filter(
      (s) => s.frequency.toLowerCase() === frequencyKey 
    );
    console.log("existing length "+ existingSchedules.length)
    if (existingSchedules.length >= 9) {
      alert('Maximum 10 schedules allowed for ' + frequencyKey);
      return; // stop here
    }
    const newSchid = baseSchid + existingSchedules.length;    
      
    const schedule = {
      id: Date.now().toString(),
      schidId: newSchid.toString(), //Assign the calculated SCHID
      frequency: data.frequency,
      submitTimeHour: data.submitTimeHour,
      submitTimeMinute: data.submitTimeMinute,
      holidayAction: 
      data.holidayAction === "do-not-run"
        ? `${data.holidayAction}-${data.holidaySubAction}` 
        : data.holidayAction,
      hasIntervals: data.hasIntervals,
      runDays: data.runDays,
      runMonths: data.runMonths,
      runOccurrences: data.runOccurrences,
      holidays: data.holidays,
      repeatStartHour: data.hasIntervals ? data.repeatStartHour : undefined,
      repeatStartMinute: data.hasIntervals ? data.repeatStartMinute : undefined,
      repeatEndHour: data.hasIntervals ? data.repeatEndHour : undefined,
      repeatEndMinute: data.hasIntervals ? data.repeatEndMinute : undefined,
      repeatType: data.hasIntervals ? data.repeatType : undefined,
      repeatIntervalHour: data.hasIntervals ? data.repeatIntervalHour : undefined,
      repeatIntervalMinute: data.hasIntervals
       ? data.repeatIntervalMinute
        : undefined,
    };
    
    addSchedule(schedule);
    onAdd?.(schedule);
    setShowSuccess(true);
  };

  const handleAddMore = () => {
    reset();
    setShowSuccess(false);
  };

  const handleCloseModal = () => {
    reset();
    setShowSuccess(false);
    onClose();
  };

  const isHolidayFrequency = watchFrequency && watchFrequency.includes('holiday');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl" style={{ width: '800px', maxWidth: '90vw', maxHeight: '90vh' }}>
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Add schedule</h2>
          <button
            onClick={handleCloseModal}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          {!showSuccess ? (
            <form onSubmit={handleSubmit(onSubmit)} className="p-6">
              {/* Job Run Schedule */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-medium text-gray-700">Job Run Schedule</label>
                  <HelpOutlineIcon 
                    sx={{ fontSize: 16, color: '#9ca3af', cursor: 'help' }}
                    titleAccess="Frequency: Daily: Job runs daily from Monday thru Sunday. Weekly: Job runs weekly on the selected weekdays. Monthly: Job runs Monthly in the selected months, on the selected number of weekdays."
                  />
                </div>
                <div className="mb-1">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                      Select Frequency <span className="text-red-500">*</span>
                    </label>
                </div>
                <Controller
                  name="frequency"
                  control={control}
                  defaultValue={frequencyOptions[0]} 
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.frequency ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      {frequencyOptions.map(option => (
                        <option
                         key={option} 
                         value={option}
                         hidden= {option === '--Select an Option--'}

                         >{option}
                         </option>
                      ))}
                    </select>
                  )}
                />
                {errors.frequency && (
                  <span className="text-xs text-red-500 mt-1 block">{errors.frequency.message}</span>
                )}
              </div>

              {/* Expected run days - Daily */}
              {watchFrequency === 'Daily' && <DailyFrequency control={control} errors={errors} />}
              {/* Expected run days - Weekly */}
              {watchFrequency === 'Weekly' && <WeeklyFrequency control={control} errors={errors} />}

              {/* Monthly Frequency */}
              {watchFrequency === 'Monthly' && <MonthFrequency control={control} />}

              {/* Annual Frequency */}
              {watchFrequency === 'Annually' && <AnnuallyFrequency control={control} />}

              {/* Holiday Frequency */}
              {isHolidayFrequency && <HolidayFrequency control={control} errors={errors} />}
              {/* Schedule Submit Time (LPAR) */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-medium text-gray-700">Schedule Submit time (LPAR)</label>
                  <HelpOutlineIcon 
                    sx={{ fontSize: 16, color: '#9ca3af', cursor: 'help' }}
                    titleAccess="Submit Time: The job is not submitted to CA7 before this time. If the submit time is before deadline start time, the submit time requirement is automatically satisfied when the job enters the queue."
                  />
                </div>
                <div className="flex gap-3 max-w-xs">
                  <div className="flex-1">
                    <span className="text-xs text-gray-500 block mb-1">HH</span>
                    <Controller
                      name="submitTimeHour"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.submitTimeHour ? 'border-red-300' : 'border-gray-300'
                          }`}
                        >
                          {hourOptions.map(hour => (
                            <option key={hour} value={hour}>{hour}</option>
                          ))}
                        </select>
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs text-gray-500 block mb-1">MM</span>
                    <Controller
                      name="submitTimeMinute"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.submitTimeMinute ? 'border-red-300' : 'border-gray-300'
                          }`}
                        >
                          {minuteOptions.map(minute => (
                            <option key={minute} value={minute}>{minute}</option>
                          ))}
                        </select>
                      )}
                    />
                  </div>
                </div>
                {(errors.submitTimeHour || errors.submitTimeMinute) && (
                  <span className="text-xs text-red-500 mt-1 block">Submit time is required</span>
                )}
              </div>

              {/* Holiday Actions - Only show for non-holiday frequencies */}
              {watchFrequency && !isHolidayFrequency && watchFrequency !== '' && <HolidayAction control={control} errors={errors} watchFrequency={watchFrequency} watchHolidayAction={watchHolidayAction} subOption={subOption} setSubOption={setSubOption} />}

              {/* Fixed Intervals */}
              <div className="mb-6">
                <Controller
                  name="hasIntervals"
                  control={control}
                  render={({ field }) => (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        {...field}
                        checked={field.value}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">
                        Job scheduled to run at fixed intervals in a run window?
                      </span>
                    </label>
                  )}
                />

                {watchHasIntervals && <IntervalsAction control={control} errors={errors} />}
              </div>
            </form>
          ) : ( isOpen && (
            /* Success State */
            <div className="px-6 py-12">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-6">  {modelMessage}</h3>
                <div className="flex justify-center mb-8">
                  {modelIcon === "success" && (
                    <CheckCircleIcon sx={{ fontSize: 80, color: "#22c55e" }} />
                  )}
                  {modelIcon === "error" && (
                    <CancelIcon sx={{ fontSize: 80, color: "#ef4444" }} /> // MUI Cancel Icon
                  )}
                </div>
                
                <div className="flex justify-center gap-3">
                  <button
                    onClick={handleAddMore}
                    className="px-6 py-2 bg-white text-gray-700 border-2 border-gray-300 rounded hover:bg-gray-50 transition-colors font-medium"
                  >
                    Add More
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="px-6 py-2 bg-white text-pink-500 border-2 border-pink-500 rounded hover:bg-pink-50 transition-colors font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer - Fixed at bottom */}
        {!showSuccess && (
          <div className="flex justify-center gap-3 px-6 py-4 border-t border-gray-200 bg-white">
            <button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              disabled={!isValid}
              className={`px-6 py-2 bg-white text-blue-500 border-2 border-blue-500 rounded hover:bg-blue-50 transition-colors font-medium ${
                !isValid ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Add
            </button>
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-6 py-2 bg-white text-pink-500 border-2 border-pink-500 rounded hover:bg-pink-50 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarSchedulingModal;