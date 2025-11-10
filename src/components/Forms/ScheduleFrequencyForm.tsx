import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button, BackButton } from "../UI"
import CustomDropdown from "../common/CustomDropdown"
import AddFileModal from "./AddFile/AddFileModal"
import DatasetTriggerModal from "./DatasetTrigger/DatasetTriggerModal"
import CalendarSchedulingModal from "./CalendarScheduling/CalendarSchedulingModal"
import { useFrequency } from "../../contexts/FrequencyContext"
import { 
  scheduleFrequencySchema, 
  defaultScheduleFrequencyValues,
  SCHEDULE_FREQUENCY_OPTIONS,
  ScheduleFrequencyFormData 
} from "../../schemas/scheduleFrequency.schema"

interface ScheduleFrequencyFormProps {
  onContinue: () => void;
  onBack: () => void;
}

const ScheduleFrequencyForm: React.FC<ScheduleFrequencyFormProps> = ({ onContinue, onBack }) => {
  // Frequency context for managing schedules and triggers
  const { 
    schedules, 
    datasetTriggers, 
    jobTriggers, 
    addDatasetTrigger,
    removeSchedule,
    removeDatasetTrigger,
    removeJobTrigger,
    hasAnyFrequency,
    getFrequencySummary
  } = useFrequency()

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDatasetTriggerModalOpen, setIsDatasetTriggerModalOpen] = useState(false)
  const [isCalendarSchedulingModalOpen, setIsCalendarSchedulingModalOpen] = useState(false)

  // React Hook Form setup
  const { 
    control, 
    handleSubmit, 
    watch, 
    reset, 
    setValue,
    formState: { errors, isValid } 
  } = useForm<ScheduleFrequencyFormData>({
    resolver: yupResolver(scheduleFrequencySchema),
    defaultValues: defaultScheduleFrequencyValues,
    mode: 'onChange',
  })

  // Watch form values for conditional rendering
  const watchedIsJobOnRequest = watch('isJobOnRequest')
  const watchedScheduleType = watch('scheduleType')
  const watchedFrequency = watch('frequency')

  const hasSelected = !!watchedIsJobOnRequest

  const handleReset = () => {
    reset(defaultScheduleFrequencyValues)
  }

  const onSubmit = (data: ScheduleFrequencyFormData) => {
    console.log('Form submitted:', data)
    onContinue()
  }

  const handleDatasetTriggerClick = () => {
    setIsDatasetTriggerModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  const handleDatasetTriggerModalClose = () => {
    setIsDatasetTriggerModalOpen(false)
  }

  const handleCalendarSchedulingClick = () => {
    setIsCalendarSchedulingModalOpen(true)
  }

  const handleCalendarSchedulingModalClose = () => {
    setIsCalendarSchedulingModalOpen(false)
  }

  // Get all frequency items for display
  const getAllFrequencyItems = () => {
    const items = [
      ...schedules.map(schedule => ({ 
        type: 'schedule', 
        id: schedule.id, 
        data: schedule 
      })),
      ...datasetTriggers.map(trigger => ({ 
        type: 'dataset', 
        id: trigger.id, 
        data: trigger 
      })),
      ...jobTriggers.map(trigger => ({ 
        type: 'job', 
        id: trigger.id, 
        data: trigger 
      })),
    ]
    return items
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* Warning Banner */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex items-start">
          <span className="text-yellow-600 mr-2">⚠️</span>
          <div className="text-sm">
            <strong className="text-yellow-800">WARNING</strong>
            <div className="text-yellow-700">VRM section is disabled for non-executable jobs</div>
          </div>
        </div>
      </div>

      <div className="flex gap-5 max-w-7xl mx-auto mt-5 bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Left Sidebar Navigation */}
        <div className="w-64 bg-gray-50 p-5 border-r border-gray-200">
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 rounded-md bg-green-50 text-green-700">
              <span className="text-xl">✅</span>
              <span className="text-sm font-medium">General Information</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-md bg-blue-50 text-blue-700 font-medium">
              <span className="text-xl">📅</span>
              <span className="text-sm">Frequency Information</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-md text-gray-600 cursor-pointer hover:bg-gray-100">
              <span className="text-xl">📋</span>
              <span className="text-sm">Review & Submit</span>
            </div>
          </div>
        </div>

        {/* Main Form Content */}
        <div className="flex-1 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl">
            {/* Main Question */}
            <div className="mb-6">
              <CustomDropdown
                name="isJobOnRequest"
                control={control}
                label="Is the job on request?"
                options={SCHEDULE_FREQUENCY_OPTIONS.JOB_ON_REQUEST}
                placeholder="--Select Option--"
                required
                error={!!errors.isJobOnRequest}
                helperText={errors.isJobOnRequest?.message}
                className="max-w-[300px]"
              />
              {hasSelected && (
                <Button 
                  type="button"
                  onClick={handleReset} 
                  variant="danger" 
                  className="text-sm mt-3"
                >
                  Reset
                </Button>
              )}
            </div>

            {/* Add Frequency Section - Only show when selection is made */}
            {hasSelected && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Frequency</h3>

                {/* Show 2 buttons for "Yes" */}
                {watchedIsJobOnRequest === "Yes" && (
                  <div className="flex gap-3">
                    <button 
                      type="button"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-400 rounded-md cursor-not-allowed" 
                      disabled
                    >
                      <span className="text-lg">📋</span>
                      Add a Resource
                    </button>
                    <button 
                      type="button"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-400 rounded-md cursor-not-allowed" 
                      disabled
                    >
                      <span className="text-lg">⏮️</span>
                      Add a Predecessor
                    </button>
                  </div>
                )}

                {/* Show 3 buttons for "No" */}
                {watchedIsJobOnRequest === "No" && (
                  <div className="flex gap-3">
                    <button 
                      type="button"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" 
                      onClick={handleCalendarSchedulingClick}
                    >
                      <span className="text-lg">📅</span>
                      Add Schedule
                    </button>
                    <button 
                      type="button"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" 
                      onClick={handleDatasetTriggerClick}
                    >
                      <span className="text-lg">📊</span>
                      Add Dataset Trigger
                    </button>
                    <button 
                      type="button"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-400 rounded-md cursor-not-allowed" 
                      disabled
                    >
                      <span className="text-lg">⚡</span>
                      Add Job Trigger
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Frequencies Section - Only show when selection is made */}
            {hasSelected && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Frequencies
                  {hasAnyFrequency() && (
                    <span className="ml-2 text-sm text-blue-600 font-normal">
                      ({getFrequencySummary().scheduleCount} schedules, {getFrequencySummary().datasetCount} datasets, {getFrequencySummary().  jobCount} jobs)
                    </span>
                  )}
                </h3>
                <div className="border border-gray-200 rounded-md p-4">
                  {getAllFrequencyItems().length > 0 ? (
                    <div className="space-y-3">
                      {getAllFrequencyItems().map((item) => (
                        <div key={item.id} className="p-3 bg-gray-50 rounded-md text-sm flex justify-between items-start">
                          <div className="flex-1">
                            {item.type === 'schedule' && (
                              <>
                                <div className="font-medium text-gray-700">
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 mr-2">
                                    Schedule
                                  </span>
                                  {item.data.frequency} at {item.data.submitTimeHour}:{item.data.submitTimeMinute}
                                </div>
                                <div className="text-gray-600 mt-1">
                                  Holiday Action: {item.data.holidayAction}
                                </div>
                              </>
                            )}
                            {item.type === 'dataset' && (
                              <>
                                <div className="font-medium text-gray-700">
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 mr-2">
                                    Dataset
                                  </span>
                                  {item.data.datasetName}
                                </div>
                                <div className="text-gray-600 mt-1">
                                  <span className="font-semibold">Source:</span> {item.data.sourceJobName || 'N/A'}
                                </div>
                                {item.data.isNdmTransmission && item.data.ndmSourceNode && (
                                  <div className="text-gray-600 mt-1">
                                    <span className="font-semibold">NDM Node:</span> {item.data.ndmSourceNode}
                                  </div>
                                )}
                              </>
                            )}
                            {item.type === 'job' && (
                              <>
                                <div className="font-medium text-gray-700">
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 mr-2">
                                    Job Trigger
                                  </span>
                                  {item.data.triggerJobName}
                                </div>
                                <div className="text-gray-600 mt-1">
                                  <span className="font-semibold">LPAR:</span> {item.data.triggerJobLpar}
                                </div>
                                <div className="text-gray-600 mt-1">
                                  <span className="font-semibold">Condition:</span> {item.data.triggerCondition}
                                </div>
                              </>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (item.type === 'schedule') removeSchedule(item.id)
                              else if (item.type === 'dataset') removeDatasetTrigger(item.id)
                              else if (item.type === 'job') removeJobTrigger(item.id)
                            }}
                            className="text-red-500 hover:text-red-700 text-sm ml-4"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">Job does not have any frequency attached</p>
                  )}
                </div>
              </div>
            )}

            {/* Conditional Content for Yes/No */}
            {watchedIsJobOnRequest === "Yes" && (
              <div className="mb-8">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                  <span className="text-blue-600 text-xl">ℹ️</span>
                  <div>
                    <p className="font-semibold text-blue-900">On-Request Job</p>
                    <p className="text-sm text-blue-800 mt-1">This job will be executed manually when requested. No automatic scheduling is required.</p>
                  </div>
                </div>
              </div>
            )}

            {watchedIsJobOnRequest === "No" && (
              <div className="space-y-4 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CustomDropdown
                    name="scheduleType"
                    control={control}
                    label="Schedule Type"
                    options={SCHEDULE_FREQUENCY_OPTIONS.SCHEDULE_TYPE}
                    required
                    error={!!errors.scheduleType}
                    helperText={errors.scheduleType?.message}
                  />

                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Start Time
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <Controller
                      name="startTime"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="time"
                          className={`
                            w-full px-3 py-2.5 text-sm border rounded-md 
                            focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                            ${errors.startTime ? 'border-red-500' : 'border-gray-300'}
                          `}
                        />
                      )}
                    />
                    {errors.startTime && (
                      <span className="text-xs text-red-500 mt-1 block">{errors.startTime?.message}</span>
                    )}
                  </div>
                </div>

                <CustomDropdown
                  name="frequency"
                  control={control}
                  label="Frequency"
                  options={SCHEDULE_FREQUENCY_OPTIONS.FREQUENCY}
                  required
                  error={!!errors.frequency}
                  helperText={errors.frequency?.message}
                  className="max-w-[300px]"
                />

                {/* Additional conditional fields based on frequency */}
                {watchedFrequency === 'weekly' && (
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Run Days</label>
                    <div className="flex flex-wrap gap-2">
                      {SCHEDULE_FREQUENCY_OPTIONS.DAYS_OF_WEEK.map((day) => (
                        <Controller
                          key={day.value}
                          name="runDays"
                          control={control}
                          render={({ field }) => {
                            const isSelected = field.value?.includes(day.value)
                            return (
                              <button
                                type="button"
                                onClick={() => {
                                  const currentValue = field.value || []
                                  if (isSelected) {
                                    field.onChange(currentValue.filter((d: string) => d !== day.value))
                                  } else {
                                    field.onChange([...currentValue, day.value])
                                  }
                                }}
                                className={`
                                  px-3 py-1 text-sm rounded-md border transition-colors
                                  ${isSelected 
                                    ? 'bg-blue-100 border-blue-300 text-blue-800' 
                                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                  }
                                `}
                              >
                                {day.label}
                              </button>
                            )
                          }}
                        />
                      ))}
                    </div>
                    {errors.runDays && (
                      <span className="text-xs text-red-500 mt-1 block">{errors.runDays?.message}</span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Form Actions at Bottom */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
              <BackButton type="button" onClick={onBack}>Back to Job Definition</BackButton>
              {hasSelected && (
                <Button 
                  type="submit"
                  variant="primary"
                  disabled={!isValid}
                >
                  Continue to Review
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Add File Modal */}
      <AddFileModal isOpen={isModalOpen} onClose={handleModalClose} />

      {/* Dataset Trigger Modal */}
      <DatasetTriggerModal 
        isOpen={isDatasetTriggerModalOpen} 
        onClose={handleDatasetTriggerModalClose} 
      />

      {/* Calendar Scheduling Modal */}
      <CalendarSchedulingModal 
        isOpen={isCalendarSchedulingModalOpen} 
        onClose={handleCalendarSchedulingModalClose} 
      />
    </div>
  )
}

export default ScheduleFrequencyForm
