import GallerySection from "@/src/components/GallerySection";
import PageBanner from "@/src/components/PageBanner";
import Layout from "@/src/layout/Layout";
import Link from "next/link";
const Destination = () => {
  return (
    <Layout extraClass={"pt-160"}>
      <PageBanner pageTitle={"Destination"} />
      {/*====== Start Booking Section ======*/}
      <section className="booking-form-section pb-100">
        <div className="container-fluid">
          <div className="booking-form-wrapper p-r z-2">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="booking-form-two"
            >
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
                  <option data-display="Accommodations">Accommodations</option>
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
                  Check Availability <i className="far fa-angle-double-right" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
      {/*====== End Booking Section ======*/}
      {/*====== Start Destination Section ======*/}
      <section className="destination-section pb-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-3 col-md-6 col-sm-12">
              <div className="single-place-item-two mb-30 wow fadeInUp">
                <div className="place-img">
                  <img
                    src="assets/images/place/place-10.jpg"
                    alt="Place Image"
                  />
                  <span className="tour-count">5 Tours</span>
                  <div className="place-content">
                    <div className="info text-white">
                      <h3 className="title mb-10">Indonesia</h3>
                      <p className="price">
                        <span className="currency">$</span>225.63
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12">
              <div className="single-place-item-two mb-30 wow fadeInUp">
                <div className="place-img">
                  <img
                    src="assets/images/place/place-11.jpg"
                    alt="Place Image"
                  />
                  <span className="tour-count">5 Tours</span>
                  <div className="place-content">
                    <div className="info text-white">
                      <h3 className="title mb-10">New York</h3>
                      <p className="price">
                        <span className="currency">$</span>225.63
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="single-place-item-two mb-30 wow fadeInUp">
                <div className="place-img">
                  <img
                    src="assets/images/place/place-12.jpg"
                    alt="Place Image"
                  />
                  <span className="tour-count">5 Tours</span>
                  <div className="place-content">
                    <div className="info text-white">
                      <h3 className="title mb-10">Thailand</h3>
                      <p className="price">
                        <span className="currency">$</span>225.63
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 wow fadeInUp">
              <div className="single-place-item-two mb-30">
                <div className="place-img">
                  <img
                    src="assets/images/place/place-13.jpg"
                    alt="Place Image"
                  />
                  <span className="tour-count">5 Tours</span>
                  <div className="place-content">
                    <div className="info text-white">
                      <h3 className="title mb-10">Nepal</h3>
                      <p className="price">
                        <span className="currency">$</span>225.63
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 wow fadeInUp">
              <div className="single-place-item-two mb-30">
                <div className="place-img">
                  <img
                    src="assets/images/place/place-14.jpg"
                    alt="Place Image"
                  />
                  <span className="tour-count">5 Tours</span>
                  <div className="place-content">
                    <div className="info text-white">
                      <h3 className="title mb-10">Maldives</h3>
                      <p className="price">
                        <span className="currency">$</span>225.63
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 wow fadeInUp">
              <div className="single-place-item-two mb-30">
                <div className="place-img">
                  <img
                    src="assets/images/place/place-15.jpg"
                    alt="Place Image"
                  />
                  <span className="tour-count">5 Tours</span>
                  <div className="place-content">
                    <div className="info text-white">
                      <h3 className="title mb-10">Dubai</h3>
                      <p className="price">
                        <span className="currency">$</span>225.63
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 wow fadeInUp">
              <div className="single-place-item-two mb-30">
                <div className="place-img">
                  <img
                    src="assets/images/place/place-16.jpg"
                    alt="Place Image"
                  />
                  <span className="tour-count">5 Tours</span>
                  <div className="place-content">
                    <div className="info text-white">
                      <h3 className="title mb-10">France</h3>
                      <p className="price">
                        <span className="currency">$</span>225.63
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="single-place-item-two mb-30 wow fadeInUp">
                <div className="place-img">
                  <img
                    src="assets/images/place/place-12.jpg"
                    alt="Place Image"
                  />
                  <span className="tour-count">5 Tours</span>
                  <div className="place-content">
                    <div className="info text-white">
                      <h3 className="title mb-10">Switzerland</h3>
                      <p className="price">
                        <span className="currency">$</span>225.63
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12">
              <div className="single-place-item-two mb-30 wow fadeInUp">
                <div className="place-img">
                  <img
                    src="assets/images/place/place-18.jpg"
                    alt="Place Image"
                  />
                  <span className="tour-count">5 Tours</span>
                  <div className="place-content">
                    <div className="info text-white">
                      <h3 className="title mb-10">Morocco</h3>
                      <p className="price">
                        <span className="currency">$</span>225.63
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12">
              <div className="single-place-item-two mb-30 wow fadeInUp">
                <div className="place-img">
                  <img
                    src="assets/images/place/place-19.jpg"
                    alt="Place Image"
                  />
                  <span className="tour-count">5 Tours</span>
                  <div className="place-content">
                    <div className="info text-white">
                      <h3 className="title mb-10">Hong Kong</h3>
                      <p className="price">
                        <span className="currency">$</span>225.63
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <ul className="gowilds-pagination wow fadeInUp text-center mt-30">
                <li className="me-2">
                  <a href="#">
                    <i className="far fa-arrow-left" />
                  </a>
                </li>
                <li className="me-2">
                  <a href="#" className="active">
                    01
                  </a>
                </li>
                <li className="me-2">
                  <a href="#">02</a>
                </li>
                <li className="me-2">
                  <a href="#">03</a>
                </li>
                <li className="me-2">
                  <a href="#">04</a>
                </li>
                <li className="me-2">
                  <a href="#">
                    <i className="far fa-arrow-right" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/*====== End Destination Section ======*/}
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
                  <a className="main-btn secondary-btn">
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
      {/*====== Start Features Section ======*/}
      <section className="features-section pt-100 pb-70">
        <div className="container">
          <div className="row align-items-xl-center">
            <div className="col-xl-5 order-2 order-lg-1">
              {/*=== Features Image Box ===*/}
              <div className="features-one_image-box mb-30 wow fadeInLeft">
                <img
                  src="assets/images/features/feat-9.jpg"
                  alt="Features Image"
                />
              </div>
            </div>
            <div className="col-xl-7 order-1 order-lg-2">
              <div className="features-item-area mb-20 pl-lg-70">
                <div className="row">
                  <div className="col-md-6">
                    {/*=== Fancy Icon Box ===*/}
                    <div className="fancy-icon-box-two mb-30 wow fadeInUp">
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
                    <div className="fancy-icon-box-two mb-30 wow fadeInUp">
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
                    <div className="fancy-icon-box-two mb-30 wow fadeInUp">
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
                    <div className="fancy-icon-box-two mb-30 wow fadeInUp">
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
      {/*====== Start Gallery Section ======*/}
      <GallerySection />
      {/*====== End Gallery Section ======*/}
    </Layout>
  );
};
export default Destination;
