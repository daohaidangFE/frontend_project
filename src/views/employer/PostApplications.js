import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Components
import CardCandidateTable from "components/Cards/CardCandidateTable.js";

// Services
import applyingService from "services/applyingService"; 

export default function PostApplications() {
  const { postId } = useParams();
  const [candidates, setCandidates] = useState([]);
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    totalPages: 0,
    totalElements: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchCandidates = async (page = 0) => {
    setIsLoading(true);
    try {
      const res = await applyingService.getApplicationsByJobId(postId, page, 10); 
      
      const responseData = res.data?.data || res.data?.result || res.data;

      if (responseData) {
        setCandidates(responseData.content || []);
        setPagination({
            pageNumber: responseData.pageable?.pageNumber || 0,
            totalPages: responseData.totalPages || 0,
            totalElements: responseData.totalElements || 0
        });
      }
    } catch (error) {
      console.error("Failed to load candidates", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (postId) {
      fetchCandidates(0);
    }
  }, [postId]);

  const handlePageChange = (newPage) => {
      fetchCandidates(newPage);
  }

  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <CardCandidateTable 
            candidates={candidates} 
            pagination={pagination}
            onPageChange={handlePageChange}
            isLoading={isLoading}
            color="light"
          />
        </div>
      </div>
    </>
  );
}