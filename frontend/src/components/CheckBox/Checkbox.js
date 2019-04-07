import React from 'react';
import PropTypes from 'prop-types';

// const Checkbox = ({ 
//     type = 'checkbox', 
//     name, 
//     checked = false, 
//     onChange 
//     }) => (
//   <input type={type} name={name} checked={checked} onChange={onChange} />
  
// );

const Checkbox = (props) => {
  
  return (
    <p>
      <label>
        <input type='checkbox' name={props.name} checked={props.checked} onChange={props.onChange} />
        <span>{props.name}</span>
      </label>
    </p>
  )
}

// Checkbox.propTypes = {
//   type: PropTypes.string,
//   name: PropTypes.string.isRequired,
//   checked: PropTypes.bool,
//   onChange: PropTypes.func.isRequired,
// }

export default Checkbox;