import GallerySection from "@/src/components/GallerySection";
import PageBanner from "@/src/components/PageBanner";
import Layout from "@/src/layout/Layout";
import { sliderActive3Item, sliderActive3ItemDot } from "@/src/sliderProps";
import Link from "next/link";
import Slider from "react-slick";
const DestinationDetails = () => {
  return (
    <Layout extraClass={"pt-160"}>
      <PageBanner pageTitle={"Destination Details"} />
      {/*====== Start Destination Details Section ======*/}
      <section className="destination-details-section pt-100 pb-70">
        <div className="container">
          <div className="destination-details-wrapper">
            <div className="destination-info wow fadeInUp">
              <h3 className="title">Floating Villa On Beach</h3>
              <div className="meta">
                <span className="location">
                  <i className="fas fa-map-marker-alt" />
                  Gaafu Dhaalu Atoll, Maldives
                </span>
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
                    <a href="#">(4.9)</a>
                  </li>
                </ul>
              </div>
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium, totam rem aperiam eaque ipsa
                quae abillo inventore veritatis et quasi architecto beatae vitae
                dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas
                sit aspernatur aut odit aut fugit, sed quia consequuntur magni
                dolores eos qui ratione voluptatem sequi nesciunt. Neque porro
                quisquam est, qui dolorem ipsum quia dolor sit amet,
                consectetur, adipisci velit, sed quia non numquam eius modi
                tempora incidunt ut labore et dolore magnam aliquam quaerat
                voluptatem. Ut enim ad minima veniam, quis nostrum
                exercitationem ullam corporis suscipit laboriosam nisut aliquid
                exea commodi consequatur
              </p>
              <div className="row">
                <div className="col-lg-6">
                  <img
                    src="assets/images/place/des-single-1.jpg"
                    className="rounded mb-40"
                    alt="Features Image"
                  />
                </div>
                <div className="col-lg-6">
                  <img
                    src="assets/images/place/des-single-2.jpg"
                    className="rounded mb-40"
                    alt="Features Image"
                  />
                </div>
              </div>
              <h3>Why Choose Maldives</h3>
              <p>
                On the other hand, we denounce with righteous indignation and
                dislike men who are so beguiled and demoralized by the charms
                pleasure of the moment, so blinded by desire, that they cannot
                foresee the pain and trouble that are bound to ensue and equal
                blame belongs those who fail their duty through weakness of will
                which the same saying through shrinking from toil and pain.
              </p>
              <ul className="features-list mb-40">
                <li>
                  <span>
                    <i className="fas fa-badge-check" />
                    Family Camping
                  </span>
                </li>
                <li>
                  <span>
                    <i className="fas fa-badge-check" />
                    Wild Camping
                  </span>
                </li>
                <li>
                  <span>
                    <i className="fas fa-badge-check" />
                    Fishing
                  </span>
                </li>
                <li>
                  <span>
                    <i className="fas fa-badge-check" />
                    Mountain Biking
                  </span>
                </li>
                <li>
                  <span>
                    <i className="fas fa-badge-check" />
                    Free Wi-fi Internet
                  </span>
                </li>
                <li>
                  <span>
                    <i className="fas fa-badge-check" />
                    Transportation
                  </span>
                </li>
                <li>
                  <span>
                    <i className="fas fa-badge-check" />
                    Spa &amp; GYM
                  </span>
                </li>
              </ul>
            </div>
            <div className="gallery-area wow fadeInUp">
              <Slider {...sliderActive3Item} className="slider-active-3-item">
                {/*=== Single Gallery Item ===*/}
                <div className="single-gallery-item mb-30">
                  <div className="gallery-img">
                    <img
                      src="assets/images/gallery/gallery-1.jpg"
                      alt="Gallery Image"
                    />
                    <div className="hover-overlay">
                      <a
                        href="assets/images/gallery/gallery-1.jpg"
                        className="icon-btn img-popup"
                      >
                        <i className="far fa-plus" />
                      </a>
                    </div>
                  </div>
                </div>
                {/*=== Single Gallery Item ===*/}
                <div className="single-gallery-item mb-30">
                  <div className="gallery-img">
                    <img
                      src="assets/images/gallery/gallery-2.jpg"
                      alt="Gallery Image"
                    />
                    <div className="hover-overlay">
                      <a
                        href="assets/images/gallery/gallery-2.jpg"
                        className="icon-btn img-popup"
                      >
                        <i className="far fa-plus" />
                      </a>
                    </div>
                  </div>
                </div>
                {/*=== Single Gallery Item ===*/}
                <div className="single-gallery-item mb-30">
                  <div className="gallery-img">
                    <img
                      src="assets/images/gallery/gallery-3.jpg"
                      alt="Gallery Image"
                    />
                    <div className="hover-overlay">
                      <a
                        href="assets/images/gallery/gallery-3.jpg"
                        className="icon-btn img-popup"
                      >
                        <i className="far fa-plus" />
                      </a>
                    </div>
                  </div>
                </div>
              </Slider>
            </div>
          </div>
        </div>
      </section>
      {/*====== End Destination Details Section ======*/}
      {/*====== Start CTA Section ======*/}
      <section
        className="cta-bg overlay bg_cover pt-150 pb-150"
        style={{ backgroundImage: "url(assets/images/bg/cta-bg2.jpg)" }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-7 col-lg-8">
              {/*=== CTA Content Box ===*/}
              <div className="cta-content-box text-white wow fadeInLeft">
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
            <div className="col-xl-5 col-lg-4">
              {/*=== Play Box ===*/}
              <div className="play-box text-lg-end text-center wow fadeInRight">
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
      {/*====== Start Places Section ======*/}
      <section className="places-seciton pt-95 pb-100">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              {/*====== Section Title ======*/}
              <div className="section-title text-center mb-45 wow fadeInDown">
                <h2>Popular Tours</h2>
              </div>
            </div>
          </div>
          <Slider
            {...sliderActive3ItemDot}
            className="slider-active-3-item-dot wow fadeInUp"
          >
            {/*=== Single Place Item ===*/}
            <div className="single-place-item mb-60">
              <div className="place-img">
                <img src="assets/images/place/place-1.jpg" alt="Place Image" />
              </div>
              <div className="place-content">
                <div className="info">
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
                      <a href="#">(4.9)</a>
                    </li>
                  </ul>
                  <h4 className="title">
                    <Link legacyBehavior href="/tour-details">
                      <a>Man and Woman Walks on Dock</a>
                    </Link>
                  </h4>
                  <p className="location">
                    <i className="fas fa-map-marker-alt" />
                    North Province, Maldives
                  </p>
                  <p className="price">
                    <i className="fas fa-usd-circle" />
                    Price<span className="currency">$</span>93.65
                  </p>
                  <div className="meta">
                    <span>
                      <i className="far fa-clock" />
                      05 Days
                    </span>
                    <span>
                      <i className="far fa-user" />
                      25
                    </span>
                    <span>
                      <Link legacyBehavior href="/tour-details">
                        <a>
                          Details
                          <i className="far fa-long-arrow-right" />
                        </a>
                      </Link>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/*=== Single Place Item ===*/}
            <div className="single-place-item mb-60">
              <div className="place-img">
                <img src="assets/images/place/place-2.jpg" alt="Place Image" />
              </div>
              <div className="place-content">
                <div className="info">
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
                      <a href="#">(4.9)</a>
                    </li>
                  </ul>
                  <h4 className="title">
                    <Link legacyBehavior href="/tour-details">
                      <a>Trees Under White Clouds during Daytime</a>
                    </Link>
                  </h4>
                  <p className="location">
                    <i className="fas fa-map-marker-alt" />
                    North Province, Maldives
                  </p>
                  <p className="price">
                    <i className="fas fa-usd-circle" />
                    Price<span className="currency">$</span>93.65
                  </p>
                  <div className="meta">
                    <span>
                      <i className="far fa-clock" />
                      05 Days
                    </span>
                    <span>
                      <i className="far fa-user" />
                      25
                    </span>
                    <span>
                      <Link legacyBehavior href="/tour-details">
                        <a>
                          Details
                          <i className="far fa-long-arrow-right" />
                        </a>
                      </Link>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/*=== Single Place Item ===*/}
            <div className="single-place-item mb-60">
              <div className="place-img">
                <img src="assets/images/place/place-3.jpg" alt="Place Image" />
              </div>
              <div className="place-content">
                <div className="info">
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
                      <a href="#">(4.9)</a>
                    </li>
                  </ul>
                  <h4 className="title">
                    <Link legacyBehavior href="/tour-details">
                      <a>Body of Water Near Mountain</a>
                    </Link>
                  </h4>
                  <p className="location">
                    <i className="fas fa-map-marker-alt" />
                    North Province, Maldives
                  </p>
                  <p className="price">
                    <i className="fas fa-usd-circle" />
                    Price<span className="currency">$</span>93.65
                  </p>
                  <div className="meta">
                    <span>
                      <i className="far fa-clock" />
                      05 Days
                    </span>
                    <span>
                      <i className="far fa-user" />
                      25
                    </span>
                    <span>
                      <Link legacyBehavior href="/tour-details">
                        <a>
                          Details
                          <i className="far fa-long-arrow-right" />
                        </a>
                      </Link>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/*=== Single Place Item ===*/}
            <div className="single-place-item mb-60">
              <div className="place-img">
                <img src="assets/images/place/place-4.jpg" alt="Place Image" />
              </div>
              <div className="place-content">
                <div className="info">
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
                      <a href="#">(4.9)</a>
                    </li>
                  </ul>
                  <h4 className="title">
                    <Link legacyBehavior href="/tour-details">
                      <a>Man Standing on a Rock</a>
                    </Link>
                  </h4>
                  <p className="location">
                    <i className="fas fa-map-marker-alt" />
                    North Province, Maldives
                  </p>
                  <p className="price">
                    <i className="fas fa-usd-circle" />
                    Price<span className="currency">$</span>93.65
                  </p>
                  <div className="meta">
                    <span>
                      <i className="far fa-clock" />
                      05 Days
                    </span>
                    <span>
                      <i className="far fa-user" />
                      25
                    </span>
                    <span>
                      <Link legacyBehavior href="/tour-details">
                        <a>
                          Details
                          <i className="far fa-long-arrow-right" />
                        </a>
                      </Link>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Slider>
        </div>
      </section>
      {/*====== End Places Section ======*/}
      {/*====== Start Gallery Section ======*/}
      <GallerySection />
    </Layout>
  );
};
export default DestinationDetails;
