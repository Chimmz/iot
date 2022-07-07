import { useState, useEffect } from 'react';

function useCounter({ init: initCount = 0, limit, onReachLimit }) {
   const [count, setCount] = useState(initCount);
   const advanceCounter = () => setCount(prevCount => prevCount + 1);
   const resetCounter = () => setCount(initCount);

   useEffect(() => {
      if (!limit) return; // If the counter system doesn't use a limit
      if (count === limit) onReachLimit?.();
   }, [count, limit]);

   return { count, advanceCounter, limitReached: count >= limit, resetCounter };
}

export default useCounter;
