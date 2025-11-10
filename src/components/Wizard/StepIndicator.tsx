import React from "react"

interface StepIndicatorProps {
  currentStep: number
  steps: {
    number: number
    title: string
  }[]
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, steps }) => {
  return (
    <div className="w-full bg-white py-4">
      <div className="flex items-center justify-between max-w-4xl mx-auto relative">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            {/* Step */}
            <div className="flex flex-col items-center relative z-10">
              {/* Step Circle */}
              <div 
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                  border-2 transition-colors duration-200
                  ${currentStep === step.number 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : currentStep > step.number
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-400 border-gray-300'
                  }
                `}
              >
                {currentStep > step.number ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              
              {/* Step Title */}
              <span 
                className={`
                  mt-2 text-xs text-center max-w-24 leading-tight
                  ${currentStep === step.number ? 'text-gray-900 font-medium' : 
                    currentStep > step.number ? 'text-gray-600' : 'text-gray-500'}
                `}
              >
                {step.title}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-[1px] bg-gray-300 mx-4 relative top-[-16px]">
                <div 
                  className={`
                    h-full transition-all duration-300
                    ${currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'}
                  `}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default StepIndicator
