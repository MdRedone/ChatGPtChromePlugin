import { h } from 'preact';

const AllBlogsSection: React.FC = () => {
  return (
    <div>
      {/* Content of the Example section */}
      <h3>All Blogs</h3>
      <p>To Display all the saved prompts.</p>
    </div>
  );
};

const BlogsSection: React.FC = () => {
  return (
    <div>
      {/* Content of the Capabilities section */}
      <h3>Blogs Section</h3>
      <p>This is a Blogs Section.</p>
    </div>
  );
};

const CategoriesSection: React.FC = () => {
  return (
    <div>
      {/* Content of the Limitations section */}
      <h3>Categories Section</h3>
      <p>This is a Categories Section.</p>
    </div>
  );
};

export { AllBlogsSection, BlogsSection, CategoriesSection };

// import { h } from 'preact';

// function AllBlogsSection() {
//   return <div>All Blogs Section</div>;
// }

// function BlogsSection() {
//   return <div>Blogs Section</div>;
// }

// function CategoriesSection() {
//   return <div>Categories Section</div>;
// }

// export { AllBlogsSection, BlogsSection, CategoriesSection };
