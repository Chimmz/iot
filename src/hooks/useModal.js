import { useState } from 'react';

function useModal(initState = false) {
   const [modalShown, setModalShown] = useState(initState);

   const show = () => setModalShown(true);
   const hide = () => setModalShown(false);

   return [modalShown, show, hide];
}

export default useModal;
