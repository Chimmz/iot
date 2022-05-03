import React, { useEffect } from 'react';

import useToggle from '../../../hooks/useToggle';
import './Toggler.scss';

function Toggler(props) {
   const { id, isOn, onSwitch } = props;
   const isOff = !isOn;

   return (
      <label htmlFor={id} className={`toggler ${isOff && 'toggled-off'}`}>
         <input type="checkbox" checked={isOn} onChange={onSwitch} id={id} />
         <span className="toggler__switch"></span>
      </label>
   );
}

export default Toggler;
