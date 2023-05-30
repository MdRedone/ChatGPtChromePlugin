// import { h } from 'preact';
// import {  AllBlogsSection, BlogsSection, CategoriesSection } from './sectionContent'

// type SectionButtonsProps = { 
//   selectedCategory: string;
//   onCategorySelect: (category: string) => void;
// };

// const SectionButtons: React.FC<SectionButtonsProps> = ({
//   selectedCategory,
//   onCategorySelect,
// }) => {
//   return (
//     <div className="wcg-section-buttons">
//       <button
//         className={selectedCategory === 'All Blogs' ? 'active' : ''}
//         onClick={() => onCategorySelect('All Blogs')}
//       >
//         All Blogs
//       </button>
//       <button
//         className={selectedCategory === 'Blogs' ? 'active' : ''}
//         onClick={() => onCategorySelect('Blogs')}
//       >
//         Blogs
//       </button>
//       <button
//         className={selectedCategory === 'Categories' ? 'active' : ''}
//         onClick={() => onCategorySelect('Categories')}
//       >
//         Categories
//       </button>

//       {selectedCategory === 'All Blogs' && <AllBlogsSection />}
//       {selectedCategory === 'Blogs' && <BlogsSection />}
//       {selectedCategory === 'Categories' && <CategoriesSection />}
//     </div>
//   );
// };

// export default SectionButtons;

import { h } from 'preact'
import {  AllBlogsSection, BlogsSection, CategoriesSection } from './sectionContent'
// import SectionButtons from './sections'
import { useState } from 'preact/hooks'

type SectionButton = {
    target: {
        value: string
    }
}

interface SectionButtonsProps {
   button: HTMLButtonElement | null 
}

const Section = ({button}: SectionButtonsProps) =>{
    const [ selectedCategory, setSelectedCategory] = useState('')

    const onCategorySelect = (category: string) => {
      setSelectedCategory(category);
    };

    return (
      <div className="wcg-section-buttons flex flex-col gap-0" style="display: flex; justify-content: center; text-align: center; margin-top: 170px">
        <div className="space-x-6">
              <button
                className={`py-2 px-4 rounded-full border-2 border-black ${
                  selectedCategory === 'All Blogs' ? 'bg-black text-white' : 'bg-white text-black'
                }`}
                onClick={() => onCategorySelect('All Blogs')}
              >
                All Blogs
              </button>
              <button
                className={`py-2 px-4 rounded-full border-2 border-black ${
                  selectedCategory === 'Blogs' ? 'bg-black text-white' : 'bg-white text-black'
                }`}
                onClick={() => onCategorySelect('Blogs')}
              >
                Blogs
              </button>
              <button
                className={`py-2 px-2 rounded-full border-2 border-black ${
                  selectedCategory === 'Categories' ? 'bg-black text-white' : 'bg-white text-black'
                }`}
                onClick={() => onCategorySelect('Categories')}
              >
                Categories
              </button>
          </div>
            
          <div className="mt-4">
            {selectedCategory === 'All Blogs' && <AllBlogsSection />}
            {selectedCategory === 'Blogs' && <BlogsSection />}
            {selectedCategory === 'Categories' && <CategoriesSection />}
          </div>
      </div>

    );
}

export default Section;


