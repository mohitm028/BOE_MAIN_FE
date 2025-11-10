import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Controller } from "react-hook-form";
export const DailyFrequency = ({control }: any) => (
 <Controller
            name="runDays"
            control={control}
            defaultValue= {{
                runDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
                }}
render={({ field }) => (
    <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
            <label className="text-sm font-medium text-gray-700">Expected run days of the week:</label>
            <HelpOutlineIcon
                sx={{ fontSize: 16, color: '#9ca3af', cursor: 'help' }}
                titleAccess="Expected Run Days: Specific days of the week on which to run the job"
            />
        </div>
        <div className="px-4 py-3 bg-gray-100 border border-gray-300 rounded-md">
            <span className="text-sm text-gray-700">Sunday to Saturday</span>
        </div>
    </div>
    )}
        />
);