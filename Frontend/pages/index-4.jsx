import Layout from "@/src/layout/Layout";
import {
  partnerSliderOne,
  sliderActive3Item,
  sliderActive5Item,
  testimonialSliderOne,
} from "@/src/sliderProps";
import dynamic from "next/dynamic";
import Link from "next/link";
import Slider from "react-slick";
const Counter = dynamic(() => import("@/src/components/Counter"), {
  ssr: false,
});
const Index4 = () => {
  return (
    <Layout header={4}>
      {/*====== Start Hero Section ======*/}
      <section className="hero-section">
        {/*=== Hero Wrapper ===*/}
        <div className="hero-wrapper-four">
          <div className="shape">
            <span>
              <img src="assets/images/hero/map.png" alt />
            </span>
          </div>
          <div className="container">
            <div className="row">
              <div className="col-xl-7">
                {/*=== Hero Content ===*/}
                <div className="hero-content">
                  <span className="sub-title wow fadeInUp" data-wow-delay=".3s">
                    Welcome to GoWilds
                  </span>
                  <h1 className="wow fadeInDown" data-wow-delay=".5s">
                    Explore Dream Tour &amp; Travels
                  </h1>
                  <p className="wow fadeInUp" data-wow-delay=".6s">
                    Sit amet consectetur integer tincidunt sceleries nolesry
                    volutpat fermentum malesuada scelequecy leocras odio blandit
                    rhoncus eues feugiat
                  </p>
                  {/*=== Hero Search ===*/}
                  <div
                    className="hero-search-form mb-40 wow fadeInDown"
                    data-wow-delay=".7s"
                  >
                    <form className="booking-form-two">
                      <div className="form_group">
                        <span>Check In</span>
                        <input
                          type="date"
                          className="form_control datepicker"
                          placeholder="Check In"
                        />
                      </div>
                      <div className="form_group">
                        <span>Check Out</span>
                        <input
                          type="date"
                          className="form_control datepicker"
                          placeholder="Check Out"
                        />
                      </div>
                      <div className="form_group">
                        <span>Guest</span>
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
                      <div className="form_group">
                        <span>Accommodations</span>
                        <select className="wide">
                          <option value={1}>Classic Tent</option>
                          <option value={1}>Forest Camping</option>
                          <option value={1}>Small Trailer</option>
                          <option value={1}>Tree House Tent</option>
                          <option value={1}>Tent Camping</option>
                          <option value={1}>Couple Tent</option>
                        </select>
                      </div>
                      <div className="form_group">
                        <button className="booking-btn">
                          Check Availability{" "}
                          <i className="far fa-angle-double-right" />
                        </button>
                      </div>
                    </form>
                  </div>
                  <div
                    className="avatar-box wow fadeInUp"
                    data-wow-delay=".75s"
                  >
                    <img src="assets/images/about/avater.png" alt />
                    <span>35+ People booked their dream place</span>
                  </div>
                </div>
              </div>
              <div className="col-xl-5 d-xl-block d-none">
                <div
                  className="hero-image wow fadeInRight"
                  data-wow-delay=".8s"
                >
                  <img
                    src="assets/images/hero/hero-four_img-1.jpg"
                    alt="hero image"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*====== End Hero Section ======*/}
      {/*====== Start Features Section ======*/}
      <section className="features-section gray-bg pt-100 pb-100">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="section-title mb-55 wow fadeInLeft">
                <span className="sub-title">What We Provide</span>
                <h2>Most Funning Company Travel and Tours</h2>
              </div>
            </div>
            <div className="col-lg-6">
              {/*=== Features Content Box ===*/}
              <div className="features-content-box pl-lg-70 wow fadeInRight">
                <p className="mb-25">
                  Sit amet consectetue integer eu tincidunt scelerisque. Sodales
                  volutpat neque fermentum alesuada scelerisque massa.
                </p>
                <div className="row justify-content-center">
                  <div className="col-sm-4 col-6">
                    {/*=== Counter Item ===*/}
                    <div className="counter-item mb-55">
                      <h2 className="number">
                        <Counter end={356} />+
                      </h2>
                      <p>Happy Traveler</p>
                    </div>
                  </div>
                  <div className="col-sm-4 col-6">
                    {/*=== Counter Item ===*/}
                    <div className="counter-item mb-55">
                      <h2 className="number">
                        <Counter end={852} />+
                      </h2>
                      <p>Tent Sites</p>
                    </div>
                  </div>
                  <div className="col-sm-4 col-6">
                    {/*=== Counter Item ===*/}
                    <div className="counter-item mb-55">
                      <h2 className="number">
                        <Counter end={99} />%
                      </h2>
                      <p>Positive Reviews</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*=== Features Slider ===*/}
          <Slider
            {...sliderActive5Item}
            className="slider-active-5-item wow fadeInUp"
          >
            {/*=== Features Item ===*/}
            <div className="single-features-item-three">
              <div className="img-holder">
                <img
                  src="assets/images/features/feat-10.jpg"
                  alt="Features Image"
                />
              </div>
              <div className="content">
                <h6>Wadi Musa, Ma'an Governorate, Jordan</h6>
              </div>
            </div>
            {/*=== Features Item ===*/}
            <div className="single-features-item-three">
              <div className="img-holder">
                <img
                  src="assets/images/features/feat-11.jpg"
                  alt="Features Image"
                />
              </div>
              <div className="content">
                <h6>Tambon Ko Kut, จ.ตราด, Thailand</h6>
              </div>
            </div>
            {/*=== Features Item ===*/}
            <div className="single-features-item-three">
              <div className="img-holder">
                <img
                  src="assets/images/features/feat-12.jpg"
                  alt="Features Image"
                />
              </div>
              <div className="content">
                <h6>Camper Trailer, New York</h6>
              </div>
            </div>
            {/*=== Features Item ===*/}
            <div className="single-features-item-three">
              <div className="img-holder">
                <img
                  src="assets/images/features/feat-13.jpg"
                  alt="Features Image"
                />
              </div>
              <div className="content">
                <h6>Wadi Musa, Ma'an Governorate, Jordan</h6>
              </div>
            </div>
            {/*=== Features Item ===*/}
            <div className="single-features-item-three">
              <div className="img-holder">
                <img
                  src="assets/images/features/feat-14.jpg"
                  alt="Features Image"
                />
              </div>
              <div className="content">
                <h6>Forest Tent Camping, South Africa</h6>
              </div>
            </div>
            {/*=== Features Item ===*/}
            <div className="single-features-item-three">
              <div className="img-holder">
                <img
                  src="assets/images/features/feat-12.jpg"
                  alt="Features Image"
                />
              </div>
              <div className="content">
                <h6>Camper Trailer, New York</h6>
              </div>
            </div>
          </Slider>
        </div>
      </section>
      {/*====== End Features Section ======*/}
      {/*=== Start What We Section ===*/}
      <section className="who-we-section pt-100 pb-50">
        <div className="container">
          <div className="row align-items-xl-center">
            <div className="col-xl-5 order-2 order-xl-1">
              {/*=== We Image Box ===*/}
              <div className="we-image-box text-center text-xl-left pr-lg-30 mb-50 wow fadeInLeft">
                <img
                  src="assets/images/gallery/we-6.jpg"
                  className="radius-top-left-right-288"
                  alt="What We Image"
                />
              </div>
            </div>
            <div className="col-xl-7 order-1 order-xl-2">
              {/*=== We Content Box ===*/}
              <div className="we-contnet-box mb-20 wow fadeInRight">
                {/*=== Section Title ===*/}
                <div className="section-title mb-45">
                  <span className="sub-title">Who We Are</span>
                  <h2>Great Opportunity For Adventure &amp; Travels</h2>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    {/*=== Fancy Icon Box ===*/}
                    <div className="fancy-icon-box-three mb-30">
                      <div className="icon">
                        <i className="flaticon-camping" />
                      </div>
                      <div className="text">
                        <h5 className="title">Tent Camping</h5>
                        <a href="#" className="btn-link">
                          Read More <i className="far fa-long-arrow-right" />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    {/*=== Fancy Icon Box ===*/}
                    <div className="fancy-icon-box-three mb-30">
                      <div className="icon">
                        <i className="flaticon-biking-mountain" />
                      </div>
                      <div className="text">
                        <h5 className="title">Mountain Biking</h5>
                        <a href="#" className="btn-link">
                          Read More <i className="far fa-long-arrow-right" />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    {/*=== Fancy Icon Box ===*/}
                    <div className="fancy-icon-box-three mb-30">
                      <div className="icon">
                        <i className="flaticon-fishing-2" />
                      </div>
                      <div className="text">
                        <h5 className="title">Fishing &amp; Boat</h5>
                        <a href="#" className="btn-link">
                          Read More <i className="far fa-long-arrow-right" />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    {/*=== Fancy Icon Box ===*/}
                    <div className="fancy-icon-box-three mb-30">
                      <div className="icon">
                        <i className="flaticon-caravan" />
                      </div>
                      <div className="text">
                        <h5 className="title">Camping Trailer</h5>
                        <a href="#" className="btn-link">
                          Read More <i className="far fa-long-arrow-right" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*=== End What We Section ===*/}
      {/*====== Start Service Section ======*/}
      <section className="service-section-two black-bg pt-100 pb-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-7">
              {/*=== Section Title ===*/}
              <div className="section-title text-center text-white mb-45 wow fadeInDown">
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
            <div className="single-service-item-four">
              <div className="img-holder">
                <img
                  src="assets/images/service/service-7.jpg"
                  alt="Service Image"
                />
              </div>
              <div className="content">
                <a href="#" className="icon-btn">
                  <i className="fas fa-heart" />
                </a>
                <h3 className="title">Classic Tents</h3>
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
                <div className="action-btn">
                  <Link legacyBehavior href="/tour-details">
                    <a className="main-btn primary-btn">
                      Read More
                      <i className="far fa-paper-plane" />
                    </a>
                  </Link>
                </div>
              </div>
            </div>
            {/*=== Single Service Item ===*/}
            <div className="single-service-item-four">
              <div className="img-holder">
                <img
                  src="assets/images/service/service-8.jpg"
                  alt="Service Image"
                />
              </div>
              <div className="content">
                <a href="#" className="icon-btn">
                  <i className="fas fa-heart" />
                </a>
                <h3 className="title">Glamping Cabin</h3>
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
                <div className="action-btn">
                  <Link legacyBehavior href="/tour-details">
                    <a className="main-btn primary-btn">
                      Read More
                      <i className="far fa-paper-plane" />
                    </a>
                  </Link>
                </div>
              </div>
            </div>
            {/*=== Single Service Item ===*/}
            <div className="single-service-item-four">
              <div className="img-holder">
                <img
                  src="assets/images/service/service-9.jpg"
                  alt="Service Image"
                />
              </div>
              <div className="content">
                <a href="#" className="icon-btn">
                  <i className="fas fa-heart" />
                </a>
                <h3 className="title">RV Luxury Tent</h3>
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
                <div className="action-btn">
                  <Link legacyBehavior href="/tour-details">
                    <a className="main-btn primary-btn">
                      Read More
                      <i className="far fa-paper-plane" />
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </Slider>
          {/*=== Text Box ===*/}
          <div className="big-text pt-100 wow fadeInDown">
            <img src="assets/images/bg/adventure.png" alt="Adventure" />
          </div>
        </div>
      </section>
      {/*====== End Service Section ======*/}
      {/*====== Start Places Section ======*/}
      <section className="places-section pt-100 pb-70">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-7">
              {/*=== Section Title ===*/}
              <div className="section-title text-center mb-50 wow fadeInDown">
                <span className="sub-title">Popular Tour Place</span>
                <h2>Visit &amp; Enjoy Adventure Life With Full Of Dreams</h2>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
              {/*=== Single Place Item Three ===*/}
              <div className="single-place-item-three mb-30 wow fadeInUp">
                <div className="place-img">
                  <img
                    src="assets/images/place/place-20.jpg"
                    alt="Place Image"
                  />
                </div>
                <div className="place-content">
                  <h4 className="title">
                    <Link legacyBehavior href="/tour-details">
                      Hiking Mountains
                    </Link>
                  </h4>
                  <p className="location">
                    <i className="far fa-map-marker-alt" />
                    Arefu, AG, Romania
                  </p>
                  <div className="meta">
                    <span>
                      <i className="far fa-calendar-alt" />
                      25 Feb 2023
                    </span>
                    <a href="#" className="icon-btn">
                      <i className="far fa-arrow-right" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
              {/*=== Single Place Item Three ===*/}
              <div className="single-place-item-three mb-30 wow fadeInUp">
                <div className="place-img">
                  <img
                    src="assets/images/place/place-21.jpg"
                    alt="Place Image"
                  />
                </div>
                <div className="place-content">
                  <h4 className="title">
                    <Link legacyBehavior href="/tour-details">
                      Surfer Riding Wave
                    </Link>
                  </h4>
                  <p className="location">
                    <i className="far fa-map-marker-alt" />
                    Arefu, AG, Romania
                  </p>
                  <div className="meta">
                    <span>
                      <i className="far fa-calendar-alt" />
                      25 Feb 2023
                    </span>
                    <a href="#" className="icon-btn">
                      <i className="far fa-arrow-right" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
              {/*=== Single Place Item Three ===*/}
              <div className="single-place-item-three mb-30 wow fadeInUp">
                <div className="place-img">
                  <img
                    src="assets/images/place/place-22.jpg"
                    alt="Place Image"
                  />
                </div>
                <div className="place-content">
                  <h4 className="title">
                    <Link legacyBehavior href="/tour-details">
                      Tracing Hill On Cloud
                    </Link>
                  </h4>
                  <p className="location">
                    <i className="far fa-map-marker-alt" />
                    Arefu, AG, Romania
                  </p>
                  <div className="meta">
                    <span>
                      <i className="far fa-calendar-alt" />
                      25 Feb 2023
                    </span>
                    <a href="#" className="icon-btn">
                      <i className="far fa-arrow-right" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
              {/*=== Single Place Item Three ===*/}
              <div className="single-place-item-three mb-30 wow fadeInUp">
                <div className="place-img">
                  <img
                    src="assets/images/place/place-23.jpg"
                    alt="Place Image"
                  />
                </div>
                <div className="place-content">
                  <h4 className="title">
                    <Link legacyBehavior href="/tour-details">
                      Hill House On Sea
                    </Link>
                  </h4>
                  <p className="location">
                    <i className="far fa-map-marker-alt" />
                    Gulf of Thailand, Thailand
                  </p>
                  <div className="meta">
                    <span>
                      <i className="far fa-calendar-alt" />
                      25 Feb 2023
                    </span>
                    <a href="#" className="icon-btn">
                      <i className="far fa-arrow-right" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
              {/*=== Single Place Item Three ===*/}
              <div className="single-place-item-three mb-30 wow fadeInUp">
                <div className="place-img">
                  <img
                    src="assets/images/place/place-24.jpg"
                    alt="Place Image"
                  />
                </div>
                <div className="place-content">
                  <h4 className="title">
                    <Link legacyBehavior href="/tour-details">
                      Tent Camping
                    </Link>
                  </h4>
                  <p className="location">
                    <i className="far fa-map-marker-alt" />
                    Wilderness, United States
                  </p>
                  <div className="meta">
                    <span>
                      <i className="far fa-calendar-alt" />
                      25 Feb 2023
                    </span>
                    <a href="#" className="icon-btn">
                      <i className="far fa-arrow-right" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
              {/*=== Single Place Item Three ===*/}
              <div className="single-place-item-three mb-30 wow fadeInUp">
                <div className="place-img">
                  <img
                    src="assets/images/place/place-25.jpg"
                    alt="Place Image"
                  />
                </div>
                <div className="place-content">
                  <h4 className="title">
                    <Link legacyBehavior href="/tour-details">
                      Hiking Mountains
                    </Link>
                  </h4>
                  <p className="location">
                    <i className="far fa-map-marker-alt" />
                    Arefu, AG, Romania
                  </p>
                  <div className="meta">
                    <span>
                      <i className="far fa-calendar-alt" />
                      25 Feb 2023
                    </span>
                    <a href="#" className="icon-btn">
                      <i className="far fa-arrow-right" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
              {/*=== Single Place Item Three ===*/}
              <div className="single-place-item-three mb-30 wow fadeInUp">
                <div className="place-img">
                  <img
                    src="assets/images/place/place-26.jpg"
                    alt="Place Image"
                  />
                </div>
                <div className="place-content">
                  <h4 className="title">
                    <Link legacyBehavior href="/tour-details">
                      Climbing Up The Hills
                    </Link>
                  </h4>
                  <p className="location">
                    <i className="far fa-map-marker-alt" />
                    Arefu, AG, Romania
                  </p>
                  <div className="meta">
                    <span>
                      <i className="far fa-calendar-alt" />
                      25 Feb 2023
                    </span>
                    <a href="#" className="icon-btn">
                      <i className="far fa-arrow-right" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
              {/*=== Single Place Item Three ===*/}
              <div className="single-place-item-three mb-30 wow fadeInUp">
                <div className="place-img">
                  <img
                    src="assets/images/place/place-27.jpg"
                    alt="Place Image"
                  />
                </div>
                <div className="place-content">
                  <h4 className="title">
                    <Link legacyBehavior href="/tour-details">
                      Tracing Hill On Cloud
                    </Link>
                  </h4>
                  <p className="location">
                    <i className="far fa-map-marker-alt" />
                    Nordegg, Canada
                  </p>
                  <div className="meta">
                    <span>
                      <i className="far fa-calendar-alt" />
                      25 Feb 2023
                    </span>
                    <a href="#" className="icon-btn">
                      <i className="far fa-arrow-right" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*====== End Places Section ======*/}
      {/*====== Start Why Choose Section ======*/}
      <section className="why-choose-section gray-bg pt-100 pb-50">
        <div className="container">
          <div className="row align-items-xl-center">
            <div className="col-xl-7">
              {/*=== Choose Content Box ===*/}
              <div className="choose-content-box pr-lg-70">
                {/*=== Section Title ===*/}
                <div className="section-title mb-45 wow fadeInDown">
                  <span className="sub-title">Why Choose Us</span>
                  <h2>People Why Choose Our Travel Adventure</h2>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    {/*=== Fancy Icon Box ===*/}
                    <div className="fancy-icon-box-four mb-45 wow fadeInUp">
                      <div className="icon">
                        <i className="flaticon-rabbit" />
                      </div>
                      <div className="text">
                        <h4 className="title">Best Security</h4>
                        <p>
                          We denounce with righteous indignation and dislike
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    {/*=== Fancy Icon Box ===*/}
                    <div className="fancy-icon-box-four mb-45 wow fadeInUp">
                      <div className="icon">
                        <i className="flaticon-wifi-router" />
                      </div>
                      <div className="text">
                        <h4 className="title">Free Internet</h4>
                        <p>
                          We denounce with righteous indignation and dislike
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    {/*=== Fancy Icon Box ===*/}
                    <div className="fancy-icon-box-four mb-45 wow fadeInUp">
                      <div className="icon">
                        <i className="flaticon-solar-energy" />
                      </div>
                      <div className="text">
                        <h4 className="title">Solar Energy</h4>
                        <p>
                          We denounce with righteous indignation and dislike
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    {/*=== Fancy Icon Box ===*/}
                    <div className="fancy-icon-box-four mb-45 wow fadeInUp">
                      <div className="icon">
                        <i className="flaticon-cycling" />
                      </div>
                      <div className="text">
                        <h4 className="title">Mountain Biking</h4>
                        <p>
                          We denounce with righteous indignation and dislike
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-5">
              {/*=== Experience Box ===*/}
              <div className="experience-box text-center text-xl-right mb-50 wow fadeInRight">
                <img src="assets/images/features/years.png" alt />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*====== End Why Choose Section ======*/}
      {/*====== Start Testimonial Section ======*/}
      <section className="testimonial-section-two pt-100">
        <div className="container">
          <div className="row align-items-xl-center">
            <div className="col-xl-5 order-2 order-xl-1">
              <div className="testimonial-image-box text-xl-left text-center wow fadeInLeft">
                <img
                  src="assets/images/testimonial/testimonial-2.png"
                  alt="Icon Image"
                />
              </div>
            </div>
            <div className="col-xl-7 order-1 order-xl-2">
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
          {/*=== Blog Area ===*/}
          <div className="blog-area pt-60 pb-60">
            <div className="row justify-content-center">
              <div className="col-xl-7">
                <div className="section-title text-center mb-45 wow fadeInDown">
                  <span className="sub-title">News &amp; Blog</span>
                  <h2>Amazing News &amp; Blog For Every Single Update</h2>
                </div>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-lg-4 col-md-6 col-sm-12">
                {/*=== Single Blog Post ===*/}
                <div className="single-blog-post-three mb-40 wow fadeInUp">
                  <div className="post-thumbnail">
                    <img src="assets/images/blog/blog-7.jpg" alt="Blog Image" />
                  </div>
                  <div className="entry-content">
                    <div className="post-meta">
                      <span>
                        <i className="far fa-calendar-alt" />
                        <a href="#">November 15, 2022</a>
                      </span>
                      <h3 className="title">
                        <Link legacyBehavior href="/blog-details">
                          <a>
                            Meet Skeleton Svelte Taile Sind For Reactive UIs
                          </a>
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
              <div className="col-lg-4 col-md-6 col-sm-12">
                {/*=== Single Blog Post ===*/}
                <div className="single-blog-post-three mb-40 wow fadeInDown">
                  <div className="post-thumbnail">
                    <img src="assets/images/blog/blog-8.jpg" alt="Blog Image" />
                  </div>
                  <div className="entry-content">
                    <div className="post-meta">
                      <span>
                        <i className="far fa-calendar-alt" />
                        <a href="#">November 15, 2022</a>
                      </span>
                      <h3 className="title">
                        <Link legacyBehavior href="/blog-details">
                          <a>
                            Meet Skeleton Svelte Taile Sind For Reactive UIs
                          </a>
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
              <div className="col-lg-4 col-md-6 col-sm-12">
                {/*=== Single Blog Post ===*/}
                <div className="single-blog-post-three mb-40 wow fadeInUp">
                  <div className="post-thumbnail">
                    <img src="assets/images/blog/blog-9.jpg" alt="Blog Image" />
                  </div>
                  <div className="entry-content">
                    <div className="post-meta">
                      <span>
                        <i className="far fa-calendar-alt" />
                        <a href="#">November 15, 2022</a>
                      </span>
                      <h3 className="title">
                        <Link legacyBehavior href="/blog-details">
                          <a>
                            Meet Skeleton Svelte Taile Sind For Reactive UIs
                          </a>
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
          </div>
        </div>
      </section>
      {/*====== End Testimonial Section ======*/}
      {/*====== Start Partners Section ======*/}
      <section className="partners-section black-dark-bg">
        <div className="container">
          {/*=== Partners Slider ===*/}
          <Slider
            {...partnerSliderOne}
            className="partner-slider-one pt-80 pb-50 wow fadeInUp"
          >
            {/*=== Partner Item ===*/}
            <div className="single-partner-item">
              <div className="partner-img">
                <a href="#">
                  <img
                    src="assets/images/partner/partner-6.png"
                    alt="Partner Image"
                  />
                </a>
              </div>
            </div>
            {/*=== Partner Item ===*/}
            <div className="single-partner-item">
              <div className="partner-img">
                <a href="#">
                  <img
                    src="assets/images/partner/partner-7.png"
                    alt="Partner Image"
                  />
                </a>
              </div>
            </div>
            {/*=== Partner Item ===*/}
            <div className="single-partner-item">
              <div className="partner-img">
                <a href="#">
                  <img
                    src="assets/images/partner/partner-8.png"
                    alt="Partner Image"
                  />
                </a>
              </div>
            </div>
            {/*=== Partner Item ===*/}
            <div className="single-partner-item">
              <div className="partner-img">
                <a href="#">
                  <img
                    src="assets/images/partner/partner-9.png"
                    alt="Partner Image"
                  />
                </a>
              </div>
            </div>
            {/*=== Partner Item ===*/}
            <div className="single-partner-item">
              <div className="partner-img">
                <a href="#">
                  <img
                    src="assets/images/partner/partner-10.png"
                    alt="Partner Image"
                  />
                </a>
              </div>
            </div>
            {/*=== Partner Item ===*/}
            <div className="single-partner-item">
              <div className="partner-img">
                <a href="#">
                  <img
                    src="assets/images/partner/partner-7.png"
                    alt="Partner Image"
                  />
                </a>
              </div>
            </div>
          </Slider>
        </div>
      </section>
      {/*====== End Partners Section ======*/}
    </Layout>
  );
};
export default Index4;
