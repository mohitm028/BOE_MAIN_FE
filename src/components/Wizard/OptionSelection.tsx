import React from "react"
import { FileText, Edit, Trash2 } from "lucide-react"

interface OptionSelectionProps {
  selectedOption: string | null
  onSelectOption: (option: string) => void
  onContinue: () => void
}

const OptionSelection: React.FC<OptionSelectionProps> = ({ 
  selectedOption, 
  onSelectOption, 
  onContinue 
}) => {
  const options = [
    {
      id: 'add-new',
      icon: FileText,
      title: 'Add New Job Schedule',
      description: 'Add a new job and define it\'s scheduling criteria in CA7',
    },
    {
      id: 'modify-existing',
      icon: Edit,
      title: 'Modify Existing Job Schedule',
      description: 'Modify an existing job parameters and/or scheduling information in CA7',
    },
    {
      id: 'delete-job',
      icon: Trash2,
      title: 'Delete a Job',
      description: 'Delete a job alongwith scheduling information from CA7',
    },
  ]

  return (
    <div className="py-6">
      <div className="grid grid-cols-3 gap-4 mb-8">
        {options.map((option) => (
          <div
            key={option.id}
            onClick={() => onSelectOption(option.id)}
            className={`
              relative p-4 rounded-lg cursor-pointer transition-all duration-200 
              min-h-[100px] bg-white overflow-hidden
              ${selectedOption === option.id 
                ? 'bg-blue-50' 
                : ''
              }
            `}
            style={{
              border: selectedOption === option.id ? '2px solid #3b82f6' : '2px solid #d1d5db'
            }}
          >
            {/* Selection Tick Mark - Curved Corner */}
            {selectedOption === option.id && (
              <div className="absolute top-0 right-0">
                {/* Blue curved corner */}
                <div 
                  className="w-8 h-8 bg-blue-500"
                  style={{
                    borderRadius: '0 0 0 100%'
                  }}
                ></div>
                {/* Check mark */}
                <div className="absolute top-1.5 right-1.5">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="12" 
                    height="12" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="text-white"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
              </div>
            )}
            
            {/* Content - Horizontal Layout */}
            <div className="flex items-start gap-3">
              {/* Icon - Left Side */}
              <div className="flex-shrink-0">
                <option.icon 
                  className="w-6 h-6 text-gray-700" 
                  strokeWidth={1.5} 
                />
              </div>
              
              {/* Text Content - Right Side */}
              <div className="flex-1">
                {/* Title */}
                <h3 className="text-sm font-semibold text-gray-900 mb-1 leading-tight">
                  {option.title}
                </h3>
                
                {/* Description */}
                <p className="text-xs text-gray-600 leading-relaxed">
                  {option.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Continue Button */}
      <div className="flex justify-start">
        <button
          onClick={onContinue}
          disabled={!selectedOption}
          className={`
            px-6 py-2.5 text-sm font-medium rounded-md transition-all duration-200
            ${selectedOption 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          Continue
        </button>
      </div>
    </div>
  )
}

export default OptionSelection
