import './PopularCategories.css'

// 👇 غيّر الصور هنا لما تجهزها (category1.png, category2.png...)
import womenImg from "../../assets/category1.svg";
import menImg from "../../assets/category2.svg";
import kidsImg from "../../assets/category3.svg";
import bagsImg from "../../assets/category4.svg";

const categories = [
  { image: womenImg, title: 'Women', badge: 'Best Selling' },
  { image: menImg, title: 'Men', badge: 'Best Selling' },
  { image: kidsImg, title: 'Kids', badge: 'Best Selling' },
  { image: bagsImg, title: 'Bags', badge: 'Best Selling' },
]

function PopularCategories() {
  return (
    <section className="popular-categories">
      <h2 className="popular-categories-title">Popular Categories</h2>

      <div className="category-grid">
        {categories.map((cat) => (
          <div key={cat.title} className="category-card">
            <img
              src={cat.image}
              alt={cat.title}
              className="category-card-image"
            />
            <div className="category-card-body">
              <h3 className="category-card-title">{cat.title}</h3>
              <span className="category-card-badge">{cat.badge}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default PopularCategories