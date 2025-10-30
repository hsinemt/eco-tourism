import Home3Slider from "@/src/components/sliders/Home3";
import Layout from "@/src/layout/Layout";
import {
  partnerSliderOne,
  sliderActive3Item,
  sliderActive3ItemDot,
} from "@/src/sliderProps";
import dynamic from "next/dynamic";
import Link from "next/link";
import Slider from "react-slick";
const Counter = dynamic(() => import("@/src/components/Counter"), {
  ssr: false,
});
const Index3 = () => {
  return (
    <Layout header={3} footerBG={"gray"}>
      {/*====== Start Hero Section ======*/}
      <Home3Slider />
      {/*====== End Hero Section ======*/}
      {/*====== Start Features Section ======*/}
      <section className="features-section pt-100 pb-50">
        <div className="container">
          <div className="row align-items-xl-center">
            <div className="col-xl-5">
              {/*=== Features Content Box ===*/}
              <div className="features-content-box pr-lg-70 mb-50">
                {/*=== Section Title ===*/}
                <div className="section-title mb-30">
                  <span className="sub-title">Availability</span>
                  <h2>Explore GoWilds Real Adventure &amp; Travels</h2>
                </div>
                <p className="mb-30">
                  Sit amet consectetur integer tincidunt sceleries noda lesry
                  volutpat neque fermentum malesuada scelequecy leocras odio
                  blandit rhoncus eues feugiat
                </p>
                <a href="#" className="main-btn filled-btn">
                  Learn More
                  <i className="far fa-paper-plane" />
                </a>
              </div>
            </div>
            <div className="col-xl-7">
              <div className="features-item-area mb-20">
                <div className="row pl-lg-70">
                  <div className="col-md-6">
                    {/*=== Fancy Icon Box ===*/}
                    <div className="fancy-icon-box-two mb-30">
                      <div className="icon">
                        <i className="flaticon-camping" />
                      </div>
                      <div className="text">
                        <h3 className="title">Tent Camping</h3>
                        <p>
                          Sit amet consectetur integ tincidunt scelerie nodermen
                          malesuada sceleris massa
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    {/*=== Fancy Icon Box ===*/}
                    <div className="fancy-icon-box-two mb-30">
                      <div className="icon">
                        <i className="flaticon-biking-mountain" />
                      </div>
                      <div className="text">
                        <h3 className="title">Mountain Biking</h3>
                        <p>
                          Sit amet consectetur integ tincidunt scelerie nodermen
                          malesuada sceleris massa
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    {/*=== Fancy Icon Box ===*/}
                    <div className="fancy-icon-box-two mb-30">
                      <div className="icon">
                        <i className="flaticon-fishing-2" />
                      </div>
                      <div className="text">
                        <h3 className="title">Fishing &amp; Boat</h3>
                        <p>
                          Sit amet consectetur integ tincidunt scelerie nodermen
                          malesuada sceleris massa
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    {/*=== Fancy Icon Box ===*/}
                    <div className="fancy-icon-box-two mb-30">
                      <div className="icon">
                        <i className="flaticon-caravan" />
                      </div>
                      <div className="text">
                        <h3 className="title">RV Caravan Tent</h3>
                        <p>
                          Sit amet consectetur integ tincidunt scelerie nodermen
                          malesuada sceleris massa
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*====== End Features Section ======*/}
      {/*====== Start About Section ======*/}
      <section
        className="about-section bg_cover pt-165 pb-210"
        style={{ backgroundImage: "url(assets/images/bg/about-bg-1.jpg)" }}
      >
        <div className="container">
          <div className="row align-items-xl-center">
            <div className="col-lg-6">
              {/*=== About Image Box ===*/}
              <div className="about-image-box mb-50">
                <img
                  src="assets/images/about/about-2.jpg"
                  className="rounded-2"
                  alt="About Image"
                />
              </div>
            </div>
            <div className="col-lg-6">
              {/*=== About Content Box ===*/}
              <div className="about-content-box text-white pl-lg-40 mb-50">
                {/*=== Section Title ===*/}
                <div className="section-title mb-30">
                  <span className="sub-title">About Company</span>
                  <h2>We’re Number 1 Travel Adventure Company</h2>
                </div>
                <p className="mb-30">
                  Sit amet consectetur. Velit integer tincidunt sceleries
                  nodalesry volutpat neque fermentum malesuada sceleris quecy
                  massa lacus Ultrices eget leo cras odio blandit rhoncus eues
                  feugiat
                </p>
                <img src="assets/images/about/avater.png" alt="Avater" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*====== End About Section ======*/}
      {/*====== Start Fun Section ======*/}
      <section className="fun-section">
        <div className="container">
          {/*=== Fun Wrapper ===*/}
          <div
            className="fun-wrapper pt-60 pb-20 bg_cover"
            style={{ backgroundImage: "url(assets/images/bg/map.png)" }}
          >
            <div className="row">
              <div className="col-lg-3 col-sm-6">
                {/*=== Counter Item ===*/}
                <div className="single-counter-item-two mb-30">
                  <div className="inner-counter text-center">
                    <div className="icon">
                      <i className="flaticon-journey" />
                    </div>
                    <div className="content text-white">
                      <h2 className="number">
                        <Counter end={356} />+
                      </h2>
                      <p>Happy Traveler</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-sm-6">
                {/*=== Counter Item ===*/}
                <div className="single-counter-item-two mb-30">
                  <div className="inner-counter text-center">
                    <div className="icon">
                      <i className="flaticon-tent-1" />
                    </div>
                    <div className="content text-white">
                      <h2 className="number">
                        <Counter end={99} />%
                      </h2>
                      <p>Positive Reviews</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-sm-6">
                {/*=== Counter Item ===*/}
                <div className="single-counter-item-two mb-30">
                  <div className="inner-counter text-center">
                    <div className="icon">
                      <i className="flaticon-reviews" />
                    </div>
                    <div className="content text-white">
                      <h2 className="number">
                        <Counter end={99} />%
                      </h2>
                      <p>Positive Reviews</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-sm-6">
                {/*=== Counter Item ===*/}
                <div className="single-counter-item-two mb-30">
                  <div className="inner-counter text-center">
                    <div className="icon">
                      <i className="flaticon-award" />
                    </div>
                    <div className="content text-white">
                      <h2 className="number">
                        <Counter end={24} />
                        K+
                      </h2>
                      <p>Awards Winning</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*====== End Fun Section ======*/}
      {/*====== Start Service Section ======*/}
      <section className="service-section pt-100 pb-60">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-7">
              {/*=== Section Title ===*/}
              <div className="section-title text-center mb-50">
                <span className="sub-title">Popular Services</span>
                <h2>Amazing Adventure Camping Services for Enjoyed</h2>
              </div>
            </div>
          </div>
          <Slider {...sliderActive3Item} className="slider-active-3-item">
            {/*=== Service Item ===*/}
            <div className="single-service-item-three mb-40">
              <div className="content">
                <h3 className="title">
                  <a href="#">Classic Tents</a>
                </h3>
                <p>
                  Sit amet consecteturauris natoque name pellentue augue mattis
                  faucibus
                </p>
                <img
                  src="assets/images/service/service-4.jpg"
                  alt="service image"
                />
                <a href="#" className="btn-link">
                  Read More
                  <i className="far fa-long-arrow-right" />
                </a>
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
                  <span className="rate">
                    <i className="fas fa-star" />
                    4.9
                  </span>
                </div>
              </div>
            </div>
            {/*=== Service Item ===*/}
            <div className="single-service-item-three mb-40">
              <div className="content">
                <h3 className="title">
                  <a href="#">Caravan Solar Tent</a>
                </h3>
                <p>
                  We denounce with righteous indignation and beguiled and
                  demoralized
                </p>
                <img
                  src="assets/images/service/service-5.jpg"
                  alt="service image"
                />
                <a href="#" className="btn-link">
                  Read More
                  <i className="far fa-long-arrow-right" />
                </a>
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
                  <span className="rate">
                    <i className="fas fa-star" />
                    4.9
                  </span>
                </div>
              </div>
            </div>
            {/*=== Service Item ===*/}
            <div className="single-service-item-three mb-40">
              <div className="content">
                <h3 className="title">
                  <Link legacyBehavior href="/tour-details">
                    <a>Small Cabin Wood</a>
                  </Link>
                </h3>
                <p>
                  To take trivial example which undertakes laborious physical
                  exercise chooses
                </p>
                <img
                  src="assets/images/service/service-6.jpg"
                  alt="service image"
                />
                <a href="#" className="btn-link">
                  Read More
                  <i className="far fa-long-arrow-right" />
                </a>
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
                  <span className="rate">
                    <i className="fas fa-star" />
                    4.9
                  </span>
                </div>
              </div>
            </div>
          </Slider>
        </div>
      </section>
      {/*====== End Service Section ======*/}
      {/*====== Start CTA Section ======*/}
      <section
        className="cta-bg overlay bg_cover pt-150 pb-150"
        style={{ backgroundImage: "url(assets/images/bg/cta-bg2.jpg)" }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-7 col-lg-8">
              {/*=== CTA Content Box ===*/}
              <div className="cta-content-box text-white">
                <h2 className="mb-35">
                  Ready to Travel With Real Adventure and Enjoy Natural
                </h2>
                <Link legacyBehavior href="/about">
                  <a className="main-btn secondary-btn">
                    Check Availability
                    <i className="far fa-paper-plane" />
                  </a>
                </Link>
              </div>
            </div>
            <div className="col-xl-5 col-lg-4">
              {/*=== Play Box ===*/}
              <div className="play-box text-center">
                <a
                  href="https://www.youtube.com/watch?v=ibuUmMhD2Pg"
                  className="video-popup"
                >
                  <i className="fas fa-play" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*====== End CTA Section ======*/}
      {/*====== Start What We Section ======*/}
      <section className="we-section pt-100 pb-50">
        <div className="container">
          <div className="row align-items-xl-center">
            <div className="col-xl-6 order-2 order-xl-1">
              {/*=== We Image Box ===*/}
              <div className="we-two_image-box mb-20">
                <div className="row align-items-end">
                  <div className="col-md-6">
                    {/*=== We Image ===*/}
                    <div className="we-image mb-30">
                      <img
                        src="assets/images/gallery/we-3.jpg"
                        alt="we Image"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    {/*=== We Image ===*/}
                    <div className="we-image mb-30">
                      <img
                        src="assets/images/gallery/we-4.jpg"
                        alt="we Image"
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    {/*=== We Image ===*/}
                    <div className="we-image mb-30 pr-lg-30 text-md-end">
                      <img
                        src="assets/images/gallery/we-5.jpg"
                        alt="we Image"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-6 order-1 order-xl-2">
              {/*=== We Content Box ===*/}
              <div className="we-content-box pl-lg-50 mb-10">
                {/*=== Section Title ===*/}
                <div className="section-title mb-30">
                  <span className="sub-title">Who We Are</span>
                  <h2>Great Opportunity For Adventure &amp; Travels</h2>
                </div>
                {/*=== Features List ===*/}
                <div className="features-list_one">
                  {/*=== Single Features List ===*/}
                  <div className="single-features-list mb-40">
                    <div className="icon-inner d-flex align-items-center">
                      <div className="icon-check">
                        <i className="fas fa-badge-check" />
                      </div>
                      <div className="icon">
                        <i className="flaticon-helmet" />
                      </div>
                    </div>
                    <div className="content">
                      <h4>Safety First Always</h4>
                      <p>
                        Set perspiciatis unde omnis estenatus voluptatem
                        accusantium laudantium totarem aperiae
                      </p>
                    </div>
                  </div>
                  {/*=== Single Features List ===*/}
                  <div className="single-features-list mb-40">
                    <div className="icon-inner d-flex align-items-center">
                      <div className="icon-check">
                        <i className="fas fa-badge-check" />
                      </div>
                      <div className="icon">
                        <i className="flaticon-best-price" />
                      </div>
                    </div>
                    <div className="content">
                      <h4>Low Price &amp; Friendly</h4>
                      <p>
                        Quis autem vel eum iure reprehenderit voluptate velit
                        esse nihile molestiae consequatur.
                      </p>
                    </div>
                  </div>
                  {/*=== Single Features List ===*/}
                  <div className="single-features-list mb-40">
                    <div className="icon-inner d-flex align-items-center">
                      <div className="icon-check">
                        <i className="fas fa-badge-check" />
                      </div>
                      <div className="icon">
                        <i className="flaticon-travel" />
                      </div>
                    </div>
                    <div className="content">
                      <h4>Trusted Travel Guide</h4>
                      <p>
                        At vero accusamus dignissimos ducimus blanditiis
                        praesentium voluptatum deleniti atque quos
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*====== End What We Section ======*/}
      {/*====== Start Gallery Section ======*/}
      <section className="gallery-section-two pb-100">
        <div className="container-fluid">
          {/*=== Gallery Slider ===*/}
          <Slider
            {...sliderActive3ItemDot}
            className="slider-active-3-item-dot"
          >
            {/*=== Gallery Item ===*/}
            <div className="single-gallery-item-two">
              <div className="img-holder">
                <img
                  src="assets/images/gallery/gallery-7.jpg"
                  alt="Gallery Image"
                />
              </div>
              <div className="content">
                <h3 className="title">Tent Camping Inside Forest</h3>
                <a href="#">Adventure &amp; Travel</a>
              </div>
            </div>
            {/*=== Gallery Item ===*/}
            <div className="single-gallery-item-two">
              <div className="img-holder">
                <img
                  src="assets/images/gallery/gallery-8.jpg"
                  alt="Gallery Image"
                />
              </div>
              <div className="content">
                <h3 className="title">Couple Tent Camping On Hills</h3>
                <a href="#">Adventure &amp; Travel</a>
              </div>
            </div>
            {/*=== Gallery Item ===*/}
            <div className="single-gallery-item-two">
              <div className="img-holder">
                <img
                  src="assets/images/gallery/gallery-9.jpg"
                  alt="Gallery Image"
                />
              </div>
              <div className="content">
                <h3 className="title">Camping For Every Children</h3>
                <a href="#">Adventure &amp; Travel</a>
              </div>
            </div>
            {/*=== Gallery Item ===*/}
            <div className="single-gallery-item-two">
              <div className="img-holder">
                <img
                  src="assets/images/gallery/gallery-8.jpg"
                  alt="Gallery Image"
                />
              </div>
              <div className="content">
                <h3 className="title">Couple Tent Camping On Hills</h3>
                <a href="#">Adventure &amp; Travel</a>
              </div>
            </div>
          </Slider>
        </div>
      </section>
      {/*====== End Gallery Section ======*/}
      {/*====== Start Testimonial Section ======*/}
      <section
        className="testimonial-section bg_cover pt-100 pb-100"
        style={{ backgroundImage: "url(assets/images/bg/map-bg.jpg)" }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-7">
              <div className="section-title text-center text-white mb-60">
                <span className="sub-title">Testimonials</span>
                <h2>What Our Traveler Say About Our Tour Services</h2>
              </div>
            </div>
          </div>
          <Slider
            {...sliderActive3ItemDot}
            className="slider-active-3-item-dot"
          >
            <div className="gw-testimonial-item-two">
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
                  To take a trivial example which of usev undertakes laborious
                  physical exercise excepto obtain advantage from has any right
                  to find fault with man.
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
            <div className="gw-testimonial-item-two">
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
                  To take a trivial example which of usev undertakes laborious
                  physical exercise excepto obtain advantage from has any right
                  to find fault with man.
                </p>
                <div className="author-thumb-title">
                  <div className="author-thumb">
                    <img
                      src="assets/images/testimonial/author-2.jpg"
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
            <div className="gw-testimonial-item-two">
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
                  To take a trivial example which of usev undertakes laborious
                  physical exercise excepto obtain advantage from has any right
                  to find fault with man.
                </p>
                <div className="author-thumb-title">
                  <div className="author-thumb">
                    <img
                      src="assets/images/testimonial/author-3.jpg"
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
            <div className="gw-testimonial-item-two">
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
                  To take a trivial example which of usev undertakes laborious
                  physical exercise excepto obtain advantage from has any right
                  to find fault with man.
                </p>
                <div className="author-thumb-title">
                  <div className="author-thumb">
                    <img
                      src="assets/images/testimonial/author-2.jpg"
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
      </section>
      {/*====== End Testimonial Section ======*/}
      {/*====== Start Blog Section ======*/}
      <section className="blog-section pt-100 pb-60">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7">
              <div className="section-title text-center mb-45">
                <span className="sub-title">News &amp; Blog</span>
                <h2>Amazing News &amp; Blog For Every Single Update</h2>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-4 col-md-6 col-sm-12">
              {/*=== Single Blog Post ===*/}
              <div className="single-blog-post-three mb-40">
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
                        <a>Meet Skeleton Svelte Taile Sind For Reactive UIs</a>
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
              <div className="single-blog-post-three mb-40">
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
                          Web Vitals Tools Boost Your to Sen Performance Scores
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
              <div className="single-blog-post-three mb-40">
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
                          Smashing Podcast Episode See With Paul Billion-Dollar
                          Idea
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
      </section>
      {/*====== End Blog Section ======*/}
      {/*====== Start Partners Section ======*/}
      <section className="partners-section">
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
                    src="assets/images/partner/partner-1.png"
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
                    src="assets/images/partner/partner-2.png"
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
                    src="assets/images/partner/partner-3.png"
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
                    src="assets/images/partner/partner-4.png"
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
                    src="assets/images/partner/partner-5.png"
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
                    src="assets/images/partner/partner-4.png"
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
export default Index3;
