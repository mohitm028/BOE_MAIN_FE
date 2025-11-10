import { useState } from "react";
import { Schedule, useFrequency } from "../../contexts/FrequencyContext";
import { useWizard } from "../../contexts/WizardContext";
import CalendarSchedulingModal from "../Forms/CalendarScheduling/CalendarSchedulingModal";
import DatasetTriggerModal from "../Forms/DatasetTrigger/DatasetTriggerModal";
import AddFileModal from "../Forms/AddFile/AddFileModal";
import { Tooltip } from "@mui/material";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

interface FrequencyInformationProps {
  frequencies?: {
    schedules: any[];
    datasetTriggers: any[];
    jobTriggers: any[];
  };
  jobName?: string;
  onContinue: (frequencies: any) => void;
  onBack: () => void;
}

const FrequencyInformation = ({
  jobName,
  onContinue,
  onBack
}: FrequencyInformationProps) => {
  const { 
    //schedules, 
    datasetTriggers, 
    jobTriggers,
    removeDatasetTrigger,
    removeJobTrigger,
    hasAnyFrequency,
    getFrequencySummary
  } = useFrequency();
  
  const { updateWizardData } = useWizard();
  const [modelMessage, setModelMessage] = useState("")
  const [modelIcon, setModelIcon] = useState<"success" | "error">("success")
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [activeModal, setActiveModal] = useState<'schedule' | 'dataset' | 'file' | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  // Handle continue
  const handleContinue = () => {
    const frequencies = {
      schedules,
      datasetTriggers,
      jobTriggers,
    };
    updateWizardData({ frequencies });
    onContinue(frequencies);
  };

  const handleAddSchedule = (data: Schedule) => {

    const isDuplicate = schedules.some(
    (item) =>
      item.frequency.trim().toLowerCase() === data.frequency.trim().toLowerCase() &&
      item.submitTimeHour === data.submitTimeHour &&
      item.submitTimeMinute === data.submitTimeMinute &&
      item.holidayAction === data.holidayAction &&
      item.hasIntervals === data.hasIntervals &&
      JSON.stringify(item.runDays) === JSON.stringify(data.runDays) &&
      JSON.stringify(item.runMonths) === JSON.stringify(data.runMonths) &&
      JSON.stringify(item.runOccurrences) === JSON.stringify(data.runOccurrences) &&
      JSON.stringify(item.holidays) === JSON.stringify(data.holidays) &&
      item.repeatStartHour === data.repeatStartHour &&
      item.repeatStartMinute === data.repeatStartMinute &&
      item.repeatEndHour === data.repeatEndHour &&
      item.repeatEndMinute === data.repeatEndMinute &&
      item.repeatType === data.repeatType &&
      item.repeatIntervalHour === data.repeatIntervalHour &&
      item.repeatIntervalMinute === data.repeatIntervalMinute
  );

  if (isDuplicate) {
      setModelMessage("Duplicate record found!");
      setModelIcon("error"); // We'll switch icons based on type
      console.log("Duplicate record found:", data);
      return;
  }
  if(data.frequency.trim().toLowerCase() === 'daily'){
      data.runDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday','Saturday','Sunday'];
  }
    if (editIndex !== null) {
    // Edit mode: update the schedule
    const updated = schedules.map((item, idx) => idx === editIndex ? data : item);
    setSchedules(updated);
    setModelMessage("Record Updated Successfully");
  } else {
    // Add mode: add new schedule
    setSchedules([...schedules, data]);
    setModelMessage("Record Added Successfully");
  }
    setModelIcon("success");
    console.log("Added calendar schedule:", data)
  }
console.log("Schedules in Frequency Information:", schedules);

const subTextMapper = {
  "daily": {
    "run-on-holiday:onHoliday": "(RH)-Job runs on holiday",
    "do-not-run:onHoliday": "(DH)-Job does not run on holiday",
    "do-not-run:after-holiday": "(DA)-Job does not run on the day after holiday",
  },
  "weekly": {
    "run-on-holiday:onHoliday": "(RH)-Job runs on holiday",
    "run-on-holiday:dayBeforeHoliday": "(RH)-Job runs on the day before holiday",
    "run-on-holiday:dayAfterHoliday": "(RH)-Job runs on the day after holiday",
    "do-not-run:onHoliday": "(DH)-Job does not run on holiday",   
    "do-not-run:after-holiday": "(DA)-Job does not run on the day after holiday",
  },
  "monthly": {
    "run-on-holiday:onHoliday": "(RH)-Job runs on holiday",
    "run-on-holiday:dayBeforeHoliday": "(RH)-Job runs on the day before holiday",
    "run-on-holiday:dayAfterHoliday": "(RH)-Job runs on the day after holiday",
    "do-not-run:onHoliday": "(DH)-Job does not run on holiday",
    "do-not-run:after-holiday": "(DA)-Job does not run on the day after holiday",
  },
};
  // Handle add file (job trigger)
  const handleAddFile = () => {
    setActiveModal('file');
  };

  const removeSchedule = (idx: number) => {
  setSchedules(schedules.filter((_, i) => i !== idx));
};



  // Tooltip content for Add Schedule
  const scheduleTooltip = (
    <div style={{ padding: '8px', fontSize: '13px', lineHeight: '1.5' }}>
      <div style={{ marginBottom: '6px' }}>Maximum 10 schedules can be added</div>
      <div>Schedule is added to a Job so it's execution is time dependent</div>
    </div>
  );

  // Tooltip content for Add Dataset Trigger
  const datasetTooltip = (
    <div style={{ padding: '8px', fontSize: '13px', lineHeight: '1.6' }}>
      <div style={{ marginBottom: '8px' }}>Maximum 10 Dataset Triggers can be added</div>
      <div style={{ marginBottom: '8px' }}>
        <strong>VDSN name for Executable job trigger:</strong>
      </div>
      <div style={{ marginBottom: '8px' }}>
        Virtual data set to this job with the compliant name: CATTRIG.xxxP.(jobname) Process name NDMED
      </div>
      <ul style={{ paddingLeft: '20px', margin: '8px 0', listStyleType: 'disc' }}>
        <li style={{ marginBottom: '6px' }}>
          CATTRIG is the constant
        </li>
        <li style={{ marginBottom: '6px' }}>
          xxxP denotes that the profile for this can be created and users added/deleted by the owner of the AIT owner(Assuming CPE is application prefix)
        </li>
        <li style={{ marginBottom: '6px' }}>
          (jobname) is the job name initiated by this VDSN, with xxxP being CPEP, the job name here can only be CPE, @CPE, #CPE, $CPE or C$CPE
        </li>
        <li style={{ marginBottom: '6px' }}>
          Process name is the process name that is executing the U7SVC program to "create" this virtual data set at the receiving site
        </li>
        <li style={{ marginBottom: '6px' }}>
          NDMED - this denotes the NDM task that sent it (not receiving it) and required only NDM process is involved for the post.
        </li>
      </ul>
    </div>
  );

  // Tooltip content for Add File
  const fileTooltip = (
    <div style={{ padding: '8px', fontSize: '13px', lineHeight: '1.5' }}>
      <div>Add file-based trigger for the job</div>
    </div>
  );

  return (
    <div className="py-6">
      <div className="space-y-6">
        {/* Add Frequency Section */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Add Frequency</h2>
          
          <div className="flex gap-4">
            {/* Add Schedule Button */}
            <div className="relative flex-1">
              <button
                className={`w-full px-6 py-3 text-white font-medium rounded transition-colors ${
                  schedules.length >= 10
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
                onClick={() => schedules.length < 10 && setActiveModal('schedule')}
                disabled={schedules.length >= 10}
              >
                Add Schedule
              </button>
              <div className="absolute -top-2 -right-2">
                <Tooltip 
                  title={scheduleTooltip}
                  placement="top"
                  arrow
                  PopperProps={{
                    modifiers: [
                      {
                        name: 'offset',
                        options: {
                          offset: [0, -8],
                        },
                      },
                    ],
                  }}
                  componentsProps={{
                    tooltip: {
                      sx: {
                        bgcolor: 'white',
                        color: 'black',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        fontSize: '13px',
                        maxWidth: '400px',
                        '& .MuiTooltip-arrow': {
                          color: 'white',
                          '&::before': {
                            border: '1px solid #e5e7eb',
                          },
                        },
                      },
                    },
                  }}
                >
                  <div className="bg-gray-500 rounded-full w-5 h-5 flex items-center justify-center cursor-help">
                    <HelpOutlineIcon sx={{ fontSize: 14, color: 'white' }} />
                  </div>
                </Tooltip>
              </div>
            </div>

            {/* Add Dataset Trigger Button */}
            <div className="relative flex-1">
              <button
                className={`w-full px-6 py-3 text-white font-medium rounded transition-colors ${
                  datasetTriggers.length >= 10
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
                onClick={() => datasetTriggers.length < 11 && setActiveModal('dataset')}
                disabled={datasetTriggers.length >= 10}
              >
                Add Dataset Trigger
              </button>
              <div className="absolute -top-2 -right-2">
                <Tooltip 
                  title={datasetTooltip}
                  placement="top"
                  arrow
                  PopperProps={{
                    modifiers: [
                      {
                        name: 'offset',
                        options: {
                          offset: [0, -8],
                        },
                      },
                    ],
                  }}
                  componentsProps={{
                    tooltip: {
                      sx: {
                        bgcolor: 'white',
                        color: 'black',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        fontSize: '13px',
                        maxWidth: '500px',
                        '& .MuiTooltip-arrow': {
                          color: 'white',
                          '&::before': {
                            border: '1px solid #e5e7eb',
                          },
                        },
                      },
                    },
                  }}
                >
                  <div className="bg-gray-500 rounded-full w-5 h-5 flex items-center justify-center cursor-help">
                    <HelpOutlineIcon sx={{ fontSize: 14, color: 'white' }} />
                  </div>
                </Tooltip>
              </div>
            </div>

            {/* Add File Button (Job Trigger) */}
            <div className="relative flex-1">
              <button
                className="w-full px-6 py-3 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 transition-colors"
                onClick={handleAddFile}
              >
                Add File
              </button>
              <div className="absolute -top-2 -right-2">
                <Tooltip 
                  title={fileTooltip}
                  placement="top"
                  arrow
                  PopperProps={{
                    modifiers: [
                      {
                        name: 'offset',
                        options: {
                          offset: [0, -8],
                        },
                      },
                    ],
                  }}
                  componentsProps={{
                    tooltip: {
                      sx: {
                        bgcolor: 'white',
                        color: 'black',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        fontSize: '13px',
                        maxWidth: '400px',
                        '& .MuiTooltip-arrow': {
                          color: 'white',
                          '&::before': {
                            border: '1px solid #e5e7eb',
                          },
                        },
                      },
                    },
                  }}
                >
                  <div className="bg-gray-500 rounded-full w-5 h-5 flex items-center justify-center cursor-help">
                    <HelpOutlineIcon sx={{ fontSize: 14, color: 'white' }} />
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>

        {/* Frequencies Section */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Frequencies</h3>
          
          {!hasAnyFrequency() ? (
            <div className="text-center py-8 text-gray-500">
              Job does not have any frequency attached
            </div>
          ) : (
            <div className="bg-white">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">SCHID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Frequency</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Display schedules */}
                  {schedules.map((schedule, index) => {
                    console.log("runDays in schedule:", schedule.runDays);
                    const { scheduleCount } = getFrequencySummary();
                    const frequency = schedule.frequency || 'Weekly';
                    const time = `${schedule.submitTimeHour || '00'}:${schedule.submitTimeMinute || '00'}`;
                    const days = schedule.runDays?.length > 0 
                      ? schedule.runDays.join(',') 
                      : '';
                    const holidayNote = subTextMapper?.[schedule.frequency.toLowerCase()]?.[schedule.holidayAction] ?? "";
                   
                    return (
                      <tr key={`schedule-${index}`} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          {schedule.schidId}
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <div className="text-sm text-gray-900">
                              Job {jobName} runs {frequency} at {time} hrs (Local LPAR Time) {days}
                            </div>
                            {holidayNote && (
                              <div className="text-xs text-gray-600 mt-1">
                                {holidayNote}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 flex items-center gap-1">
                              <span className="text-xs">+</span> PRED
                              <span className="bg-gray-600 text-white text-xs px-1 rounded">0</span>
                            </button>
                            {/* <button className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 flex items-center gap-1">
                              <span className="text-xs">+</span> VRM
                              <span className="bg-gray-600 text-white text-xs px-1 rounded">0</span>
                            </button> */}
                            <button className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200">
                              Profile
                              <span className="bg-gray-600 text-white text-xs px-1 ml-1 rounded">0</span>
                            </button>
                            <button className="p-1 text-gray-500 hover:text-gray-700" onClick={() =>{
                              setEditIndex(index);
                              setActiveModal('schedule')}}>
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </button>
                            <button 
                              onClick={() => removeSchedule(index)}
                              className="p-1 text-gray-500 hover:text-red-600"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {/* Display dataset triggers */}
                  {datasetTriggers.map((trigger, index) => (
                    <tr key={`dataset-${index}`} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-900">
                          Dataset Trigger: {trigger.datasetName || 'CATTRIG.xxxP.jobname'}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1 text-gray-500 hover:text-gray-700">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => removeDatasetTrigger(index)}
                            className="p-1 text-gray-500 hover:text-red-600"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {/* Display job triggers (files) */}
                  {jobTriggers.map((trigger, index) => (
                    <tr key={`job-${index}`} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-900">
                          File Trigger: {trigger.sourceJobName || trigger.fileName || 'File trigger'}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1 text-gray-500 hover:text-gray-700">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => removeJobTrigger(index)}
                            className="p-1 text-gray-500 hover:text-red-600"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-8 mt-8 border-t border-gray-200">
          <button
            onClick={onBack}
            className="px-6 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleContinue}
            disabled={!hasAnyFrequency()}
            className={`px-6 py-2 font-medium rounded transition-colors ${
              hasAnyFrequency()
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Modals */}
      <CalendarSchedulingModal
        isOpen={activeModal === 'schedule'}
        onClose={() => { setActiveModal(null);  setEditIndex(null); }}
        onAdd={handleAddSchedule}
        modelMessage={modelMessage}
        modelIcon={modelIcon}
      />

      <DatasetTriggerModal
        isOpen={activeModal === 'dataset'}
        onClose={() => setActiveModal(null)}
      />

      <AddFileModal
        isOpen={activeModal === 'file'}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
};

export default FrequencyInformation;
