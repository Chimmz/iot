import React, { useState } from 'react';
import {
   fetchWithinTimeout,
   handleFetchLoadingState
} from '../utils/asyncUtils';

function useFetch() {
   const [loading, setLoading] = useState(false);

   const sendRequest = function (promiseFunc) {
      const startLoading = () => setLoading(true);
      const stopLoading = () => setLoading(false);
      const makeRequest = () => fetchWithinTimeout(promiseFunc);

      return handleFetchLoadingState(makeRequest, {
         startLoading,
         stopLoading
      });
   };

   return { sendRequest, loading };
}

export default useFetch;
