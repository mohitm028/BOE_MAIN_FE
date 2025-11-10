import { dummyRequestV2List } from '@/components/data/requestsv2';
import { JobRequestData } from '@/components/request/RequestTypes';
import { UserContext } from '@/contexts/UserContext';
import { useContext, useEffect, useState } from 'react';
import { AllJobFlowService } from './service/AllJobService';

const AllJobListPage = () => {
    const userState = useContext(UserContext); // Access user role from context
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        jobId: '',
        jobName: '',
        status: '',
        requestType: '',
    });
    const [filteredData, setFilteredData] = useState(dummyRequestV2List);
    const [originalData, setOriginalData] = useState(dummyRequestV2List);
    const [selectedRequests, setSelectedRequests] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response =
                    await AllJobFlowService.COMMON_API.getAllJobRequest();
                setFilteredData(response.jobDefinitions);
                setOriginalData(response.jobDefinitions);
            } catch (err: any) {
                console.log('Error fetching job requests', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();

        // const timer = setTimeout(() => {
        //     JobRequestService.sendToManager(7).then((response: any) => {
        //         console.log(response);
        //     });

        //     setLoading(false);
        // }, 1000);
        // return () => clearTimeout(timer);
    }, []);

    const getFilteredData = () => {
        return dummyRequestV2List.filter((row: JobRequestData) => {
            const matchesJobId =
                !filters.jobId ||
                row.requestInfo.requestNumber
                    .toUpperCase()
                    .includes(filters.jobId.toUpperCase());
            const matchesJobName =
                !filters.jobName ||
                row.JobName?.toUpperCase().includes(
                    filters.jobName.toUpperCase()
                );
            const matchesStatus =
                !filters.status ||
                row.requestInfo.requestStatus === filters.status;
            const matchesRequestType =
                !filters.requestType ||
                row.requestInfo.requestType === filters.requestType;
            return (
                matchesJobId &&
                matchesJobName &&
                matchesStatus &&
                matchesRequestType
            );
        });
    };

    useEffect(() => {
        setFilteredData(getFilteredData());
    }, [filters]);

    const handleFilterChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };
    const handleSelectRow = (requestName: string) => {
        setSelectedRequests((prev) =>
            prev.includes(requestName)
                ? prev.filter((name) => name !== requestName)
                : [...prev, requestName]
        );
    };
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedRequests(
                filteredData.map((row) => row.requestInfo.requestorName)
            );
        } else {
            setSelectedRequests([]);
        }
    };

    const handleBulkApprove = () => {
        // Implement bulk approve logic here
        console.log('Bulk approved requests:', selectedRequests);
        alert(`Bulk approved requests: ${selectedRequests.join(',')}`);
    };

    if (loading) {
        return (
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">
                    Requests in the system
                </h1>
                <div className="flex justify-center items-center h-64">
                    <div className="flex flex-col items-center">
                        <svg
                            className="animate-spin h-8 w-8 text-gray-500 mb-2"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 081-8v4a4 4 0 00-4 4H4z"
                            ></path>
                        </svg>
                        <div>Fetching data..</div>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Requests in the system</h1>
            <div className="mb-4 flex flex-wrap gap-4">
                <div className="flex flex-col">
                    <label htmlFor="jobId" className="text-sm font-medium mb-1">
                        Request ID
                    </label>
                    <input
                        type="text"
                        id="jobId"
                        name="jobId"
                        placeholder="Search by Request ID"
                        value={filters.jobId.toUpperCase()}
                        onChange={handleFilterChange}
                        className="border border-gray-300 px-2 py-1 rounded"
                    />
                </div>
                <div className="flex flex-col">
                    <label
                        htmlFor="jobName"
                        className="text-sm font-medium mb-1"
                    >
                        Job Name
                    </label>
                    <input
                        type="text"
                        id="jobName"
                        name="jobName"
                        placeholder="Search by Job Name"
                        value={filters.jobName.toUpperCase()}
                        onChange={handleFilterChange}
                        className="border border-gray-300 px-2 py-1 rounded"
                    />
                </div>
                <div className="flex flex-col">
                    <label
                        htmlFor="status"
                        className="text-sm font-medium mb-1"
                    >
                        Status
                    </label>
                    <select
                        id="status"
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        className="border border-gray-300 px-2 py-1 rounded"
                    >
                        <option value="">Select</option>
                        <option value="SUBMITTED">SUBMITTED</option>
                        <option value="IMPLEMENTED">IMPLEMENTED</option>
                        <option value="INSTALL_SCHEDULE">
                            INSTALL_SCHEDUL
                        </option>
                        <option value="DRAFT">DRAFT</option>
                    </select>
                </div>
                <div className="flex flex-col">
                    <label
                        htmlFor="requestType"
                        className="text-sm font-medium mb-1"
                    >
                        Request Type
                    </label>
                    <select
                        id="requestType"
                        name="requestType"
                        value={filters.requestType}
                        onChange={handleFilterChange}
                        className="border border-gray-300 px-2 py-1 rounded"
                    >
                        <option value="">Select</option>
                        <option value="ADD">ADD</option>
                        <option value="MODIFY">MODIFY</option>
                        <option value="DELETE">DELETE</option>
                    </select>
                </div>
            </div>
            {userState?.user?.role === 'MANAGER' && (
                <div className="mb-4">
                    <button
                        onClick={handleBulkApprove}
                        disabled={selectedRequests.length === 0}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Bulk Approve
                    </button>
                </div>
            )}
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            {userState?.user?.role === 'MANAGER' && (
                                <th className="border border-gray-300 ">
                                    <input
                                        type="checkbox"
                                        onChange={handleSelectAll}
                                        checked={
                                            selectedRequests.length ===
                                                filteredData.length &&
                                            filteredData.length > 0
                                        }
                                    />
                                </th>
                            )}
                            {[
                                'Request ID',
                                'Job Name',
                                'Status',
                                'Request Type',
                                'Install Date',
                                'Created On',
                                'Assignee Name',
                                'Requester Name',
                            ].map((header, index) => (
                                <th
                                    key={index}
                                    className="border border-gray-300 px-4 py-2 text-left"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((row, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                {userState?.user?.role === 'MANAGER' && (
                                    <td className="border border-gray-300">
                                        <input
                                            type="checkbox"
                                            checked={selectedRequests.includes(
                                                row.requestInfo.requestNumber
                                            )}
                                            onChange={() =>
                                                handleSelectRow(
                                                    row.requestInfo
                                                        .requestNumber
                                                )
                                            }
                                        />
                                    </td>
                                )}
                                <td className="px-4 py-2 border border-gray-300 text-blue-500 underline">
                                    <a
                                        href={`job-request/${row.id}/${row.requestInfo.requestNumber}`}
                                    >
                                        {row.requestInfo.requestNumber}
                                    </a>
                                </td>
                                <td className="px-4 py-2 border border-gray-300">
                                    {row.JobName || ''}
                                </td>
                                <td className="px-4 py-2 border border-gray-300">
                                    {row.requestInfo.requestStatus}
                                </td>
                                <td className="px-4 py-2 border border-gray-300">
                                    {row.requestInfo.requestType || 'N/A'}
                                </td>
                                <td className="px-4 py-2 border border-gray-300">
                                    {row.requestInfo.installDate || 'N/A'}
                                </td>
                                <td className="px-4 py-2 border border-gray-300">
                                    {row.requestInfo.installDate}
                                </td>
                                <td className="px-4 py-2 border border-gray-300">
                                    {row.jclLibrary || 'Unassigned'}
                                </td>
                                <td className="px-4 py-2 border border-gray-300">
                                    {row.requestInfo.requestorName || 'N/A'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default AllJobListPage;
