import React, { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useFrequency } from '../../../contexts/FrequencyContext';
import { useJob } from '../../../contexts/JobContext';
import { 
  datasetTriggerSchema, 
  DatasetTriggerFormData,
  defaultDatasetTriggerValues,
  generateDatasetName 
} from '../../../schemas/datasetTrigger.schema';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CloseIcon from '@mui/icons-material/Close';

interface DatasetTriggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (data: any) => void;
}

const DatasetTriggerModal: React.FC<DatasetTriggerModalProps> = ({ isOpen, onClose, onAdd }) => {
  const { addDatasetTrigger, datasetTriggers} = useFrequency();
  const [showSuccess, setShowSuccess] = useState(false);
  const { jobData } = useJob();
  const jobName = jobData?.jobName || '';
  const { 
    control, 
    handleSubmit, 
    watch, 
    reset, 
    setValue,
    formState: { errors, isValid } 
  } = useForm<DatasetTriggerFormData>({
    resolver: yupResolver(datasetTriggerSchema),
    defaultValues: defaultDatasetTriggerValues,
    mode: 'onChange'
  });

  const watchIsNdmTransmission = watch('isNdmTransmission');
  const watchSourceJobName = watch('sourceJobName');
  const watchNdmSourceNode = watch('ndmSourceNode');

  // Auto-generate dataset name based on inputs
  useEffect(() => {
    const generatedName = generateDatasetName(
      watchSourceJobName || '',
      watchIsNdmTransmission,
      watchNdmSourceNode,
      jobName
    );
     
    setValue('datasetName', generatedName);
  }, [watchSourceJobName, watchIsNdmTransmission, watchNdmSourceNode, setValue]);

  // Reset NDM source node when toggle is turned off
  useEffect(() => {
    if (!watchIsNdmTransmission) {
      setValue('ndmSourceNode', '');
    }
  }, [watchIsNdmTransmission, setValue]);

  if (!isOpen) return null;

  const onSubmit = (data: DatasetTriggerFormData) => {
    const isDuplicate = datasetTriggers.some(
    (trigger )=> trigger.datasetName === data.datasetName 
    );
    if (isDuplicate) {
      alert(`Dataset with name ${data.datasetName} already exists.`);
      return;
    }
    const trigger = {
      id: Date.now().toString(),
      datasetName: data.datasetName,
      sourceJobName: data.sourceJobName,
      isNdmTransmission: data.isNdmTransmission,
      ndmSourceNode: data.isNdmTransmission ? data.ndmSourceNode : undefined,
    };
    
    addDatasetTrigger(trigger);
    onAdd?.(trigger);
    setShowSuccess(true);
  };
  console.log("Dataset Triggers:", datasetTriggers);

  const handleAddMore = () => {
    reset(defaultDatasetTriggerValues);
    setShowSuccess(false);
  };

  const handleCloseModal = () => {
    reset(defaultDatasetTriggerValues);
    setShowSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div style={{ width: '1000px' }} className="bg-white rounded-lg shadow-xl max-w-lg" >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
          <h2 className="text-base font-medium text-gray-900">Add File</h2>
          <button
            onClick={handleCloseModal}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-1">
          {!showSuccess ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* NDM Transmission Toggle */}
              <div>
                <Controller
                  name="isNdmTransmission"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center gap-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          {...field}
                          checked={field.value}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                      <span className="text-sm font-medium text-gray-700">
                        File transmitted through NDM transmission?
                      </span>
                      <HelpOutlineIcon 
                        sx={{ fontSize: 16, color: '#9ca3af', cursor: 'help' }}
                        titleAccess="Enable if the file is transmitted via NDM (Network Data Mover)"
                      />
                    </div>
                  )}
                />
              </div>

              {/* Source Job/Process Name Field */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <HelpOutlineIcon 
                    sx={{ fontSize: 16, color: '#9ca3af', cursor: 'help' }}
                    titleAccess="Enter source job or process name"
                  />
                </div>
                <div className="flex gap-3 items-start">
                 
                  <div style={{ width: '400px' }}>
                    <Controller
                      name="sourceJobName"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <input
                            {...field}
                            type="text"
                            placeholder="Enter source job or process name"
                            className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.sourceJobName ? 'border-red-500' : 'border-gray-300'
                            }`}
                            style={{ textTransform: 'uppercase' }}
                            onChange={(e) => field.onChange(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                            maxLength={8}
                          />
                          {errors.sourceJobName && (
                            <span className="text-xs text-red-500 mt-1 block">{errors.sourceJobName.message}</span>
                          )}
                        </div>
                      )}
                    />
                  </div>
                  
              {/* NDM Source Node - Conditional */}
              {watchIsNdmTransmission && (
                <div style={{ width: '400px' }} className=''>
                  <div className="">
                     <div className="">
                      <Controller
                        name="ndmSourceNode"
                        control={control}
                        render={({ field }) => (
                          <div>
                            <input
                              {...field}
                              type="text"
                              placeholder="Enter Source NDM Node"
                              className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.ndmSourceNode ? 'border-red-300' : 'border-gray-300'
                              }`}
                              style={{ textTransform: 'uppercase' }}
                              onChange={(e) => field.onChange(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                              maxLength={8}
                            />
                            {errors.ndmSourceNode && (
                              <span className="text-xs text-red-500 mt-1 block">{errors.ndmSourceNode.message}</span>
                            )}
                          </div>
                        )}
                      />
                    </div>
                  </div>
                </div>
              )}
                </div>
              
             </div>
              {/* Dataset Name - Auto-generated and Disabled */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Dataset Name:</label>
                <Controller
                  name="datasetName"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      disabled
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-100 text-gray-600 font-mono"
                    />
                  )}
                />
                {errors.datasetName && (
                  <span className="text-xs text-red-500 mt-1 block">{errors.datasetName.message}</span>
                )}
              </div>
            </form>
          ) : (
            /* Success State */
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Record Added Successfully</h3>
              <div className="flex justify-center mb-8">
                <CheckCircleIcon sx={{ fontSize: 80, color: '#22c55e' }} />
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
          )}
        </div>

        {/* Modal Footer - Fixed at bottom */}
        {!showSuccess && (
          <div className="flex justify-center gap-3 px-5 py-3 border-t border-gray-200 bg-white">
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

export default DatasetTriggerModal;
