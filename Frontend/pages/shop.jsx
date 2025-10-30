import GallerySection from "@/src/components/GallerySection";
import PageBanner from "@/src/components/PageBanner";
import Layout from "@/src/layout/Layout";
import Link from "next/link";
const Shop = () => {
  return (
    <Layout extraClass={"pt-160"}>
      <PageBanner pageTitle={"Shop"} />
      {/*====== Start Products Section ======*/}
      <section className="products-section pt-100 pb-90">
        <div className="container">
          {/*====== Products Filter ======*/}
          <div className="page-item-filter mb-40 wow fadeInUp">
            <div className="row align-items-center justify-content-center">
              <div className="col-md-7">
                {/*====== Show Text ======*/}
                <div className="show-text mb-20">
                  <h6>Showing Results 09 Of 55</h6>
                </div>
              </div>
              <div className="col-md-5">
                {/*====== Product Dropdown ======*/}
                <div className="product-dropdown float-md-end">
                  <span className="title">Sort By</span>
                  <select className="wide">
                    <option data-display="Default">Default</option>
                    <option value={1}>Best Products</option>
                    <option value={2}>Highest Price</option>
                    <option value={3}>Lowest Price</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-4 col-md-6 col-sm-12">
              {/*=== Single Product Item ===*/}
              <div className="single-product-item mb-50 wow fadeInUp">
                <div className="img-holder">
                  <img
                    src="assets/images/shop/product-1.jpg"
                    alt="Product Image"
                  />
                  <div className="tag">
                    <span className="off">10% OFF</span>
                  </div>
                  <div className="content-hover">
                    <a href="#" className="main-btn primary-btn">
                      Add To Cart <i className="far fa-shopping-bag" />
                    </a>
                  </div>
                </div>
                <div className="content">
                  <div className="info">
                    <h4 className="title">
                      <Link legacyBehavior href="/products-details">
                        <a>Leather Heels Shoe</a>
                      </Link>
                    </h4>
                    <span className="price">
                      <span className="prev-price">
                        <span className="currency">$</span>28.00
                      </span>
                      <span className="currency">$</span>25.00
                    </span>
                  </div>
                  <ul className="ratings">
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6 col-sm-12">
              {/*=== Single Product Item ===*/}
              <div className="single-product-item mb-50 wow fadeInUp">
                <div className="img-holder">
                  <img
                    src="assets/images/shop/product-2.jpg"
                    alt="Product Image"
                  />
                  <div className="content-hover">
                    <a href="#" className="main-btn primary-btn">
                      Add To Cart <i className="far fa-shopping-bag" />
                    </a>
                  </div>
                </div>
                <div className="content">
                  <div className="info">
                    <h4 className="title">
                      <Link legacyBehavior href="/products-details">
                        <a>Womens Stylish Bag</a>
                      </Link>
                    </h4>
                    <span className="price">
                      <span className="currency">$</span>14.00
                    </span>
                  </div>
                  <ul className="ratings">
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6 col-sm-12">
              {/*=== Single Product Item ===*/}
              <div className="single-product-item mb-50 wow fadeInUp">
                <div className="img-holder">
                  <img
                    src="assets/images/shop/product-3.jpg"
                    alt="Product Image"
                  />
                  <div className="tag">
                    <span className="feat">Features</span>
                    <span className="off">10% OFF</span>
                  </div>
                  <div className="content-hover">
                    <a href="#" className="main-btn primary-btn">
                      Add To Cart <i className="far fa-shopping-bag" />
                    </a>
                  </div>
                </div>
                <div className="content">
                  <div className="info">
                    <h4 className="title">
                      <Link legacyBehavior href="/products-details">
                        <a>Womens Stylish Bag</a>
                      </Link>
                    </h4>
                    <span className="price">
                      <span className="prev-price">
                        <span className="currency">$</span>28.00
                      </span>
                      <span className="currency">$</span>25.00
                    </span>
                  </div>
                  <ul className="ratings">
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6 col-sm-12">
              {/*=== Single Product Item ===*/}
              <div className="single-product-item mb-50 wow fadeInUp">
                <div className="img-holder">
                  <img
                    src="assets/images/shop/product-4.jpg"
                    alt="Product Image"
                  />
                  <div className="content-hover">
                    <a href="#" className="main-btn primary-btn">
                      Add To Cart <i className="far fa-shopping-bag" />
                    </a>
                  </div>
                </div>
                <div className="content">
                  <div className="info">
                    <h4 className="title">
                      <Link legacyBehavior href="/products-details">
                        <a>Brown Leather Belt</a>
                      </Link>
                    </h4>
                    <span className="price">
                      <span className="currency">$</span>19.00
                    </span>
                  </div>
                  <ul className="ratings">
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6 col-sm-12">
              {/*=== Single Product Item ===*/}
              <div className="single-product-item mb-50 wow fadeInUp">
                <div className="img-holder">
                  <img
                    src="assets/images/shop/product-5.jpg"
                    alt="Product Image"
                  />
                  <div className="tag">
                    <span className="off">10% OFF</span>
                  </div>
                  <div className="content-hover">
                    <a href="#" className="main-btn primary-btn">
                      Add To Cart <i className="far fa-shopping-bag" />
                    </a>
                  </div>
                </div>
                <div className="content">
                  <div className="info">
                    <h4 className="title">
                      <Link legacyBehavior href="/products-details">
                        <a>Green Front Sweater</a>
                      </Link>
                    </h4>
                    <span className="price">
                      <span className="prev-price">
                        <span className="currency">$</span>28.00
                      </span>
                      <span className="currency">$</span>25.00
                    </span>
                  </div>
                  <ul className="ratings">
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6 col-sm-12">
              {/*=== Single Product Item ===*/}
              <div className="single-product-item mb-50 wow fadeInUp">
                <div className="img-holder">
                  <img
                    src="assets/images/shop/product-6.jpg"
                    alt="Product Image"
                  />
                  <div className="tag">
                    <span className="off">10% OFF</span>
                  </div>
                  <div className="content-hover">
                    <a href="#" className="main-btn primary-btn">
                      Add To Cart <i className="far fa-shopping-bag" />
                    </a>
                  </div>
                </div>
                <div className="content">
                  <div className="info">
                    <h4 className="title">
                      <Link legacyBehavior href="/products-details">
                        Black Summer T-shirt
                      </Link>
                    </h4>
                    <span className="price">
                      <span className="prev-price">
                        <span className="currency">$</span>28.00
                      </span>
                      <span className="currency">$</span>25.00
                    </span>
                  </div>
                  <ul className="ratings">
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6 col-sm-12">
              {/*=== Single Product Item ===*/}
              <div className="single-product-item mb-50 wow fadeInUp">
                <div className="img-holder">
                  <img
                    src="assets/images/shop/product-8.jpg"
                    alt="Product Image"
                  />
                  <div className="tag">
                    <span className="best">Best Saller</span>
                  </div>
                  <div className="content-hover">
                    <a href="#" className="main-btn primary-btn">
                      Add To Cart <i className="far fa-shopping-bag" />
                    </a>
                  </div>
                </div>
                <div className="content">
                  <div className="info">
                    <h4 className="title">
                      <Link legacyBehavior href="/products-details">
                        Handbag Leather
                      </Link>
                    </h4>
                    <span className="price">
                      <span className="currency">$</span>05.00
                    </span>
                  </div>
                  <ul className="ratings">
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6 col-sm-12">
              {/*=== Single Product Item ===*/}
              <div className="single-product-item mb-50 wow fadeInUp">
                <div className="img-holder">
                  <img
                    src="assets/images/shop/product-7.jpg"
                    alt="Product Image"
                  />
                  <div className="content-hover">
                    <a href="#" className="main-btn primary-btn">
                      Add To Cart <i className="far fa-shopping-bag" />
                    </a>
                  </div>
                </div>
                <div className="content">
                  <div className="info">
                    <h4 className="title">
                      <Link legacyBehavior href="/products-details">
                        Cotton Shirt Classic
                      </Link>
                    </h4>
                    <span className="price">
                      <span className="currency">$</span>25.00
                    </span>
                  </div>
                  <ul className="ratings">
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6 col-sm-12">
              {/*=== Single Product Item ===*/}
              <div className="single-product-item mb-50 wow fadeInUp">
                <div className="img-holder">
                  <img
                    src="assets/images/shop/product-9.jpg"
                    alt="Product Image"
                  />
                  <div className="tag">
                    <span className="off">10% OFF</span>
                  </div>
                  <div className="content-hover">
                    <a href="#" className="main-btn primary-btn">
                      Add To Cart <i className="far fa-shopping-bag" />
                    </a>
                  </div>
                </div>
                <div className="content">
                  <div className="info">
                    <h4 className="title">
                      <Link legacyBehavior href="/products-details">
                        Red Cap Protection
                      </Link>
                    </h4>
                    <span className="price">
                      <span className="prev-price">
                        <span className="currency">$</span>28.00
                      </span>
                      <span className="currency">$</span>25.00
                    </span>
                  </div>
                  <ul className="ratings">
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6 col-sm-12">
              {/*=== Single Product Item ===*/}
              <div className="single-product-item mb-50 wow fadeInUp">
                <div className="img-holder">
                  <img
                    src="assets/images/shop/product-10.jpg"
                    alt="Product Image"
                  />
                  <div className="content-hover">
                    <a href="#" className="main-btn primary-btn">
                      Add To Cart <i className="far fa-shopping-bag" />
                    </a>
                  </div>
                </div>
                <div className="content">
                  <div className="info">
                    <h4 className="title">
                      <Link legacyBehavior href="/products-details">
                        High Heel Shoes
                      </Link>
                    </h4>
                    <span className="price">
                      <span className="currency">$</span>25.00
                    </span>
                  </div>
                  <ul className="ratings">
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6 col-sm-12">
              {/*=== Single Product Item ===*/}
              <div className="single-product-item mb-50 wow fadeInUp">
                <div className="img-holder">
                  <img
                    src="assets/images/shop/product-11.jpg"
                    alt="Product Image"
                  />
                  <div className="tag">
                    <span className="off">10% OFF</span>
                  </div>
                  <div className="content-hover">
                    <a href="#" className="main-btn primary-btn">
                      Add To Cart <i className="far fa-shopping-bag" />
                    </a>
                  </div>
                </div>
                <div className="content">
                  <div className="info">
                    <h4 className="title">
                      <Link legacyBehavior href="/products-details">
                        Classic Tan Felt Hat
                      </Link>
                    </h4>
                    <span className="price">
                      <span className="prev-price">
                        <span className="currency">$</span>28.00
                      </span>
                      <span className="currency">$</span>25.00
                    </span>
                  </div>
                  <ul className="ratings">
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6 col-sm-12">
              {/*=== Single Product Item ===*/}
              <div className="single-product-item mb-50 wow fadeInUp">
                <div className="img-holder">
                  <img
                    src="assets/images/shop/product-12.jpg"
                    alt="Product Image"
                  />
                  <div className="content-hover">
                    <a href="#" className="main-btn primary-btn">
                      Add To Cart <i className="far fa-shopping-bag" />
                    </a>
                  </div>
                </div>
                <div className="content">
                  <div className="info">
                    <h4 className="title">
                      <Link legacyBehavior href="/products-details">
                        Red Stylish Ladies Bag
                      </Link>
                    </h4>
                    <span className="price">
                      <span className="currency">$</span>23.00
                    </span>
                  </div>
                  <ul className="ratings">
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <ul className="gowilds-pagination wow fadeInUp text-center">
                <li>
                  <a href="#">
                    <i className="far fa-arrow-left" />
                  </a>
                </li>
                <li>
                  <a href="#" className="active">
                    01
                  </a>
                </li>
                <li>
                  <a href="#">02</a>
                </li>
                <li>
                  <a href="#">03</a>
                </li>
                <li>
                  <a href="#">04</a>
                </li>
                <li>
                  <a href="#">
                    <i className="far fa-arrow-right" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/*====== End Products Section ======*/}
      {/*====== Start Gallery Section ======*/}
      <GallerySection />
      {/*====== End Gallery Section ======*/}
    </Layout>
  );
};
export default Shop;
