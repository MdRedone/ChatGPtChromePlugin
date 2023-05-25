// import { h } from 'preact'
// import {  AllBlogsSection, BlogsSection, CategoriesSection } from './sectionContent'
// // import SectionButtons from './sections'
// import { useState } from 'react'

// type SectionButton = {
//     target: {
//         value: string
//     }
// }

// interface SectionButtonsProps {
//    button: HTMLButtonElement | null
// }

// const Section = ({button}: SectionButtonsProps) =>{
//     const [ selectedCategory, onCategorySelect] = useState('')

//     return (
//         <div className="wcg-section-buttons">
//         <button
//           className={selectedCategory === 'All Blogs' ? 'active' : ''}
//           onClick={() => onCategorySelect('All Blogs')}
//         >
//           All Blogs
//         </button>
//         <button
//           className={selectedCategory === 'Blogs' ? 'active' : ''}
//           onClick={() => onCategorySelect('Blogs')}
//         >
//           Blogs
//         </button>
//         <button
//           className={selectedCategory === 'Categories' ? 'active' : ''}
//           onClick={() => onCategorySelect('Categories')}
//         >
//           Categories
//         </button>
  
//         {selectedCategory === 'All Blogs' && <AllBlogsSection />}
//         {selectedCategory === 'Blogs' && <BlogsSection />}
//         {selectedCategory === 'Categories' && <CategoriesSection />}
//       </div>

//     );
// }

// export default Section;

