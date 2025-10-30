import PageBanner from "@/src/components/PageBanner";
import ProductDetailsSlider from "@/src/components/sliders/ProductDetailsSlider";
import Layout from "@/src/layout/Layout";
import { sliderActive3Item, sliderActive5Item } from "@/src/sliderProps";
import Link from "next/link";
import { Nav, Tab } from "react-bootstrap";
import Slider from "react-slick";
const ProductDetails = () => {
  return (
    <Layout extraClass={"pt-160"}>
      <PageBanner pageTitle={"Product Details"} />
      {/*====== Start Shop Details Section ======*/}
      <section className="shop-details-section pt-100 pb-50">
        <div className="container">
          <div className="product-details-wrapper">
            <div className="row align-items-xl-center">
              <div className="col-lg-6">
                {/*=== Product Gallery ===*/}
                <ProductDetailsSlider />
              </div>
              <div className="col-lg-6">
                <div className="product-info mb-50 pl-lg-70 wow fadeInRight">
                  <h4 className="title">Womens Stylish Bag</h4>
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
                    <li>
                      <a href="#">4.9(Customer Reviews)</a>
                    </li>
                  </ul>
                  <span className="price">
                    <span className="currency">$</span>232.00
                  </span>
                  <p>
                    Quis ipsum sed et proin sit aliquet in quis aliqu
                    ullamcorper sollicitudin quis ut sedorbi dui porttitor duis
                    porttitore fringilla Estauris purus vita volutpat. Estorem
                    felis mau libero nisiey Rhoncus phasellus facilisi praesent
                    venenatis metus.
                  </p>
                  <p>
                    Autem vel eum iure reprehenderit quies voluptate velit esse
                    quam nihil molestiae consequatur veillume dolorem
                  </p>
                  <div className="product-cart mt-20 mb-30">
                    <ul>
                      <li>
                        <div className="quantity-input">
                          <button className="quantity-down">
                            <i className="far fa-minus" />
                          </button>
                          <input
                            className="quantity"
                            type="text"
                            defaultValue={1}
                            name="quantity"
                          />
                          <button className="quantity-up">
                            <i className="fas fa-plus" />
                          </button>
                        </div>
                      </li>
                      <li>
                        <button className="main-btn primary-btn">
                          Add to cart
                          <i className="far fa-paper-plane" />
                        </button>
                      </li>
                    </ul>
                  </div>
                  <ul className="product-meta pb-35 mb-40">
                    <li>
                      <span>Categories</span>
                      <a href="#">Restaurant</a>
                    </li>
                    <li>
                      <span>Tags</span>
                      <a href="#">Pizza, Burger, Soup</a>
                    </li>
                  </ul>
                  <ul className="social-link">
                    <li>
                      <span>Share</span>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fab fa-facebook-f" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fab fa-twitter" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fab fa-instagram" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fab fa-linkedin" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xl-8">
                <Tab.Container defaultActiveKey={"descrptions"}>
                  <div className="description-wrapper mt-30 wow fadeInUp">
                    <div className="description-tabs mb-10">
                      <Nav as={"ul"} className="nav">
                        <Nav.Item as={"li"} className="nav-item">
                          <Nav.Link
                            as={"a"}
                            className="nav-link"
                            href="#descrptions"
                            eventKey="descrptions"
                          >
                            Description
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item as={"li"} className="nav-item">
                          <Nav.Link
                            as={"a"}
                            className="nav-link"
                            href="#information"
                            eventKey="information"
                          >
                            Additional Information
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item as={"li"} className="nav-item">
                          <Nav.Link
                            as={"a"}
                            className="nav-link"
                            href="#reviews"
                            eventKey="reviews"
                          >
                            Reviews (2)
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
                    </div>
                    <Tab.Content className="tab-content wow fadeInUp">
                      <Tab.Pane
                        className="tab-pane fade"
                        eventKey="descrptions"
                      >
                        <div className="content-box">
                          <p>
                            Sorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Tortor nulla id sit neque scelerisque
                            pulvinar. amet interdum turpis consequat adipiscing.
                            Elementum feugiat sed duis consectetur varius et
                            cras mattis. Lobortis auctor sit in eu nisl fusce
                            augue venenatis, dui. Phasellus eget sagittis
                            mauris, nibh augue cursus Tristique amet
                            sollicitudin sit nulla aliquam, imperdiet sed ut
                            diam. Suspendisse ipsum rhoncus nulla lectus. Id
                            neque in urna neque non amet. Tortor sed aliquam in
                            faucibus enim, posuere. Sed etaccumsan neque posuere
                            tempus in cras. Ornare lectus pretium est eget
                            purus, enim quam purus netus.
                          </p>
                          <p>
                            Dictum ultrices et suspendisse amet mattis in
                            pellentesque. Vulputate arcu, consectetur odio donec
                            nec duis ultrices facilisi. Mauris cursus elit diam,
                            urna suspendisse et, amet. Vitae ligula ultrices
                            nulla justo, enim lorem duis. Volutpat sit et neque
                            aliquam diam at at neque acus augue
                          </p>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane
                        className="tab-pane fade"
                        eventKey="information"
                      >
                        <div className="content-box">
                          <p>
                            Sorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Tortor nulla id sit neque scelerisque
                            pulvinar. amet interdum turpis consequat adipiscing.
                            Elementum feugiat sed duis consectetur varius et
                            cras mattis. Lobortis auctor sit in eu nisl fusce
                            augue venenatis, dui. Phasellus eget sagittis
                            mauris, nibh augue cursus Tristique amet
                            sollicitudin sit nulla aliquam, imperdiet sed ut
                            diam. Suspendisse ipsum rhoncus nulla lectus. Id
                            neque in urna neque non amet. Tortor sed aliquam in
                            faucibus enim, posuere. Sed etaccumsan neque posuere
                            tempus in cras. Ornare lectus pretium est eget
                            purus, enim quam purus netus.
                          </p>
                          <p>
                            Dictum ultrices et suspendisse amet mattis in
                            pellentesque. Vulputate arcu, consectetur odio donec
                            nec duis ultrices facilisi. Mauris cursus elit diam,
                            urna suspendisse et, amet. Vitae ligula ultrices
                            nulla justo, enim lorem duis. Volutpat sit et neque
                            aliquam diam at at neque acus augue
                          </p>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane className="tab-pane fade" eventKey="reviews">
                        <div className="content-box">
                          <p>
                            Sorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Tortor nulla id sit neque scelerisque
                            pulvinar. amet interdum turpis consequat adipiscing.
                            Elementum feugiat sed duis consectetur varius et
                            cras mattis. Lobortis auctor sit in eu nisl fusce
                            augue venenatis, dui. Phasellus eget sagittis
                            mauris, nibh augue cursus Tristique amet
                            sollicitudin sit nulla aliquam, imperdiet sed ut
                            diam. Suspendisse ipsum rhoncus nulla lectus. Id
                            neque in urna neque non amet. Tortor sed aliquam in
                            faucibus enim, posuere. Sed etaccumsan neque posuere
                            tempus in cras. Ornare lectus pretium est eget
                            purus, enim quam purus netus.
                          </p>
                          <p>
                            Dictum ultrices et suspendisse amet mattis in
                            pellentesque. Vulputate arcu, consectetur odio donec
                            nec duis ultrices facilisi. Mauris cursus elit diam,
                            urna suspendisse et, amet. Vitae ligula ultrices
                            nulla justo, enim lorem duis. Volutpat sit et neque
                            aliquam diam at at neque acus augue
                          </p>
                        </div>
                      </Tab.Pane>
                    </Tab.Content>
                    {/*=== Review Form ===*/}
                    <div className="review-form-area wow fadeInUp mt-50 mb-40">
                      <h3 className="title">Send Us Reviews</h3>
                      <p>
                        We have 3k+ 5star Reviews
                        <img src="assets/images/shop/rate.png" alt />
                      </p>
                      <form className="review-form">
                        <div className="row">
                          <div className="col-lg-6">
                            <div className="form_group">
                              <input
                                type="text"
                                className="form_control"
                                placeholder="Full Name"
                                name="name"
                                required
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="form_group">
                              <input
                                type="text"
                                className="form_control"
                                placeholder="Email Address"
                                name="email"
                                required
                              />
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="form_group">
                              <input
                                type="url"
                                className="form_control"
                                placeholder="Website"
                                name="website"
                                required
                              />
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="form_group">
                              <textarea
                                name="message"
                                className="form_control"
                                placeholder="Write Message"
                                defaultValue={""}
                              />
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="form_group">
                              <button className="main-btn primary-btn">
                                Send Reviews
                                <i className="fas fa-paper-plane" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </Tab.Container>
              </div>
              <div className="col-xl-4">
                <div className="sidebar-widget-area pl-lg-45 mt-30">
                  {/*=== Banner Widget ===*/}
                  <div className="sidebar-widget widget-product-banner mb-40 wow fadeInUp">
                    <div className="banner-content text-center">
                      <h4 className="title">Black Winter T-shirt</h4>
                      <img
                        src="assets/images/shop/mockup.png"
                        alt="Banner Image"
                      />
                      <Link legacyBehavior href="/contact">
                        <a className="main-btn secondary-btn">
                          Shop Now
                          <i className="far fa-paper-plane" />
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*====== End Shop Details Section ======*/}
      {/*====== Start Recent Product Section ======*/}
      <section className="recent-product-section pb-40">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title text-center mb-50">
                <h2>Related Products</h2>
              </div>
            </div>
          </div>
          <Slider
            {...sliderActive3Item}
            className="slider-active-3-item wow fadeInDown"
          >
            {/*=== Single Product Item ===*/}
            <div className="single-product-item mb-50">
              <div className="img-holder">
                <img
                  src="assets/images/shop/product-1.jpg"
                  alt="Product Image"
                />
                <div className="tag">
                  <span className="off">10% OFF</span>
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
            {/*=== Single Product Item ===*/}
            <div className="single-product-item mb-50">
              <div className="img-holder">
                <img
                  src="assets/images/shop/product-2.jpg"
                  alt="Product Image"
                />
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
            {/*=== Single Product Item ===*/}
            <div className="single-product-item mb-50">
              <div className="img-holder">
                <img
                  src="assets/images/shop/product-3.jpg"
                  alt="Product Image"
                />
                <div className="tag">
                  <span className="feat">Features</span>
                  <span className="off">10% OFF</span>
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
            {/*=== Single Product Item ===*/}
            <div className="single-product-item mb-50">
              <div className="img-holder">
                <img
                  src="assets/images/shop/product-4.jpg"
                  alt="Product Image"
                />
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
          </Slider>
        </div>
      </section>
      {/*====== End Recent Product Section ======*/}
      {/*====== Start Gallery Section ======*/}
      <section className="gallery-section mbm-150">
        <div className="container-fluid">
          <Slider
            {...sliderActive5Item}
            className="slider-active-5-item fadeInUp"
          >
            {/*=== Single Gallery Item ===*/}
            <div className="single-gallery-item">
              <div className="gallery-img">
                <img src="assets/images/gallery/gl-1.jpg" alt="Gallery Image" />
                <div className="hover-overlay">
                  <a
                    href="assets/images/gallery/gl-1.jpg"
                    className="icon-btn img-popup"
                  >
                    <i className="far fa-plus" />
                  </a>
                </div>
              </div>
            </div>
            {/*=== Single Gallery Item ===*/}
            <div className="single-gallery-item">
              <div className="gallery-img">
                <img src="assets/images/gallery/gl-2.jpg" alt="Gallery Image" />
                <div className="hover-overlay">
                  <a
                    href="assets/images/gallery/gl-2.jpg"
                    className="icon-btn img-popup"
                  >
                    <i className="far fa-plus" />
                  </a>
                </div>
              </div>
            </div>
            {/*=== Single Gallery Item ===*/}
            <div className="single-gallery-item">
              <div className="gallery-img">
                <img src="assets/images/gallery/gl-3.jpg" alt="Gallery Image" />
                <div className="hover-overlay">
                  <a
                    href="assets/images/gallery/gl-3.jpg"
                    className="icon-btn img-popup"
                  >
                    <i className="far fa-plus" />
                  </a>
                </div>
              </div>
            </div>
            {/*=== Single Gallery Item ===*/}
            <div className="single-gallery-item">
              <div className="gallery-img">
                <img src="assets/images/gallery/gl-4.jpg" alt="Gallery Image" />
                <div className="hover-overlay">
                  <a
                    href="assets/images/gallery/gl-4.jpg"
                    className="icon-btn img-popup"
                  >
                    <i className="far fa-plus" />
                  </a>
                </div>
              </div>
            </div>
            {/*=== Single Gallery Item ===*/}
            <div className="single-gallery-item">
              <div className="gallery-img">
                <img src="assets/images/gallery/gl-5.jpg" alt="Gallery Image" />
                <div className="hover-overlay">
                  <a
                    href="assets/images/gallery/gl-5.jpg"
                    className="icon-btn img-popup"
                  >
                    <i className="far fa-plus" />
                  </a>
                </div>
              </div>
            </div>
            {/*=== Single Gallery Item ===*/}
            <div className="single-gallery-item">
              <div className="gallery-img">
                <img src="assets/images/gallery/gl-3.jpg" alt="Gallery Image" />
                <div className="hover-overlay">
                  <a
                    href="assets/images/gallery/gl-3.jpg"
                    className="icon-btn img-popup"
                  >
                    <i className="far fa-plus" />
                  </a>
                </div>
              </div>
            </div>
          </Slider>
        </div>
      </section>
      {/*====== End Gallery Section ======*/}
    </Layout>
  );
};
export default ProductDetails;
