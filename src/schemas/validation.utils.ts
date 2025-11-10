// Validation utilities and constants from old project

// REGEX PATTERNS (from old project)
export const VALIDATION_PATTERNS = {
  // Job name: Cannot start with number, A-Z/0-9/@/#/$ only, uppercase
  JOB_NAME: /^[A-Z@#$][A-Z0-9@#$]*$/,
  
  // Region: Only alphabetic characters
  REGION: /^[a-zA-Z]+$/,
  
  // LPAR: Alphanumeric only  
  LPAR: /^[a-zA-Z0-9]+$/,
  
  // Time: 24-hour format
  HOUR: /^(0[0-9]|1[0-9]|2[0-3])$/,
  MINUTE: /^[0-5][0-9]$/,
  
  // Dataset name patterns
  DATASET_FIRST_CHAR: /[A-Za-z#@$]/,
  DATASET_REMAINING_CHARS: /^[A-Za-z0-9#@$]*$/,
  ACCENTED_CHARS: /[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]/i,
  
  // NDM source node: Uppercase letters and numbers only
  NDM_SOURCE_NODE: /^[A-Z0-9]+$/,
  
  // Advanced patterns for enhanced validation
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  CRQ_NUMBER: /^CRQ\d{12}$/,
  CHANGE_REQUEST: /^CHG\d{12}$/,
  CRON_EXPRESSION: /^(\*|([0-9]|[1-5][0-9]|\*)) (\*|([0-9]|1[0-9]|2[0-3]|\*)) (\*|([1-9]|[12][0-9]|3[01]|\*)) (\*|([1-9]|1[0-2]|\*)) (\*|([0-6]|\*))$/,
  
  // Time range validation
  TIME_24H: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
  
  // Dataset qualifier validation
  DATASET_QUALIFIER: /^[A-Za-z#@$][A-Za-z0-9#@$]{0,7}$/,

  // Business rule patterns
  BUSINESS_HOURS: /^(09|1[0-6]):([0-5][0-9])$/,  // 09:00-16:59
  MAINTENANCE_WINDOW: /^(02|03):([0-5][0-9])$/,  // 02:00-03:59
  PEAK_HOURS: /^(09|1[0-6]):([0-5][0-9])$/,      // 09:00-16:59
  OFF_PEAK_HOURS: /^(1[7-9]|2[0-3]|0[0-8]):([0-5][0-9])$/,  // 17:00-08:59
  
  // Advanced validation patterns
  VERSION_NUMBER: /^v?\d+\.\d+(\.\d+)?$/,
  JOB_PRIORITY: /^[1-9]$|^10$/,  // 1-10 priority levels
  RESOURCE_ALLOCATION: /^([1-9]|[1-9][0-9]|100)$/,  // 1-100 percentage
  
  // System specific patterns
  MAINFRAME_DATASET: /^[A-Z0-9#@$]{1,8}(\.[A-Z0-9#@$]{1,8})*$/,
  UNIX_PATH: /^\/[a-zA-Z0-9_.\-\/]*$/,
  WINDOWS_PATH: /^[a-zA-Z]:(\\[a-zA-Z0-9_.\-\s]+)*\\?$/,
};

// ERROR MESSAGES (exact text from old project)
export const ERROR_MESSAGES = {
  // Required field errors
  REQUIRED: {
    JOB_NAME: 'Job Name is required',
    REGION: 'Region is required',
    LPAR: 'LPAR is required',
    SOURCE_JOB_NAME: 'Source job or process name is required',
    NDM_SOURCE_NODE: 'NDM source node is required when NDM transmission is enabled',
    DATASET_NAME: 'Dataset name is required',
    ACTIVATION_DATE: 'Activation date is required',
    ACTIVATION_TIME: 'Activation time is required',
  },
  
  // Format errors  
  FORMAT: {
    JOB_NAME: 'Job Name must be 8 character, cannot start with a number and can contain A-Z, 0-9, @, # or $. All chars must be uppercase',
    REGION: 'Region must contain only alphabets',
    LPAR: 'LPAR must be alphanumeric',
    INVALID_HOUR: 'Invalid hour format (00-23)',
    INVALID_MINUTE: 'Invalid minute format (00-59)',
  },
  
  // Dataset specific errors
  DATASET: {
    MIN_SEGMENTS: 'Dataset name must have at least two segments separated by periods',
    MAX_LENGTH: 'Dataset name cannot be longer than 44 characters',
    DOUBLE_PERIODS: 'Dataset name cannot contain two successive periods',
    END_PERIOD: 'Dataset name cannot end with a period',
    ACCENTED_CHARS: 'Dataset name cannot contain accented characters',
    EMPTY_SEGMENT: 'Segment {0} cannot be empty',
    SEGMENT_TOO_LONG: 'Segment \'{0}\' cannot be longer than 8 characters',
    INVALID_FIRST_CHAR: 'First character of segment \'{0}\' must be a letter or #, @, $',
    INVALID_CHARS: 'Invalid characters in segment \'{0}\'. Only letters, numbers, #, @, $ are allowed',
  },
  
  // Conditional validation errors
  CONDITIONAL: {
    EMEA_CALLOUT: 'Please select callout priority for EMEA region',
    FUTURE_DATE: 'Date must be in the future',
    END_AFTER_START: 'End time must be after start time',
    MIN_INTERVAL: 'Interval must be at least 15 minutes',
    SCHEDULE_CONFLICT: 'Schedule conflicts with existing job timing',
    RESOURCE_UNAVAILABLE: 'Selected resource is not available during specified time',
    PREDECESSOR_CYCLE: 'Predecessor relationship creates circular dependency',
    INVALID_TIME_RANGE: 'End time must be later than start time',
    OVERLAPPING_SCHEDULES: 'Schedule overlaps with another job schedule',
    HOLIDAY_VALIDATION: 'Holiday configuration is required for holiday-based frequency',
  },

  // Advanced business rule errors
  BUSINESS_RULES: {
    MAX_CONCURRENT_JOBS: 'Maximum concurrent jobs limit reached',
    RESOURCE_QUOTA_EXCEEDED: 'Resource quota exceeded for selected time slot',
    MAINTENANCE_WINDOW: 'Schedule conflicts with maintenance window (02:00-04:00)',
    PEAK_HOURS_RESTRICTION: 'Job cannot be scheduled during peak hours (9 AM - 5 PM)',
    WEEKEND_RESTRICTION: 'Weekend scheduling not allowed for this job type',
    DEPENDENCY_NOT_MET: 'Required job dependency not satisfied',
    INSUFFICIENT_RESOURCES: 'Insufficient system resources available for scheduled time',
    BLACKOUT_PERIOD: 'Schedule conflicts with system blackout period',
    LPAR_UNAVAILABLE: 'Selected LPAR is not available during specified time',
    REGION_RESTRICTION: 'Job type not supported in selected region',
    PRIORITY_CONFLICT: 'Job priority conflicts with existing critical jobs',
    TIME_ZONE_MISMATCH: 'Schedule time zone does not match LPAR time zone',
    FREQUENCY_OVERLAP: 'Schedule frequency causes overlap with existing jobs',
    RESOURCE_CONTENTION: 'Resource contention detected with higher priority jobs',
    DATASET_LOCK: 'Required dataset is locked by another process',
    PREDECESSOR_TIMEOUT: 'Predecessor job timeout exceeds maximum allowed time',
    CIRCULAR_DEPENDENCY: 'Circular dependency detected in job chain',
    INVALID_JOB_CHAIN: 'Invalid job chain configuration detected',
    QUOTA_LIMIT_EXCEEDED: 'User or team job quota limit exceeded',
    EMERGENCY_MODE: 'System is in emergency mode, non-critical jobs suspended',
  },

  // System constraints and limits
  SYSTEM_LIMITS: {
    MAX_DATASET_LENGTH: 'Dataset name exceeds maximum length of 44 characters',
    MAX_JOB_NAME_LENGTH: 'Job name exceeds maximum length of 8 characters',
    MAX_SCHEDULE_COUNT: 'Maximum number of schedules (50) exceeded',
    MAX_PREDECESSOR_COUNT: 'Maximum number of predecessors (10) exceeded',
    MAX_RESOURCE_COUNT: 'Maximum number of resources (20) exceeded',
    SESSION_TIMEOUT: 'Session timeout exceeded, please refresh and try again',
    API_RATE_LIMIT: 'API rate limit exceeded, please wait before retrying',
    CONCURRENT_EDIT_CONFLICT: 'Job is being edited by another user',
  },

  // Compliance and security
  COMPLIANCE: {
    AUDIT_REQUIRED: 'Job requires audit trail for compliance',
    APPROVAL_REQUIRED: 'Job requires manager approval for this schedule',
    SECURITY_CLEARANCE: 'Insufficient security clearance for selected LPAR',
    DATA_CLASSIFICATION: 'Data classification level requires additional security',
    RETENTION_POLICY: 'Schedule violates data retention policy requirements',
    REGULATORY_WINDOW: 'Schedule falls within regulatory reporting window',
  }
};

export const DROPDOWN_OPTIONS = {
  REGIONS: [
    { value: "", label: "-- Select Region --", disabled: true },
    { value: 'AMRS', label: 'AMRS', disabled: false },
    { value: 'EMEA', label: 'EMEA', disabled: true },  
  ],
  
  LPARS: [
    { value: '', label: '-- Select LPAR --', disabled: true },
    { value: '1X', label: '1X', disabled: false },
    { value: '1O', label: '1O', disabled: true }, 
    { value: '9S', label: '9S', disabled: true },  
  ],
  
  UIDS: Array.from({ length: 256 }, (_, i) => ({
    value: i.toString(),
    label: i.toString(),
  })),
  
  JCL_LIBRARIES: [
    { value: 'NBSP.NBS.JCLLIB', label: 'NBSP.NBS.JCLLIB' },
    { value: 'PROD.NBSP.PROD.JCLLIB', label: 'PROD.NBSP.PROD.JCLLIB' },
    { value: 'TEST.JCLLIB', label: 'TEST.JCLLIB' },
  ],
  
  EMAIL_LISTS: [
    { value: 'team1@company.com', label: 'team1@company.com' },
    { value: 'team2@company.com', label: 'team2@company.com' },
    { value: 'admin@company.com', label: 'admin@company.com' },
    { value: 'ops@company.com', label: 'ops@company.com' },
  ],
  
  CALLOUT_PRIORITIES: [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
  ],
  
  YES_NO: [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' },
  ],
  
  FREQUENCIES: [
    { value: 'Daily', label: 'Daily' },
    { value: 'Weekly', label: 'Weekly' },
    { value: 'Monthly', label: 'Monthly' },
    { value: 'Annually', label: 'Annually' },
    { value: 'Run Only on holiday', label: 'Run Only on holiday' },
    { value: 'Run Only on day before holiday', label: 'Run Only on day before holiday' },
    { value: 'Run Only on day after holiday', label: 'Run Only on day after holiday' },
  ],
  
  DAYS_OF_WEEK: [
    { value: 'Monday', label: 'Monday' },
    { value: 'Tuesday', label: 'Tuesday' },
    { value: 'Wednesday', label: 'Wednesday' },
    { value: 'Thursday', label: 'Thursday' },
    { value: 'Friday', label: 'Friday' },
    { value: 'Saturday', label: 'Saturday' },
    { value: 'Sunday', label: 'Sunday' },
  ],

  MONTHS: [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ],

  HOLIDAY_ACTIONS: [
    { value: 'run-as-normal', label: 'Run as normal' },
    { value: 'do-not-run', label: 'Do not run' },
    { value: 'run-day-before', label: 'Run day before' },
    { value: 'run-day-after', label: 'Run day after' },
  ],

  HOLIDAY_SUB_ACTIONS: [
    { value: 'before-holiday', label: 'Day before holiday' },
    { value: 'after-holiday', label: 'Day after holiday' },
  ],

  REPEAT_TYPES: [
    { value: 'C', label: 'Continuous (C)' },
    { value: 'S', label: 'Single (S)' },
    { value: 'E', label: 'End-of-day (E)' },
  ],

  SCHEDULE_TYPES: [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'custom', label: 'Custom' },
  ],

  FREQUENCY_TYPES: [
    { value: 'daily', label: 'Every Day' },
    { value: 'weekdays', label: 'Weekdays Only' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ],

  PREDECESSOR_CONDITIONS: [
    { value: 'SUCCESS', label: 'Success' },
    { value: 'FAILURE', label: 'Failure' },
    { value: 'COMPLETE', label: 'Complete' },
  ],

  RESOURCE_TYPES: [
    { value: 'CPU', label: 'CPU Resource' },
    { value: 'MEMORY', label: 'Memory Resource' },
    { value: 'DISK', label: 'Disk Resource' },
    { value: 'NETWORK', label: 'Network Resource' },
    { value: 'DATABASE', label: 'Database Resource' },
    { value: 'FILE', label: 'File Resource' },
  ],

  PRIORITY_LEVELS: [
    { value: '1', label: '1 (Highest)' },
    { value: '2', label: '2 (High)' },
    { value: '3', label: '3 (Medium-High)' },
    { value: '4', label: '4 (Medium)' },
    { value: '5', label: '5 (Medium-Low)' },
    { value: '6', label: '6 (Low)' },
    { value: '7', label: '7 (Lower)' },
    { value: '8', label: '8 (Very Low)' },
    { value: '9', label: '9 (Lowest)' },
    { value: '10', label: '10 (Background)' },
  ],
};

// Schedule Frequency Form specific options
export const SCHEDULE_FREQUENCY_OPTIONS = {
  JOB_ON_REQUEST: [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' },
  ],
  
  SCHEDULE_TYPE: [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'custom', label: 'Custom' },
  ],
  
  FREQUENCY: [
    { value: 'daily', label: 'Every Day' },
    { value: 'weekdays', label: 'Weekdays Only' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ],
  
  DAYS_OF_WEEK: [
    { value: 'Monday', label: 'Monday' },
    { value: 'Tuesday', label: 'Tuesday' },
    { value: 'Wednesday', label: 'Wednesday' },
    { value: 'Thursday', label: 'Thursday' },
    { value: 'Friday', label: 'Friday' },
    { value: 'Saturday', label: 'Saturday' },
    { value: 'Sunday', label: 'Sunday' },
  ],
  
  TRIGGER_CONDITIONS: [
    { value: 'SUCCESS', label: 'Success' },
    { value: 'FAILURE', label: 'Failure' },
    { value: 'COMPLETE', label: 'Complete' },
  ],
  
  RESOURCE_TYPES: [
    { value: 'CPU', label: 'CPU Resource' },
    { value: 'MEMORY', label: 'Memory Resource' },
    { value: 'DISK', label: 'Disk Resource' },
    { value: 'NETWORK', label: 'Network Resource' },
    { value: 'DATABASE', label: 'Database Resource' },
    { value: 'FILE', label: 'File Resource' },
  ],
};

// DEFAULT VALUES (from old project)
export const DEFAULT_VALUES = {
  UID: '255',
  JCL_LIBRARY_FORM: 'PROD.NBSP.PROD.JCLLIB',
  JCL_LIBRARY_WIZARD: 'NBSP.NBS.JCLLIB',
  FUTURE_SCHEDULED: 'No',
  IS_JOB_ON_REQUEST: 'No',
  NDM_TRANSMISSION: false,
};

// TIME GENERATION UTILITIES (from old project)
export const generateTimeOptions = () => {
  const hours = Array.from({ length: 24 }, (_, i) => ({
    value: i.toString().padStart(2, '0'),
    label: i.toString().padStart(2, '0')
  }));
  
  const minutes = Array.from({ length: 60 }, (_, i) => ({
    value: i.toString().padStart(2, '0'),
    label: i.toString().padStart(2, '0')
  }));
  
  return { hours, minutes };
};

// DATASET NAME GENERATION (from old project logic)
export const generateDatasetName = (
  jobName: string, 
  isNdmTransmission: boolean, 
  ndmSourceNode?: string
): string => {
  if (!jobName) return '';
  
  const baseDataset = `${jobName}.PROC1`;
  
  if (isNdmTransmission && ndmSourceNode) {
    return `${baseDataset}.${ndmSourceNode}`.toUpperCase();
  }
  
  return baseDataset.toUpperCase();
};

// VALIDATION HELPER FUNCTIONS
export const validationHelpers = {
  // Check if date is in the future
  isFutureDate: (dateString: string): boolean => {
    if (!dateString) return false;
    const selectedDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  },
  
  // Check if time1 is after time2
  isTimeAfter: (hour1: string, minute1: string, hour2: string, minute2: string): boolean => {
    if (!hour1 || !minute1 || !hour2 || !minute2) return false;
    const time1 = parseInt(hour1) * 60 + parseInt(minute1);
    const time2 = parseInt(hour2) * 60 + parseInt(minute2);
    return time1 > time2;
  },
  
  // Check minimum interval (15 minutes)
  isMinimumInterval: (hours: string, minutes: string): boolean => {
    if (!hours || !minutes) return false;
    const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
    return totalMinutes >= 15;
  },
  
  // Validate dataset segment
  validateDatasetSegment: (segment: string, index: number) => {
    const errors = [];
    
    if (!segment || segment.trim() === '') {
      errors.push(`Segment ${index + 1} cannot be empty`);
      return errors;
    }
    
    if (segment.length > 8) {
      errors.push(`Segment '${segment}' cannot be longer than 8 characters`);
    }
    
    if (!VALIDATION_PATTERNS.DATASET_FIRST_CHAR.test(segment[0])) {
      errors.push(`First character of segment '${segment}' must be a letter or #, @, $`);
    }
    
    if (!VALIDATION_PATTERNS.DATASET_REMAINING_CHARS.test(segment)) {
      errors.push(`Invalid characters in segment '${segment}'. Only letters, numbers, #, @, $ are allowed`);
    }
    
    return errors;
  },
};

// PROGRESSIVE DISCLOSURE HELPERS
export const progressiveDisclosure = {
  // Check if primary fields are valid for job definition
  arePrimaryFieldsValid: (jobName: string, region: string, lpar: string): boolean => {
    return Boolean(
      jobName && VALIDATION_PATTERNS.JOB_NAME.test(jobName) &&
      region && VALIDATION_PATTERNS.REGION.test(region) &&
      lpar && VALIDATION_PATTERNS.LPAR.test(lpar)
    );
  },
  
  // Check if EMEA region requires callout priority
  requiresCalloutPriority: (region: string): boolean => {
    return region === 'EMEA';
  },
  
  // Check if future scheduling fields are needed
  requiresFutureScheduling: (isFutureScheduled: string): boolean => {
    return isFutureScheduled === 'Yes';
  },
  
  // Check if NDM fields are needed
  requiresNdmFields: (isNdmTransmission: boolean): boolean => {
    return isNdmTransmission === true;
  },

  // Check if schedule requires interval configuration
  requiresIntervals: (frequency: string): boolean => {
    return ['Daily', 'Weekly'].includes(frequency);
  },

  // Check if holiday configuration is needed
  requiresHolidayConfig: (frequency: string): boolean => {
    return frequency && frequency.toLowerCase().includes('holiday');
  },

  // Validate business hours constraint
  isWithinBusinessHours: (hour: string, minute: string): boolean => {
    const time = parseInt(hour) * 60 + parseInt(minute);
    const businessStart = 9 * 60; // 9:00 AM
    const businessEnd = 17 * 60; // 5:00 PM
    return time >= businessStart && time <= businessEnd;
  },

  // Check for weekend scheduling
  isWeekendSchedule: (frequency: string, days: string[]): boolean => {
    if (frequency !== 'Weekly') return false;
    return days.some(day => ['Saturday', 'Sunday'].includes(day));
  },

  // Advanced business rule validations
  isInMaintenanceWindow: (hour: string, minute: string): boolean => {
    const time = parseInt(hour) * 60 + parseInt(minute);
    const maintenanceStart = 2 * 60; // 02:00
    const maintenanceEnd = 4 * 60;   // 04:00
    return time >= maintenanceStart && time < maintenanceEnd;
  },

  isInBlackoutPeriod: (date: string): boolean => {
    // Example: Month-end processing blackout (last 3 days of month)
    const selectedDate = new Date(date);
    const lastDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
    const daysFromEnd = lastDayOfMonth.getDate() - selectedDate.getDate();
    return daysFromEnd < 3;
  },

  hasResourceContention: (startTime: string, region: string, priority: number): boolean => {
    // Simulate resource contention check during peak hours for high-priority jobs
    const hour = parseInt(startTime.split(':')[0]);
    const isPeakHour = hour >= 9 && hour <= 17;
    const isHighPriority = priority <= 3;
    return isPeakHour && !isHighPriority && region === 'AMRS';
  },

  validateJobChain: (predecessors: any[]): boolean => {
    // Basic circular dependency check
    const jobNames = predecessors.map(p => p.jobName);
    const uniqueNames = new Set(jobNames);
    return jobNames.length === uniqueNames.size;
  },

  isValidTimeZone: (region: string, time: string): boolean => {
    // Basic timezone validation - can be enhanced with actual timezone logic
    const hour = parseInt(time.split(':')[0]);
    if (region === 'EMEA' && (hour < 6 || hour > 22)) return false;
    if (region === 'AMRS' && (hour < 4 || hour > 23)) return false;
    return true;
  },

  calculateScheduleConflicts: (
    newSchedule: { startTime: string; frequency: string; days?: string[] },
    existingSchedules: any[]
  ): number => {
    // Simple conflict detection - returns number of conflicts
    let conflicts = 0;
    existingSchedules.forEach(existing => {
      if (existing.startTime === newSchedule.startTime) {
        if (newSchedule.frequency === 'daily' || existing.frequency === 'daily') {
          conflicts++;
        } else if (newSchedule.frequency === 'weekly' && existing.frequency === 'weekly') {
          const newDays = newSchedule.days || [];
          const existingDays = existing.days || [];
          const overlap = newDays.some(day => existingDays.includes(day));
          if (overlap) conflicts++;
        }
      }
    });
    return conflicts;
  },

  validateResourceAllocation: (resources: any[], maxConcurrent: number = 10): boolean => {
    const totalAllocation = resources.reduce((sum, resource) => {
      return sum + (resource.allocation || 0);
    }, 0);
    return totalAllocation <= 100 && resources.length <= maxConcurrent;
  },

  isComplianceRequired: (jobName: string, region: string): boolean => {
    // Check if job requires compliance based on naming patterns or region
    const compliancePatterns = [/^AUDIT/, /^REPORT/, /^COMPLIANCE/];
    const requiresCompliance = compliancePatterns.some(pattern => pattern.test(jobName));
    const complianceRegions = ['EMEA', 'APAC'];
    return requiresCompliance || complianceRegions.includes(region);
  },

  validateDataClassification: (datasetName: string, securityLevel: string): boolean => {
    // Basic data classification validation
    const sensitivePatterns = [/\.SENSITIVE\./, /\.CONFIDENTIAL\./, /\.SECRET\./];
    const hasSensitiveData = sensitivePatterns.some(pattern => pattern.test(datasetName));
    if (hasSensitiveData && securityLevel !== 'HIGH') return false;
    return true;
  }
};
