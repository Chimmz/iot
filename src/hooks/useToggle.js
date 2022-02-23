import { useState } from 'react';

const useToggle = function (initState = false) {
   const [state, setState] = useState(initState);

   const toggle = () => {
      setState(!state);
      console.log(state);
   };
   const reset = () => setState(initState);
   return [state, toggle, reset];
};

export default useToggle;
