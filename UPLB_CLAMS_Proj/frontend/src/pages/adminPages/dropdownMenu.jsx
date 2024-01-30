import React, { useState, useEffect} from 'react';

export default function DropdownMenu({ options, onSelect, studentNo, currentAdviser}) {
  const [selectedOption, setSelectedOption] = useState(currentAdviser);
  const [advisers, setAdvisers] = useState([]);

  useEffect(() => {
    // request to get the array of advisers
    fetch('http://localhost:3001/get-advisers')
    .then(response => response.json())
    .then(body => {
        setAdvisers(body)
        console.log(body)
    });

    },[]
)

  const handleOptionChange = (event) => {
    const option = event.target.value;
    setSelectedOption(option);

    for(let i=0; i < advisers.length; i++) {
      if(advisers[i].studentNo == option) {
        onSelect(advisers[i]._id, studentNo) // pass the studentNo as Argument
      }
    }
  };

  return (
    <div>
      <select class="dropdown_menu_list" onChange={handleOptionChange}>
        {options.map((option) => (
          <option key={option} value={option} class="dropdown_menu_item">
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};
