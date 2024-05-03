// import React, { useState } from 'react';

// const TagInput = ({ existingTags, onAddTag }) => {
//   const [inputValue, setInputValue] = useState('');
//   const [suggestedTags, setSuggestedTags] = useState([]);
//   const [tags, setTags] = useState([]);

//   const handleInputChange = (e) => {
//     const value = e.target.value;
//     setInputValue(value);

//     // Filter existing tags for auto-completion
//     const filteredTags = existingTags.filter(tag =>
//       tag.toLowerCase().includes(value.toLowerCase())
//     );

//     setSuggestedTags(filteredTags);
//   };

//   const handleInputKeyDown = (e) => {
//     if (e.key === 'Enter' && inputValue.trim()) {
//       // Add tag when Enter key is pressed and input value is not empty
//       setTags([...tags, inputValue.trim()]);
//       setInputValue('');
//     }
//   };

//   const handleTagClick = (tag) => {
//     // Add tag when a suggested tag is clicked
//     setTags([...tags, tag]);
//     setInputValue('');
//   };

//   const handleRemoveTag = (tag) => {
//     // Remove tag when a tag is clicked for removal
//     setTags(tags.filter(t => t !== tag));
//   };

//   const handleSubmit = () => {
//     // Pass the tags to the parent component for further handling
//     onAddTag(tags);
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         value={inputValue}
//         onChange={handleInputChange}
//         onKeyDown={handleInputKeyDown}
//         placeholder="Add tags"
//       />
//       {suggestedTags.length > 0 && (
//         <ul>
//           {suggestedTags.map(tag => (
//             <li key={tag} onClick={() => handleTagClick(tag)}>
//               {tag}
//             </li>
//           ))}
//         </ul>
//       )}
//       <div>
//         {tags.map(tag => (
//           <span key={tag} onClick={() => handleRemoveTag(tag)}>
//             {tag} <button>X</button>
//           </span>
//         ))}
//       </div>
//       <button onClick={handleSubmit}>Apply Tags</button>
//     </div>
//   );
// };

// export default TagInput;