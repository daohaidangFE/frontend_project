import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

// Components
import CardCandidateTable from "components/Cards/CardCandidateTable.js";

// Services
import applyingService from "services/applyingService"; 

export default function PostApplications() {
  const { postId } = useParams();
  const { t } = useTranslation();
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
      toast.error(t('fetch_candidates_error'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchCandidates(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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