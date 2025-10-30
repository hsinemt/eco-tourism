import GallerySection from "@/src/components/GallerySection";
import Layout from "@/src/layout/Layout";
import {
  home1Slider,
  sliderActive3Item,
  sliderActive4Item,
  testimonialSliderOne,
} from "@/src/sliderProps";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Nav, Tab } from "react-bootstrap";
import Slider from "react-slick";
const Counter = dynamic(() => import("@/src/components/Counter"), {
  ssr: false,
});
const Index = () => {
  return (
    <Layout header={1} noFooter>
      {/*====== Start Hero Section ======*/}
      <section className="hero-section">
        {/*=== Hero Wrapper ===*/}
        <div className="hero-wrapper black-bg">
          {/*=== Hero Slider ===*/}
          <Slider {...home1Slider} className="hero-slider-one">
            {/*=== Single Slider ===*/}
            <div className="single-slider">
              <div className="container-fluid">
                <div className="row align-items-center">
                  <div className="col-xl-6">
                    {/*=== Hero Content ===*/}
                    <div className="hero-content text-white">
                      <h1 data-animation="fadeInDown" data-delay=".4s">
                        Travel &amp; Adventure Camping
                      </h1>
                      <div className="text-button d-flex align-items-center">
                        <p data-animation="fadeInLeft" data-delay=".5s">
                          Nunc et dui nullam aliquam eget velit. Consectetur
                          nulla convallis viverra quisque eleifend
                        </p>
                        <div
                          className="hero-button"
                          data-animation="fadeInRight"
                          data-delay=".6s"
                        >
                          <Link legacyBehavior href="/about">
                            <a className="main-btn primary-btn">
                              Explore More
                              <i className="fas fa-paper-plane" />
                            </a>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-6">
                    {/*=== Hero Image ===*/}
                    <div className="hero-image" data-animation="fadeInRight">
                      <img
                        src="assets/images/hero/hero-one_img-1.jpg"
                        alt="Hero Image"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/*=== Single Slider ===*/}
            <div className="single-slider">
              <div className="container-fluid">
                <div className="row align-items-center">
                  <div className="col-xl-6">
                    {/*=== Hero Content ===*/}
                    <div className="hero-content text-white">
                      <h1 data-animation="fadeInDown" data-delay=".4s">
                        Travel &amp; Adventure Tour
                      </h1>
                      <div className="text-button d-flex align-items-center">
                        <p data-animation="fadeInLeft" data-delay=".5s">
                          Nunc et dui nullam aliquam eget velit. Consectetur
                          nulla convallis viverra quisque eleifend
                        </p>
                        <div
                          className="hero-button"
                          data-animation="fadeInRight"
                          data-delay=".6s"
                        >
                          <Link legacyBehavior href="/about">
                            <a className="main-btn primary-btn">
                              Explore More
                              <i className="fas fa-paper-plane" />
                            </a>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-6">
                    {/*=== Hero Image ===*/}
                    <div className="hero-image" data-animation="fadeInRight">
                      <img
                        src="assets/images/hero/hero-one_img-2.jpg"
                        alt="Hero Image"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Slider>
        </div>
      </section>
      {/*====== End Hero Section ======*/}
      {/*====== Start About Section ======*/}
      <section className="about-section pt-100">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-xl-6 col-lg-9">
              {/*=== About Content Box ===*/}
              <div className="about-content-box text-center mb-55 wow fadeInDown">
                <div className="section-title mb-30">
                  <span className="sub-title">About Company</span>
                  <h2>We Are Most Funning Company About Travel &amp; Tours</h2>
                </div>
                <p>
                  Sit amet consectetur. Velit integer eu tincidunt scelerisque.
                  Sodales volutpat neque fermentum malesuada scelerisque massa
                  lacus. Ultrices eget leo cras odio blandit rhoncus eu. At
                  feugiat condimentum massa integer iaculis sit sit. Sagittis
                  vitae quis sed vitae congue
                </p>
              </div>
            </div>
          </div>
          <Slider
            {...sliderActive4Item}
            className="slider-active-4-item wow fadeInUp"
          >
            {/*=== Features Image Item ===*/}
            <div className="single-features-item mb-40">
              <div className="img-holder">
                <img
                  src="assets/images/features/feat-1.jpg"
                  alt="Features Image"
                />
                <div className="content">
                  <div className="text">
                    <h4 className="title">Tent Camping Services</h4>
                    <a href="#" className="icon-btn">
                      <i className="far fa-arrow-right" />
                    </a>
                  </div>
                  <p>Set unde omnis estenatus voluptatem aperiae.</p>
                </div>
              </div>
            </div>
            {/*=== Features Image Item ===*/}
            <div className="single-features-item mb-40">
              <div className="img-holder">
                <img
                  src="assets/images/features/feat-2.jpg"
                  alt="Features Image"
                />
                <div className="content">
                  <div className="text">
                    <h4 className="title">Trailers and RV Spots</h4>
                    <a href="#" className="icon-btn">
                      <i className="far fa-arrow-right" />
                    </a>
                  </div>
                  <p>Set unde omnis estenatus voluptatem aperiae.</p>
                </div>
              </div>
            </div>
            {/*=== Features Image Item ===*/}
            <div className="single-features-item mb-40">
              <div className="img-holder">
                <img
                  src="assets/images/features/feat-3.jpg"
                  alt="Features Image"
                />
                <div className="content">
                  <div className="text">
                    <h4 className="title">Adventure and Climbing</h4>
                    <a href="#" className="icon-btn">
                      <i className="far fa-arrow-right" />
                    </a>
                  </div>
                  <p>Set unde omnis estenatus voluptatem aperiae.</p>
                </div>
              </div>
            </div>
            {/*=== Features Image Item ===*/}
            <div className="single-features-item mb-40">
              <div className="img-holder">
                <img
                  src="assets/images/features/feat-4.jpg"
                  alt="Features Image"
                />
                <div className="content">
                  <div className="text">
                    <h4 className="title">Couple Camping or Cabin</h4>
                    <a href="#" className="icon-btn">
                      <i className="far fa-arrow-right" />
                    </a>
                  </div>
                  <p>Set unde omnis estenatus voluptatem aperiae.</p>
                </div>
              </div>
            </div>
            {/*=== Features Image Item ===*/}
            <div className="single-features-item mb-40">
              <div className="img-holder">
                <img
                  src="assets/images/features/feat-1.jpg"
                  alt="Features Image"
                />
                <div className="content">
                  <div className="text">
                    <h4 className="title">Tent Camping Services</h4>
                    <a href="#" className="icon-btn">
                      <i className="far fa-arrow-right" />
                    </a>
                  </div>
                  <p>Set unde omnis estenatus voluptatem aperiae.</p>
                </div>
              </div>
            </div>
            {/*=== Features Image Item ===*/}
            <div className="single-features-item mb-40">
              <div className="img-holder">
                <img
                  src="assets/images/features/feat-2.jpg"
                  alt="Features Image"
                />
                <div className="content">
                  <div className="text">
                    <h4 className="title">Trailers and RV Spots</h4>
                    <a href="#" className="icon-btn">
                      <i className="far fa-arrow-right" />
                    </a>
                  </div>
                  <p>Set unde omnis estenatus voluptatem aperiae.</p>
                </div>
              </div>
            </div>
            {/*=== Features Image Item ===*/}
            <div className="single-features-item mb-40">
              <div className="img-holder">
                <img
                  src="assets/images/features/feat-3.jpg"
                  alt="Features Image"
                />
                <div className="content">
                  <div className="text">
                    <h4 className="title">Adventure and Climbing</h4>
                    <a href="#" className="icon-btn">
                      <i className="far fa-arrow-right" />
                    </a>
                  </div>
                  <p>Set unde omnis estenatus voluptatem aperiae.</p>
                </div>
              </div>
            </div>
            {/*=== Features Image Item ===*/}
            <div className="single-features-item mb-40">
              <div className="img-holder">
                <img
                  src="assets/images/features/feat-4.jpg"
                  alt="Features Image"
                />
                <div className="content">
                  <div className="text">
                    <h4 className="title">Couple Camping or Cabin</h4>
                    <a href="#" className="icon-btn">
                      <i className="far fa-arrow-right" />
                    </a>
                  </div>
                  <p>Set unde omnis estenatus voluptatem aperiae.</p>
                </div>
              </div>
            </div>
          </Slider>
        </div>
      </section>
      {/*====== End Hero Section ======*/}
      {/*====== Start Booking Section ======*/}
      <section className="booking-section pt-60 pb-50">
        <div className="container">
          <div className="row align-items-xl-center">
            <div className="col-lg-6">
              {/*=== Booking Content Box ===*/}
              <div className="booking-content-box mb-50 wow fadeInLeft">
                <div className="section-title mb-50">
                  <span className="sub-title">Availability</span>
                  <h2>Booking Your Best Tour Camping Availability</h2>
                </div>
                <form className="booking-form">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form_group">
                        <input
                          type="date"
                          className="form_control datepicker"
                          placeholder="Check In"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form_group">
                        <input
                          type="date"
                          className="form_control datepicker"
                          placeholder="Check Out"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form_group">
                        <label>
                          <i className="far fa-user-alt" />
                        </label>
                        <input
                          type="text"
                          className="form_control"
                          placeholder="Guest"
                          name="text"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form_group">
                        <select className="wide">
                          <option data-display="Accommodations">
                            Accommodations
                          </option>
                          <option value={1}>Classic Tent</option>
                          <option value={1}>Forest Camping</option>
                          <option value={1}>Small Trailer</option>
                          <option value={1}>Tree House Tent</option>
                          <option value={1}>Tent Camping</option>
                          <option value={1}>Couple Tent</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <textarea
                        name="comments"
                        placeholder="Comments"
                        className="form_control"
                        cols={8}
                        rows={3}
                        defaultValue={""}
                      />
                    </div>
                    <div className="col-md-12">
                      <div className="form_group">
                        <button className="main-btn primary-btn">
                          Check availability
                          <i className="fas fa-paper-plane" />
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-lg-6">
              {/*=== Booking Image Box ===*/}
              <div className="booking-image-box mb-50 ml-lg-45 wow fadeInRight">
                <img
                  src="assets/images/contact/contact-1.jpg"
                  className="radius-60"
                  alt="Contact Image"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*====== End Hero Section ======*/}
      {/*====== Start Activity Section ======*/}
      <section className="activity-section">
        <div className="activity-wrapper-bgc  text-white black-bg">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-7">
                <div className="section-title text-center mb-50 wow fadeInDown">
                  <span className="sub-title">Popular Activity</span>
                  <h2>Feel Real Adventure and Very Colse to Nature</h2>
                </div>
              </div>
            </div>
            <Tab.Container defaultActiveKey={"tab1"}>
              <div className="row">
                <div className="col-lg-4">
                  {/*=== Activity Nav Tab ===*/}
                  <div className="activity-nav-tab mb-50 wow fadeInLeft">
                    <Nav as="ul" className="nav nav-tabs">
                      <Nav.Item as="li">
                        <Nav.Link
                          as="a"
                          href="#tab1"
                          className="nav-link"
                          eventKey="tab1"
                        >
                          Tent Camping
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item as="li">
                        <Nav.Link
                          as="a"
                          href="#tab2"
                          className="nav-link"
                          eventKey="tab2"
                        >
                          Mountain Biking
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item as="li">
                        <Nav.Link
                          as="a"
                          href="#tab3"
                          className="nav-link"
                          eventKey="tab3"
                        >
                          Birdwatching
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item as="li">
                        <Nav.Link
                          as="a"
                          href="#tab4"
                          className="nav-link"
                          eventKey="tab4"
                        >
                          Fishing
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item as="li">
                        <Nav.Link
                          as="a"
                          href="#tab5"
                          className="nav-link"
                          eventKey="tab5"
                        >
                          Mountain Hiking
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item as="li">
                        <Nav.Link
                          as="a"
                          href="#tab6"
                          className="nav-link"
                          eventKey="tab6"
                        >
                          Mountain Hiking
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </div>
                </div>
                <div className="col-lg-8">
                  {/*=== Tab Content ===*/}
                  <Tab.Content className="tab-content mb-50 wow fadeInRight">
                    {/*=== Tab Pane ===*/}
                    <Tab.Pane className="tab-pane fade" eventKey="tab1">
                      <div className="row align-items-center">
                        <div className="col-md-6">
                          {/*=== Activity Content Box ===*/}
                          <div className="activity-content-box pl-lg-40">
                            <div className="icon">
                              <i className="flaticon-camp" />
                            </div>
                            <h3 className="title">
                              Real Adventure &amp; Enjoy Your Dream Tours
                            </h3>
                            <p>
                              Sit amet consectetur velit integer tincidunt
                              scelerisque. Sodales volutpat neque fermeny
                              malesuada scelerisque massa lacus
                            </p>
                            <ul className="check-list">
                              <li>
                                <i className="fas fa-badge-check" />
                                Family Camping
                              </li>
                              <li>
                                <i className="fas fa-badge-check" />
                                Couple Camping
                              </li>
                              <li>
                                <i className="fas fa-badge-check" />
                                Wild Camping
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="col-md-6">
                          {/*=== Activity Image Box ===*/}
                          <div className="activity-image-box">
                            <img
                              src="assets/images/gallery/activity.jpg"
                              className="radius-12"
                              alt="Image"
                            />
                          </div>
                        </div>
                      </div>
                    </Tab.Pane>
                    {/*=== Tab Pane ===*/}
                    <Tab.Pane className="tab-pane fade" eventKey="tab2">
                      <div className="row align-items-center">
                        <div className="col-md-6">
                          {/*=== Activity Content Box ===*/}
                          <div className="activity-content-box pl-lg-40">
                            <div className="icon">
                              <i className="flaticon-camp" />
                            </div>
                            <h3 className="title">
                              Real Adventure &amp; Enjoy Your Dream Tours
                            </h3>
                            <p>
                              Sit amet consectetur velit integer tincidunt
                              scelerisque. Sodales volutpat neque fermeny
                              malesuada scelerisque massa lacus
                            </p>
                            <ul className="check-list">
                              <li>
                                <i className="fas fa-badge-check" />
                                Family Camping
                              </li>
                              <li>
                                <i className="fas fa-badge-check" />
                                Couple Camping
                              </li>
                              <li>
                                <i className="fas fa-badge-check" />
                                Wild Camping
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          {/*=== Acctivity Image Box ===*/}
                          <div className="activity-image-box">
                            <img
                              src="assets/images/gallery/activity.jpg"
                              className="radius-12"
                              alt="Image"
                            />
                          </div>
                        </div>
                      </div>
                    </Tab.Pane>
                    {/*=== Tab Pane ===*/}
                    <Tab.Pane className="tab-pane fade" eventKey="tab3">
                      <div className="row align-items-center">
                        <div className="col-md-6">
                          {/*=== Activity Content Box ===*/}
                          <div className="activity-content-box pl-lg-40">
                            <div className="icon">
                              <i className="flaticon-camp" />
                            </div>
                            <h3 className="title">
                              Real Adventure &amp; Enjoy Your Dream Tours
                            </h3>
                            <p>
                              Sit amet consectetur velit integer tincidunt
                              scelerisque. Sodales volutpat neque fermeny
                              malesuada scelerisque massa lacus
                            </p>
                            <ul className="check-list">
                              <li>
                                <i className="fas fa-badge-check" />
                                Family Camping
                              </li>
                              <li>
                                <i className="fas fa-badge-check" />
                                Couple Camping
                              </li>
                              <li>
                                <i className="fas fa-badge-check" />
                                Wild Camping
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          {/*=== Activity Image Box ===*/}
                          <div className="activity-image-box">
                            <img
                              src="assets/images/gallery/activity.jpg"
                              className="radius-12"
                              alt="Image"
                            />
                          </div>
                        </div>
                      </div>
                    </Tab.Pane>
                    {/*=== Tab Pane ===*/}
                    <Tab.Pane className="tab-pane fade" eventKey="tab4">
                      <div className="row align-items-center">
                        <div className="col-md-6">
                          {/*=== Activity Content Box ===*/}
                          <div className="activity-content-box pl-lg-40">
                            <div className="icon">
                              <i className="flaticon-camp" />
                            </div>
                            <h3 className="title">
                              Real Adventure &amp; Enjoy Your Dream Tours
                            </h3>
                            <p>
                              Sit amet consectetur velit integer tincidunt
                              scelerisque. Sodales volutpat neque fermeny
                              malesuada scelerisque massa lacus
                            </p>
                            <ul className="check-list">
                              <li>
                                <i className="fas fa-badge-check" />
                                Family Camping
                              </li>
                              <li>
                                <i className="fas fa-badge-check" />
                                Couple Camping
                              </li>
                              <li>
                                <i className="fas fa-badge-check" />
                                Wild Camping
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          {/*=== Activity Image Box ===*/}
                          <div className="activity-image-box">
                            <img
                              src="assets/images/gallery/activity.jpg"
                              className="radius-12"
                              alt="Image"
                            />
                          </div>
                        </div>
                      </div>
                    </Tab.Pane>
                    {/*=== Tab Pane ===*/}
                    <Tab.Pane className="tab-pane fade" eventKey="tab5">
                      <div className="row align-items-center">
                        <div className="col-md-6">
                          {/*=== Activity Content Box ===*/}
                          <div className="activity-content-box pl-lg-40">
                            <div className="icon">
                              <i className="flaticon-camp" />
                            </div>
                            <h3 className="title">
                              Real Adventure &amp; Enjoy Your Dream Tours
                            </h3>
                            <p>
                              Sit amet consectetur velit integer tincidunt
                              scelerisque. Sodales volutpat neque fermeny
                              malesuada scelerisque massa lacus
                            </p>
                            <ul className="check-list">
                              <li>
                                <i className="fas fa-badge-check" />
                                Family Camping
                              </li>
                              <li>
                                <i className="fas fa-badge-check" />
                                Couple Camping
                              </li>
                              <li>
                                <i className="fas fa-badge-check" />
                                Wild Camping
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          {/*=== Activity Image Box ===*/}
                          <div className="activity-image-box">
                            <img
                              src="assets/images/gallery/activity.jpg"
                              className="radius-12"
                              alt="Image"
                            />
                          </div>
                        </div>
                      </div>
                    </Tab.Pane>
                    {/*=== Tab Pane ===*/}
                    <Tab.Pane className="tab-pane fade" eventKey="tab6">
                      <div className="row align-items-center">
                        <div className="col-md-6">
                          {/*=== Activity Cotent Box ===*/}
                          <div className="activity-content-box pl-lg-40">
                            <div className="icon">
                              <i className="flaticon-camp" />
                            </div>
                            <h3 className="title">
                              Real Adventure &amp; Enjoy Your Dream Tours
                            </h3>
                            <p>
                              Sit amet consectetur velit integer tincidunt
                              scelerisque. Sodales volutpat neque fermeny
                              malesuada scelerisque massa lacus
                            </p>
                            <ul className="check-list">
                              <li>
                                <i className="fas fa-badge-check" />
                                Family Camping
                              </li>
                              <li>
                                <i className="fas fa-badge-check" />
                                Couple Camping
                              </li>
                              <li>
                                <i className="fas fa-badge-check" />
                                Wild Camping
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          {/*=== Activity Image ===*/}
                          <div className="activity-image-box">
                            <img
                              src="assets/images/gallery/activity.jpg"
                              className="radius-12"
                              alt="Image"
                            />
                          </div>
                        </div>
                      </div>
                    </Tab.Pane>
                  </Tab.Content>
                </div>
              </div>
            </Tab.Container>
          </div>
        </div>
      </section>
      {/*====== End Activity Section ======*/}
      {/*====== Start Services Section ======*/}
      <section className="services-seciton pt-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-8 col-lg-10">
              {/*=== Section Title ===*/}
              <div className="section-title text-center mb-60 wow fadeInDown">
                <span className="sub-title">Popular Services</span>
                <h2>Amazing Adventure Camping Services for Enjoyed</h2>
              </div>
            </div>
          </div>
          <Slider
            {...sliderActive3Item}
            className="slider-active-3-item wow fadeInUp"
          >
            {/*=== Single Service Item ===*/}
            <div className="single-service-item mb-40">
              <div className="content">
                <h3 className="title">
                  <Link legacyBehavior href="/tour-details">
                    <a>Classic Tents</a>
                  </Link>
                </h3>
                <p>
                  Sit amet consecteturauris natoque name pellentue augue mattis
                  faucibus
                </p>
                <div className="meta">
                  <span className="icon">
                    <i className="flaticon-blanket" />
                  </span>
                  <span className="icon">
                    <i className="flaticon-cat" />
                  </span>
                  <span className="icon">
                    <i className="flaticon-tent" />
                  </span>
                  <span className="icon">
                    <i className="flaticon-fire" />
                  </span>
                </div>
                <a href="#" className="icon-btn">
                  <i className="far fa-arrow-right" />
                </a>
              </div>
              <div className="img-holder">
                <img
                  src="assets/images/service/service-1.jpg"
                  alt="Service Image"
                />
              </div>
            </div>
            {/*=== Single Service Item ===*/}
            <div className="single-service-item mb-40">
              <div className="content">
                <h3 className="title">
                  <Link legacyBehavior href="/tour-details">
                    Glamping Cabin
                  </Link>
                </h3>
                <p>
                  Sit amet consecteturauris natoque name pellentue augue mattis
                  faucibus
                </p>
                <div className="meta">
                  <span className="icon">
                    <i className="flaticon-blanket" />
                  </span>
                  <span className="icon">
                    <i className="flaticon-cat" />
                  </span>
                  <span className="icon">
                    <i className="flaticon-tent" />
                  </span>
                  <span className="icon">
                    <i className="flaticon-fire" />
                  </span>
                </div>
                <a href="#" className="icon-btn">
                  <i className="far fa-arrow-right" />
                </a>
              </div>
              <div className="img-holder">
                <img
                  src="assets/images/service/service-2.jpg"
                  alt="Service Image"
                />
              </div>
            </div>
            {/*=== Single Service Item ===*/}
            <div className="single-service-item mb-40">
              <div className="content">
                <h3 className="title">
                  <Link legacyBehavior href="/tour-details">
                    RV Luxury Tent
                  </Link>
                </h3>
                <p>
                  Sit amet consecteturauris natoque name pellentue augue mattis
                  faucibus
                </p>
                <div className="meta">
                  <span className="icon">
                    <i className="flaticon-blanket" />
                  </span>
                  <span className="icon">
                    <i className="flaticon-cat" />
                  </span>
                  <span className="icon">
                    <i className="flaticon-tent" />
                  </span>
                  <span className="icon">
                    <i className="flaticon-fire" />
                  </span>
                </div>
                <a href="#" className="icon-btn">
                  <i className="far fa-arrow-right" />
                </a>
              </div>
              <div className="img-holder">
                <img
                  src="assets/images/service/service-3.jpg"
                  alt="Service Image"
                />
              </div>
            </div>
            {/*=== Single Service Item ===*/}
            <div className="single-service-item mb-40">
              <div className="content">
                <h3 className="title">
                  <Link legacyBehavior href="/tour-details">
                    RV Luxury Tent
                  </Link>
                </h3>
                <p>
                  Sit amet consecteturauris natoque name pellentue augue mattis
                  faucibus
                </p>
                <div className="meta">
                  <span className="icon">
                    <i className="flaticon-blanket" />
                  </span>
                  <span className="icon">
                    <i className="flaticon-cat" />
                  </span>
                  <span className="icon">
                    <i className="flaticon-tent" />
                  </span>
                  <span className="icon">
                    <i className="flaticon-fire" />
                  </span>
                </div>
                <a href="#" className="icon-btn">
                  <i className="far fa-arrow-right" />
                </a>
              </div>
              <div className="img-holder">
                <img
                  src="assets/images/service/service-2.jpg"
                  alt="Service Image"
                />
              </div>
            </div>
          </Slider>
        </div>
      </section>
      {/*====== End Services Section ======*/}
      {/*====== Start Features Section ======*/}
      <section className="features-section pb-60">
        <div className="container">
          <div className="row">
            <div className="col-xl-4 col-lg-6 col-md-12">
              {/*=== Fancy Icon Box ===*/}
              <div className="fancy-icon-box mb-30 wow fadeInUp">
                <div className="icon">
                  <i className="flaticon-rabbit" />
                </div>
                <div className="text">
                  <h4 className="title">Best Security</h4>
                  <p>
                    we denounce with righteous indignation and dislike men who
                    are so beguiled
                  </p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 col-md-12">
              {/*=== Fancy Icon Box ===*/}
              <div className="fancy-icon-box mb-30 wow fadeInUp">
                <div className="icon">
                  <i className="flaticon-wifi-router" />
                </div>
                <div className="text">
                  <h4 className="title">Free Internet</h4>
                  <p>
                    we denounce with righteous indignation and dislike men who
                    are so beguiled
                  </p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 col-md-12">
              {/*=== Fancy Icon Box ===*/}
              <div className="fancy-icon-box mb-30 wow fadeInUp">
                <div className="icon">
                  <i className="flaticon-solar-energy" />
                </div>
                <div className="text">
                  <h4 className="title">Solar Energy</h4>
                  <p>
                    we denounce with righteous indignation and dislike men who
                    are so beguiled
                  </p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 col-md-12">
              {/*=== Fancy Icon Box ===*/}
              <div className="fancy-icon-box mb-30 wow fadeInUp">
                <div className="icon">
                  <i className="flaticon-cycling" />
                </div>
                <div className="text">
                  <h4 className="title">Mountain Biking</h4>
                  <p>
                    we denounce with righteous indignation and dislike men who
                    are so beguiled
                  </p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 col-md-12">
              {/*=== Fancy Icon Box ===*/}
              <div className="fancy-icon-box mb-30 wow fadeInUp">
                <div className="icon">
                  <i className="flaticon-fishing" />
                </div>
                <div className="text">
                  <h4 className="title">Swimming &amp; Fishing </h4>
                  <p>
                    we denounce with righteous indignation and dislike men who
                    are so beguiled
                  </p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 col-md-12">
              {/*=== Fancy Icon Box ===*/}
              <div className="fancy-icon-box mb-30 wow fadeInUp">
                <div className="icon">
                  <i className="flaticon-gym" />
                </div>
                <div className="text">
                  <h4 className="title">GYM and Yoga</h4>
                  <p>
                    we denounce with righteous indignation and dislike men who
                    are so beguiled
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*====== End Features Section ======*/}
      {/*====== Start CTA Section ======*/}
      <section
        className="cta-bg overlay bg_cover pt-140 pb-150"
        style={{ backgroundImage: "url(assets/images/bg/cta-bg.jpg)" }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-8">
              {/*=== CTA Content Box ===*/}
              <div className="cta-content-box text-center text-white wow fadeInDown">
                <h2 className="mb-35">
                  Ready to Travel With Real Adventure and Enjoy Natural
                </h2>
                <Link legacyBehavior href="/about">
                  <a className="main-btn primary-btn">
                    Check Availability
                    <i className="far fa-paper-plane" />
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*====== End CTA Section ======*/}
      {/*====== Start Fact Section ======*/}
      <section className="fact-section pt-100">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-sm-6">
              {/*=== Counter Item ===*/}
              <div className="single-counter-item text-center mb-40 wow fadeInUp">
                <div className="icon">
                  <i className="flaticon-journey" />
                </div>
                <h2 className="number">
                  <Counter end={8453} />+
                </h2>
                <p>Happy Traveler</p>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              {/*=== Counter Item ===*/}
              <div className="single-counter-item text-center mb-40 wow fadeInDown">
                <div className="icon">
                  <i className="flaticon-tent-1" />
                </div>
                <h2 className="number">
                  <Counter end={3568} />+
                </h2>
                <p>Tent Sites</p>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              {/*=== Counter Item ===*/}
              <div className="single-counter-item text-center mb-40 wow fadeInUp">
                <div className="icon">
                  <i className="flaticon-reviews" />
                </div>
                <h2 className="number">
                  <Counter end={99.3} decimals={1} />%
                </h2>
                <p>Positive Reviews</p>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              {/*=== Counter Item ===*/}
              <div className="single-counter-item text-center mb-40 wow fadeInDown">
                <div className="icon">
                  <i className="flaticon-award" />
                </div>
                <h2 className="number">
                  <Counter end={63} />K
                </h2>
                <p>Awards Winning</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*====== End Fact Section ======*/}
      {/*====== Start Testimonial Section ======*/}
      <section className="testimonial-section pt-60">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-8">
              {/*=== Section Title ===*/}
              <div className="section-title text-center mb-50 wow fadeInDown">
                <span className="sub-title">Testimonials</span>
                <h2>What Our Traveler Say About Our Tour Services</h2>
              </div>
            </div>
          </div>
          <div className="row align-items-xl-center">
            <div className="col-xl-5 col-lg-12 order-2 order-xl-1">
              {/*=== Testimonial Image ===*/}
              <div className="testimonial-one_image-box mb-40 wow fadeInLeft">
                <img
                  src="assets/images/testimonial/testimonial-1.jpg"
                  alt="Testimonial Image"
                />
              </div>
            </div>
            <div className="col-xl-7 col-lg-12 order-1 order-xl-2">
              {/*=== Testimonial Slider ===*/}
              <Slider
                {...testimonialSliderOne}
                className="testimonial-slider-one pl-lg-55 mb-40 wow fadeInRight"
              >
                {/*=== Testimonial Item ===*/}
                <div className="gw-testimonial-item">
                  <div className="testimonial-inner-content">
                    <div className="quote-rating-box">
                      <div className="icon">
                        <img
                          src="assets/images/testimonial/quote.png"
                          alt="quote icon"
                        />
                      </div>
                      <div className="ratings-box">
                        <h4>Quality Services</h4>
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
                    <p>
                      To take a trivial example which of usev undertakes
                      laborious physical exercise excepto obtain advantage from
                      has any right to find fault with man who chooses to enjoy
                    </p>
                    <div className="author-thumb-title">
                      <div className="author-thumb">
                        <img
                          src="assets/images/testimonial/author-1.jpg"
                          alt="Author Image"
                        />
                      </div>
                      <div className="author-title">
                        <h3 className="title">Douglas D. Hall</h3>
                        <p className="position">CEO &amp; Founder</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/*=== Testimonial Item ===*/}
                <div className="gw-testimonial-item">
                  <div className="testimonial-inner-content">
                    <div className="quote-rating-box">
                      <div className="icon">
                        <img
                          src="assets/images/testimonial/quote.png"
                          alt="quote icon"
                        />
                      </div>
                      <div className="ratings-box">
                        <h4>Quality Services</h4>
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
                    <p>
                      To take a trivial example which of usev undertakes
                      laborious physical exercise excepto obtain advantage from
                      has any right to find fault with man who chooses to enjoy
                    </p>
                    <div className="author-thumb-title">
                      <div className="author-thumb">
                        <img
                          src="assets/images/testimonial/author-1.jpg"
                          alt="Author Image"
                        />
                      </div>
                      <div className="author-title">
                        <h3 className="title">Douglas D. Hall</h3>
                        <p className="position">CEO &amp; Founder</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/*=== Testimonial Item ===*/}
                <div className="gw-testimonial-item">
                  <div className="testimonial-inner-content">
                    <div className="quote-rating-box">
                      <div className="icon">
                        <img
                          src="assets/images/testimonial/quote.png"
                          alt="quote icon"
                        />
                      </div>
                      <div className="ratings-box">
                        <h4>Quality Services</h4>
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
                    <p>
                      To take a trivial example which of usev undertakes
                      laborious physical exercise excepto obtain advantage from
                      has any right to find fault with man who chooses to enjoy
                    </p>
                    <div className="author-thumb-title">
                      <div className="author-thumb">
                        <img
                          src="assets/images/testimonial/author-1.jpg"
                          alt="Author Image"
                        />
                      </div>
                      <div className="author-title">
                        <h3 className="title">Douglas D. Hall</h3>
                        <p className="position">CEO &amp; Founder</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Slider>
            </div>
          </div>
        </div>
      </section>
      {/*====== End Testimonial Section ======*/}
      {/*====== Start Blog Section ======*/}
      <section className="blog-section pt-60 pb-60">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-6">
              {/*=== Section Title ===*/}
              <div className="section-title text-center mb-45 wow fadeInDown">
                <span className="sub-title">News &amp; Blog</span>
                <h2>Amazing News &amp; Blog For Every Single Update</h2>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-4 col-md-6 col-sm-12">
              {/*=== Single Blog Post ===*/}
              <div className="single-blog-post mb-40 wow fadeInUp">
                <div className="post-thumbnail">
                  <img src="assets/images/blog/blog-1.jpg" alt="Post Image" />
                </div>
                <div className="entry-content">
                  <a href="#" className="cat-btn">
                    Adventure
                  </a>
                  <div className="post-meta">
                    <span>
                      <i className="far fa-calendar-alt" />
                      <a href="#">November 15, 2022</a>
                    </span>
                  </div>
                  <h3 className="title">
                    <Link legacyBehavior href="/blog-details">
                      Meet Skeleton Svelte Taile Was Sind For Reactive UIs
                    </Link>
                  </h3>
                  <Link legacyBehavior href="/blog-details">
                    <a className="main-btn filled-btn">
                      Read More
                      <i className="far fa-paper-plane" />
                    </a>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12">
              {/*=== Single Blog Post ===*/}
              <div className="single-blog-post mb-40 wow fadeInUp">
                <div className="post-thumbnail">
                  <img src="assets/images/blog/blog-2.jpg" alt="Post Image" />
                </div>
                <div className="entry-content">
                  <a href="#" className="cat-btn">
                    Adventure
                  </a>
                  <div className="post-meta">
                    <span>
                      <i className="far fa-calendar-alt" />
                      <a href="#">November 15, 2022</a>
                    </span>
                  </div>
                  <h3 className="title">
                    <Link legacyBehavior href="/blog-details">
                      Web Vitals Tools Boost Your to Sen Performance Scores
                    </Link>
                  </h3>
                  <Link legacyBehavior href="/blog-details">
                    <a className="main-btn filled-btn">
                      Read More
                      <i className="far fa-paper-plane" />
                    </a>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12">
              {/*=== Single Blog Post ===*/}
              <div className="single-blog-post mb-40 wow fadeInUp">
                <div className="post-thumbnail">
                  <img src="assets/images/blog/blog-3.jpg" alt="Post Image" />
                </div>
                <div className="entry-content">
                  <a href="#" className="cat-btn">
                    Adventure
                  </a>
                  <div className="post-meta">
                    <span>
                      <i className="far fa-calendar-alt" />
                      <a href="#">November 15, 2022</a>
                    </span>
                  </div>
                  <h3 className="title">
                    <Link legacyBehavior href="/blog-details">
                      Smashing Podcast Episode See With Paul Billion-Dollar Idea
                    </Link>
                  </h3>
                  <Link legacyBehavior href="/blog-details">
                    <a className="main-btn filled-btn">
                      Read More
                      <i className="far fa-paper-plane" />
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*====== End Blog Section ======*/}
      {/*====== Start Gallery Section ======*/}
      <GallerySection />
      {/*====== End Gallery Section ======*/}
      <footer className="main-footer black-bg pt-230">
        <div className="container">
          {/*=== Footer Top ===*/}
          <div className="footer-top pt-40 wow fadeInUp">
            <div className="row">
              <div className="col-lg-3 col-sm-6">
                {/*=== Single Info Item ===*/}
                <div className="single-info-item mb-40">
                  <div className="icon">
                    <i className="far fa-map-marker-alt" />
                  </div>
                  <div className="info">
                    <span className="title">Location</span>
                    <p>55 Main Street, Australia</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-sm-6">
                {/*=== Single Info Item ===*/}
                <div className="single-info-item mb-40">
                  <div className="icon">
                    <i className="far fa-envelope-open" />
                  </div>
                  <div className="info">
                    <span className="title">Email</span>
                    <p>
                      <a href="mailto:support@gmail.com">support@gmail.com</a>
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-sm-6">
                {/*=== Single Info Item ===*/}
                <div className="single-info-item mb-40">
                  <div className="icon">
                    <i className="far fa-map-marker-alt" />
                  </div>
                  <div className="info">
                    <span className="title">Hotline</span>
                    <p>
                      <a href="tel:+000(123)456898">+000 (123) 456 898</a>
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-sm-6">
                {/*=== Social Box ===*/}
                <div className="social-box mb-40 float-lg-end">
                  <ul className="social-link">
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
                        <i className="fab fa-linkedin-in" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {/*=== Footer Widget ===*/}
          <div className="footer-widget-area pt-75 pb-30">
            <div className="row">
              <div className="col-lg-3 col-md-6">
                {/*=== Footer Widget ===*/}
                <div className="footer-widget about-company-widget mb-40 wow fadeInUp">
                  <h4 className="widget-title">About</h4>
                  <div className="footer-content">
                    <p>
                      To take trivial example which us ever undertakes laborious
                      physica exercise except obsome
                    </p>
                    <a href="#" className="footer-logo">
                      <img
                        src="assets/images/logo/logo-white.png"
                        alt="Site Logo"
                      />
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-lg-5 col-md-6">
                {/*=== Footer Widget ===*/}
                <div className="footer-widget service-nav-widget mb-40 pl-lg-70 wow fadeInDown">
                  <h4 className="widget-title">Services</h4>
                  <div className="footer-content">
                    <ul className="footer-widget-nav">
                      <li>
                        <a href="#">Caravan Soler Tent</a>
                      </li>
                      <li>
                        <a href="#">Family Tent Camping</a>
                      </li>
                      <li>
                        <a href="#">Classic Tent Camping</a>
                      </li>
                      <li>
                        <a href="#">Wild Tent Camping</a>
                      </li>
                      <li>
                        <a href="#">Small Cabin Wood</a>
                      </li>
                    </ul>
                    <ul className="footer-widget-nav">
                      <li>
                        <a href="#">Need a Career ?</a>
                      </li>
                      <li>
                        <a href="#">Latest News &amp; Blog</a>
                      </li>
                      <li>
                        <a href="#">Core Features</a>
                      </li>
                      <li>
                        <a href="#">Meet Our teams</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                {/*=== Footer Widget ===*/}
                <div className="footer-widget footer-newsletter-widget mb-40 pl-lg-100 wow fadeInUp">
                  <h4 className="widget-title">Newsletter</h4>
                  <div className="footer-content">
                    <p>
                      Which of us ever undertake laborious physical exercise
                      except obtain
                    </p>
                    <form>
                      <div className="form_group">
                        <label>
                          <i className="far fa-paper-plane" />
                        </label>
                        <input
                          type="email"
                          className="form_control"
                          placeholder="Email Address"
                          name="email"
                          required
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*=== Footer Copyright ===*/}
          <div className="footer-copyright">
            <div className="row">
              <div className="col-lg-6">
                {/*=== Footer Text ===*/}
                <div className="footer-text">
                  <p>
                    Copy@ 2023 <span style={{ color: "#F7921E" }}>GoWilds</span>
                    , All Right Reserved
                  </p>
                </div>
              </div>
              <div className="col-lg-6">
                {/*=== Footer Nav ===*/}
                <div className="footer-nav float-lg-end">
                  <ul>
                    <li>
                      <a href="#">Setting &amp; privacy</a>
                    </li>
                    <li>
                      <a href="#">Faqs</a>
                    </li>
                    <li>
                      <a href="#">Support</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </Layout>
  );
};
export default Index;
