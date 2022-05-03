import { useState } from 'react';

function useList(initItems = []) {
   const [items, setItems] = useState(initItems);

   const addItem = newItem => setItems(currItems => [...currItems, newItem]);

   const removeItem = itemToRemove => {
      if (!items.includes(itemToRemove)) return;

      const filteredItems = items.filter(itm => itm !== itemToRemove);
      setItems(filteredItems);
   };

   const resetList = () => setItems([]);

   return { items, addItem, removeItem, setItems, resetList };
}

export default useList;
