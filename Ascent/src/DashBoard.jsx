import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FaPlus, FaTrash, FaBriefcase, FaBuilding, FaUserTie, FaTimes, FaEllipsisV, FaFilter, FaSearch } from "react-icons/fa";
import { HiDocumentText } from "react-icons/hi";
import { toast } from 'react-toastify';
import { jobsAPI } from './services/api';

export default function DashBoard() {
  const [showModal, setShowModal] = useState(false);
  const [jobData, setJobData] = useState({ title: "", company: "", role: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [allColumns, setAllColumns] = useState({});
  
  // Define default column structure
  const defaultColumns = {
    wishlist: { name: "Wishlist", color: "bg-blue-100", textColor: "text-blue-800", items: [] },
    applied: { name: "Applied", color: "bg-yellow-100", textColor: "text-yellow-800", items: [] },
    onlineAssessment: { name: "Online Assessment", color: "bg-purple-100", textColor: "text-purple-800", items: [] },
    interview: { name: "Interview", color: "bg-orange-100", textColor: "text-orange-800", items: [] },
    selected: { name: "Selected", color: "bg-green-100", textColor: "text-green-800", items: [] },
    rejected: { name: "Rejected", color: "bg-red-100", textColor: "text-red-800", items: [] },
  };
  
  const [columns, setColumns] = useState(defaultColumns);

  // Load jobs on component mount
  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const apiData = await jobsAPI.getAll();
      
      // Store the original columns data for filtering
      const mergedColumns = {
        wishlist: { ...defaultColumns.wishlist, items: apiData.wishlist?.items || [] },
        applied: { ...defaultColumns.applied, items: apiData.applied?.items || [] },
        onlineAssessment: { ...defaultColumns.onlineAssessment, items: apiData.onlineAssessment?.items || [] },
        interview: { ...defaultColumns.interview, items: apiData.interview?.items || [] },
        selected: { ...defaultColumns.selected, items: apiData.selected?.items || [] },
        rejected: { ...defaultColumns.rejected, items: apiData.rejected?.items || [] },
      };
      
      setAllColumns(mergedColumns);
      setColumns(mergedColumns);
    } catch (error) {
      console.error("Failed to load jobs:", error);
      toast.error("Failed to load jobs. Please refresh the page.");
    }
  };

  // Apply search and filter whenever searchTerm or filterStatus changes
  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterStatus, allColumns]);

  const applyFilters = () => {
    if (!allColumns || Object.keys(allColumns).length === 0) return;

    let filteredColumns = { ...allColumns };

    // Apply search filter if search term exists
    if (searchTerm.trim() !== "") {
      Object.keys(filteredColumns).forEach(columnId => {
        filteredColumns[columnId].items = filteredColumns[columnId].items.filter(item =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.role && item.role.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      });
    }

    // Apply status filter if not "all"
    if (filterStatus !== "all") {
      Object.keys(filteredColumns).forEach(columnId => {
        if (columnId !== filterStatus) {
          filteredColumns[columnId].items = [];
        }
      });
    }

    setColumns(filteredColumns);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const originalColumns = { ...columns };
    
    try {
      if (source.droppableId === destination.droppableId) {
        // Reordering within the same column
        const column = columns[source.droppableId];
        const copiedItems = [...column.items];
        const [removed] = copiedItems.splice(source.index, 1);
        copiedItems.splice(destination.index, 0, removed);
        
        // Update UI optimistically
        const updatedColumns = {
          ...columns,
          [source.droppableId]: { ...column, items: copiedItems },
        };
        
        setColumns(updatedColumns);
        setAllColumns(updatedColumns);
        
        // Make API call to update order in backend
        await jobsAPI.reorder(source.droppableId, copiedItems);
        toast.success("Jobs reordered successfully");
      } else {
        // Moving between columns
        const sourceColumn = columns[source.droppableId];
        const destColumn = columns[destination.droppableId];
        const sourceItems = [...sourceColumn.items];
        const destItems = [...destColumn.items];
        const [removed] = sourceItems.splice(source.index, 1);
        destItems.splice(destination.index, 0, removed);
        
        // Update UI optimistically
        const updatedColumns = {
          ...columns,
          [source.droppableId]: { ...sourceColumn, items: sourceItems },
          [destination.droppableId]: { ...destColumn, items: destItems },
        };
        
        setColumns(updatedColumns);
        setAllColumns(updatedColumns);
        
        // Make API call to update job status in backend
        await jobsAPI.updateStatus(removed.id, destination.droppableId);
        toast.success(`Job moved to ${columns[destination.droppableId].name}`);
      }
    } catch (error) {
      console.error("Failed to update job:", error);
      // Revert to original state if API call fails
      setColumns(originalColumns);
      setAllColumns(originalColumns);
      toast.error("Failed to update job. Please try again.");
    }
  };

  const handleAddJob = async () => {
    if (!jobData.title.trim() || !jobData.company.trim()) {
      toast.error("Title and company are required");
      return;
    }

    setIsLoading(true);
    
    try {
      const newJob = await jobsAPI.create(jobData);
      
      // Update both filtered view and all columns
      const updatedColumns = {
        ...columns,
        wishlist: {
          ...columns.wishlist,
          items: [...columns.wishlist.items, newJob],
        },
      };

      const updatedAllColumns = {
        ...allColumns,
        wishlist: {
          ...allColumns.wishlist,
          items: [...allColumns.wishlist.items, newJob],
        },
      };

      setColumns(updatedColumns);
      setAllColumns(updatedAllColumns);

      setJobData({ title: "", company: "", role: "" });
      setShowModal(false);
      toast.success("Job added successfully");
    } catch (error) {
      console.error("Failed to add job:", error);
      toast.error("Failed to add job. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteJob = async (columnId, jobId) => {
    const originalColumns = { ...columns };
    const originalAllColumns = { ...allColumns };
    
    try {
      // Optimistically update UI for both filtered and all columns
      const updatedColumns = { ...columns };
      updatedColumns[columnId].items = updatedColumns[columnId].items.filter(item => item.id !== jobId);
      
      const updatedAllColumns = { ...allColumns };
      updatedAllColumns[columnId].items = updatedAllColumns[columnId].items.filter(item => item.id !== jobId);

      setColumns(updatedColumns);
      setAllColumns(updatedAllColumns);
      
      // Make API call to delete job
      await jobsAPI.delete(jobId);
      toast.success("Job deleted successfully");
    } catch (error) {
      console.error("Failed to delete job:", error);
      // Revert to original state if API call fails
      setColumns(originalColumns);
      setAllColumns(originalAllColumns);
      toast.error("Failed to delete job. Please try again.");
    }
  };

  // Calculate total jobs from all columns (not filtered)
  const totalJobs = allColumns ? Object.values(allColumns).reduce((total, column) => total + column.items.length, 0) : 0;

  // Calculate visible jobs from filtered columns
  const visibleJobs = columns ? Object.values(columns).reduce((total, column) => total + column.items.length, 0) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      {/* Top Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sticky top-0 bg-white z-30 p-6 rounded-2xl shadow-sm mb-6 border border-gray-100">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl mr-4 shadow-md">
            <HiDocumentText className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Job Tracker Board</h1>
            <p className="text-sm text-gray-500">
              {visibleJobs} of {totalJobs} jobs shown
              {(searchTerm || filterStatus !== "all") && (
                <button
                  onClick={clearFilters}
                  className="ml-2 text-blue-600 hover:text-blue-800 text-xs underline"
                >
                  Clear filters
                </button>
              )}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          {/* Search Bar */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
          </div>
          
          {/* Filter Dropdown */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-4 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none w-full"
            >
              <option value="all">All Status</option>
              {allColumns && Object.entries(allColumns).map(([key, column]) => (
                <option key={key} value={key}>{column.name}</option>
              ))}
            </select>
            <FaFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          
          {/* Add Job Button */}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2.5 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-md whitespace-nowrap"
          >
            <FaPlus className="h-4 w-4 mr-2" />
            Add Job
          </button>
        </div>
      </div>

      {/* Drag & Drop Columns */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 pb-4 relative z-10">
          {columns && Object.entries(columns).map(([columnId, column]) => (
            <div
              key={columnId}
              className="bg-white rounded-2xl shadow-sm flex flex-col border border-gray-100 hover:shadow-md transition-shadow"
            >
              {/* Column header */}
              <div className={`flex items-center justify-between p-4 rounded-t-2xl ${column.color}`}>
                <div>
                  <h2 className={`font-semibold text-sm ${column.textColor} uppercase tracking-wide`}>
                    {column.name}
                  </h2>
                  <p className={`text-xs ${column.textColor} opacity-70`}>{column.items.length} jobs</p>
                </div>
              </div>
              
              <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 p-3 space-y-3 min-h-[200px] transition-colors ${
                      snapshot.isDraggingOver ? "bg-blue-50" : "bg-gray-50"
                    }`}
                  >
                    {column.items.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-4 rounded-xl cursor-grab border border-gray-100 relative group backdrop-blur-sm ${
                              snapshot.isDragging
                                ? "bg-gradient-to-r from-blue-100 to-purple-100 rotate-2 shadow-lg z-50"
                                : "bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
                            } transition-all duration-200 shadow-sm hover:shadow-md`}
                          >
                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteJob(columnId, item.id)}
                              className="absolute top-3 right-3 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-200"
                              aria-label="Delete job"
                            >
                              <FaTrash className="h-3.5 w-3.5" />
                            </button>
                            
                            <div className="pr-6">
                              <p className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2">{item.title}</p>
                              <div className="flex items-center mb-2">
                                <FaBuilding className="h-3.5 w-3.5 text-gray-400 mr-2 flex-shrink-0" />
                                <p className="text-xs text-gray-600 truncate">{item.company}</p>
                              </div>
                              {item.role && (
                                <div className="flex items-center">
                                  <FaUserTie className="h-3 w-3 text-gray-400 mr-2 flex-shrink-0" />
                                  <p className="text-xs text-gray-500 truncate">{item.role}</p>
                                </div>
                              )}
                            </div>
                            
                            {/* Status Badge */}
                            <div className="absolute bottom-2 right-2">
                              <span className={`text-[10px] px-2 py-1 rounded-full ${column.textColor} ${column.color} opacity-80`}>
                                {column.name}
                              </span>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {column.items.length === 0 && (
                      <div className="text-center py-8 text-gray-300">
                        <HiDocumentText className="h-10 w-10 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">
                          {searchTerm || filterStatus !== "all" ? "No matching jobs" : "No jobs yet"}
                        </p>
                        <p className="text-xs mt-1">
                          {searchTerm || filterStatus !== "all" ? "Try different search terms" : "Drag jobs here or add new ones"}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Add Job Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Add New Job</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaBriefcase className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="e.g. Frontend Developer"
                    value={jobData.title}
                    onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaBuilding className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="e.g. Google"
                    value={jobData.company}
                    onChange={(e) => setJobData({ ...jobData, company: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role (Optional)
                </label>
                <div className="relative">
                  <FaUserTie className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="e.g. React Developer"
                    value={jobData.role}
                    onChange={(e) => setJobData({ ...jobData, role: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddJob}
                disabled={isLoading}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-medium shadow-md"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Adding...
                  </div>
                ) : (
                  "Add Job"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}