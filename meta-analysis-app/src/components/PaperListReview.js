import React, { useState, useEffect } from 'react';
import { FileDown, Eye, Check, Database, ExternalLink, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function PaperListReview() {
  const [selectedPapers, setSelectedPapers] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [papers, setPapers] = useState([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [picoData, setPicoData] = useState(null); // start with null so that we control when fetch runs
  const papersPerPage = 10;
  const semanticScholarSearchBaseURL = "https://meta-analysis-backend-effzbjd8aff4gjbs.eastus2-01.azurewebsites.net/api/papers";

  // Only use the API data – remove any dummy paper generation code
  // For planning, we set picoData once.
  useEffect(() => {
    setPicoData({
      pop: "students,k-12 students",
      inter: "Intelligent Tutoring Systems",
      comp: "Intelligent Tutoring Systems",
      outcome: "post-test,exam results",
      year: "",
      add_keywords: ""
    });
  }, []);

  useEffect(() => {
    if (!picoData) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          pop: picoData.pop,
          inter: picoData.inter,
          comp: picoData.comp,
          outcome: picoData.outcome,
          ...(picoData.add_keywords?.length ? { add_keywords: picoData.add_keywords.join(",") } : {}),
          ...(picoData.year ? { year: picoData.year } : {}),
        });
        const api_url = `${semanticScholarSearchBaseURL}?${queryParams.toString()}`;
        const response = await fetch(api_url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const semanticScholarData = await response.json();
        // Replace any existing papers with the API response
        setPapers(semanticScholarData.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [picoData]);

  // IMPORTANT: Make sure no other code is generating or merging extra papers

  // If you need to sort based on a field (and change the order), do it explicitly;
  // if not, leave the order as returned by the API.
  const sortedPapers = React.useMemo(() => {
    // Only sort if the user explicitly selects a sort method. Otherwise, return as-is.
    if (sortBy === 'year') {
      return [...papers].sort((a, b) => a.year - b.year);
    } else if (sortBy === 'citations') {
      // Assuming you add a citations field later; otherwise, skip
      return [...papers].sort((a, b) => (a.citations || 0) - (b.citations || 0));
    }
    // For 'relevance' or default, return in the same order as received.
    return papers;
  }, [papers, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(sortedPapers.length / papersPerPage);
  const currentPapers = sortedPapers.slice(
    (currentPage - 1) * papersPerPage,
    currentPage * papersPerPage
  );

  const handleClearSelection = () => {
    setSelectedPapers(new Set());
  };

  const handleSelectAllOnPage = () => {
    const newSelected = new Set(selectedPapers);
    currentPapers.forEach(paper => newSelected.add(paper.paperId));
    setSelectedPapers(newSelected);
  };

  const handleViewPaper = (e, paper) => {
    e.stopPropagation();
    window.open(paper.url, '_blank');
  };

  const handleDownloadPaper = (e, paper) => {
    e.stopPropagation();
    if (paper.openAccessPdf) {
      window.open(paper.openAccessPdf, '_blank');
    }
  };

  const getTruncatedAbstract = (abstract) => {
    if (!abstract) return "Missing Abstract";
    return abstract.length > 200 ? abstract.slice(0, 200) + "..." : abstract;
  };

  const PaginationControls = () => (
    <div className="flex items-center justify-between bg-white px-4 py-3 sm:px-6 rounded-lg shadow-sm border">
      <div className="flex flex-1 items-center justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing{' '}
            <span className="font-medium">{((currentPage - 1) * papersPerPage) + 1}</span>
            {' '}-{' '}
            <span className="font-medium">
              {Math.min(currentPage * papersPerPage, sortedPapers.length)}
            </span>
            {' '}of{' '}
            <span className="font-medium">{sortedPapers.length}</span>
            {' '}papers
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <button 
        onClick={() => navigate('/education-analysis-setup')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Educational Analysis
      </button>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Review Selected Papers</h1>
        <p className="text-gray-600">
          Review and confirm papers for your meta-analysis
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex space-x-8">
            <div>
              <span className="text-sm text-gray-500">Total Papers</span>
              <p className="text-lg font-semibold">{sortedPapers.length}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Selected</span>
              <p className="text-lg font-semibold text-blue-600">
                {selectedPapers.size}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select 
              className="border rounded-lg px-3 py-2 text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="relevance">Sort by Relevance</option>
              <option value="year">Sort by Year</option>
              <option value="citations">Sort by Citations</option>
            </select>
            
            <button 
              onClick={handleSelectAllOnPage}
              className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
            >
              Select All on Page
            </button>
            <button 
              onClick={handleClearSelection}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                selectedPapers.size > 0 
                  ? 'bg-gray-50 text-gray-600 hover:bg-gray-100 cursor-pointer' 
                  : 'bg-gray-50 text-gray-400 cursor-not-allowed'
              }`}
              disabled={selectedPapers.size === 0}
            >
              Clear Selection
            </button>
          </div>
        </div>
      </div>

      {/* Papers List */}
      <div className="space-y-4 mb-6">
        {loading ? (
          <p>Loading...</p>
        ) : currentPapers.map((paper) => (
          <div 
            key={paper.paperId}
            className={`bg-white rounded-lg shadow-sm border p-6 ${
              selectedPapers.has(paper.paperId)
                ? 'border-blue-500 bg-blue-50'
                : 'hover:border-gray-300'
            } transition-colors cursor-pointer`}
            onClick={() => {
              const newSelected = new Set(selectedPapers);
              if (newSelected.has(paper.paperId)) {
                newSelected.delete(paper.paperId);
              } else {
                newSelected.add(paper.paperId);
              }
              setSelectedPapers(newSelected);
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg">{paper.title || "Missing Title"}</h3>
                  <div className="flex items-center space-x-2 ml-4">
                    { /* If you have info on whether the paper is already in your database */ }
                    { /* For now, we check against a dummy set if needed */ }
                    {/* {paperDatabase.has(paper.paperId) && (
                      <span className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded text-xs">
                        <Database className="w-3 h-3 mr-1" />
                        In Database
                      </span>
                    )} */}
                  </div>
                </div>
                <div className="flex flex-wrap items-center space-x-4 text-sm text-gray-500 mb-2">
                  <span>
                    {paper.authors 
                      ? paper.authors.map(author => author.name).join(", ")
                      : "Missing Authors"}
                  </span>
                  <span>•</span>
                  <span>{paper.year || "Missing Year"}</span>
                  <span>•</span>
                  <span>
                    {paper.journal && paper.journal.name 
                      ? paper.journal.name 
                      : "Missing Journal"}
                  </span>
                  {paper.journal && paper.journal.pages && (
                    <>
                      <span>•</span>
                      <span>Pages: {paper.journal.pages}</span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {getTruncatedAbstract(paper.abstract)}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {/* Additional metadata can be added here if needed */}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => handleViewPaper(e, paper)}
                      className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </button>
                    {paper.openAccessPdf ? (
                      <button
                        onClick={(e) => handleDownloadPaper(e, paper)}
                        className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                      >
                        <FileDown className="w-4 h-4 mr-1" />
                        Download PDF
                      </button>
                    ) : (
                      <button
                        className="flex items-center px-3 py-1 text-sm text-gray-400 cursor-not-allowed"
                        disabled
                      >
                        <FileDown className="w-4 h-4 mr-1" />
                        No PDF Available
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="ml-4">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedPapers.has(paper.paperId)
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {selectedPapers.has(paper.paperId) && (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mb-6">
        <PaginationControls />
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate('/education-analysis-setup')}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Back to Search
        </button>
        <button 
          className={`px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 ${
            selectedPapers.size > 0
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          disabled={selectedPapers.size === 0}
          onClick={() => {
            console.log('Navigate to selection criteria with papers:', selectedPapers);
            navigate('/paperpool-overview');
          }}
        >
          <span>Review Paper Pool</span>
          <span>({selectedPapers.size} papers)</span>
        </button>
      </div>
    </div>
  );
}

export default PaperListReview;
