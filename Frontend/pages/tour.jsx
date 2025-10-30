import GallerySection from "@/src/components/GallerySection";
import PageBanner from "@/src/components/PageBanner";
import Layout from "@/src/layout/Layout";
import Link from "next/link";
const Tour = () => {
  return (
    <Layout extraClass={"pt-160"}>
      <PageBanner pageTitle={"Explore Tour Place"} />
      {/*====== Start Booking Section ======*/}
      <section className="booking-form-section pb-100">
        <div className="container-fluid">
          <div className="booking-form-wrapper p-r z-2">
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
      {/*====== Start Places Section ======*/}
      <section className="places-section pb-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-4 col-md-6 col-sm-12 places-column">
              {/*=== Single Place Item ===*/}
              <div className="single-place-item mb-60 wow fadeInUp">
                <div className="place-img">
                  <img
                    src="assets/images/place/place-1.jpg"
                    alt="Place Image"
                  />
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
                        <a>Sitting on Boat Spreading Her Arms</a>
                      </Link>
                    </h4>
                    <p className="location">
                      <i className="far fa-map-marker-alt" />
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
            </div>
            <div className="col-xl-4 col-md-6 col-sm-12 places-column">
              {/*=== Single Place Item ===*/}
              <div className="single-place-item mb-60 wow fadeInUp">
                <div className="place-img">
                  <img
                    src="assets/images/place/place-2.jpg"
                    alt="Place Image"
                  />
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
                        <a>White Canopy Tent Near Coastline</a>
                      </Link>
                    </h4>
                    <p className="location">
                      <i className="far fa-map-marker-alt" />
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
            </div>
            <div className="col-xl-4 col-md-6 col-sm-12 places-column">
              {/*=== Single Place Item ===*/}
              <div className="single-place-item mb-60 wow fadeInUp">
                <div className="place-img">
                  <img
                    src="assets/images/place/place-3.jpg"
                    alt="Place Image"
                  />
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
                        <a>Sitting on Boat Spreading Her Arms</a>
                      </Link>
                    </h4>
                    <p className="location">
                      <i className="far fa-map-marker-alt" />
                      Tambon Khlong Sok, Thailand
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
            </div>
            <div className="col-xl-4 col-md-6 col-sm-12 places-column">
              {/*=== Single Place Item ===*/}
              <div className="single-place-item mb-60 wow fadeInUp">
                <div className="place-img">
                  <img
                    src="assets/images/place/place-4.jpg"
                    alt="Place Image"
                  />
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
                        <a>Sitting on Boat Spreading Her Arms</a>
                      </Link>
                    </h4>
                    <p className="location">
                      <i className="far fa-map-marker-alt" />
                      Arefu, AG, Romania
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
            </div>
            <div className="col-xl-4 col-md-6 col-sm-12 places-column">
              {/*=== Single Place Item ===*/}
              <div className="single-place-item mb-60 wow fadeInUp">
                <div className="place-img">
                  <img
                    src="assets/images/place/place-5.jpg"
                    alt="Place Image"
                  />
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
                        <a>Cottages In The Middle Of Beach</a>
                      </Link>
                    </h4>
                    <p className="location">
                      <i className="far fa-map-marker-alt" />
                      Vaitāpē, French Polynesia
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
            </div>
            <div className="col-xl-4 col-md-6 col-sm-12 places-column">
              {/*=== Single Place Item ===*/}
              <div className="single-place-item mb-60 wow fadeInUp">
                <div className="place-img">
                  <img
                    src="assets/images/place/place-6.jpg"
                    alt="Place Image"
                  />
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
                        Beautiful Floating Villa on River
                      </Link>
                    </h4>
                    <p className="location">
                      <i className="far fa-map-marker-alt" />
                      Gaafu Dhaalu Atoll, Maldives
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
            </div>
            <div className="col-xl-4 col-md-6 col-sm-12 places-column">
              {/*=== Single Place Item ===*/}
              <div className="single-place-item mb-60 wow fadeInUp">
                <div className="place-img">
                  <img
                    src="assets/images/place/place-7.jpg"
                    alt="Place Image"
                  />
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
                        Man and Woman Walks on Dock
                      </Link>
                    </h4>
                    <p className="location">
                      <i className="far fa-map-marker-alt" />
                      Maldives
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
            </div>
            <div className="col-xl-4 col-md-6 col-sm-12 places-column">
              {/*=== Single Place Item ===*/}
              <div className="single-place-item mb-60 wow fadeInUp">
                <div className="place-img">
                  <img
                    src="assets/images/place/place-8.jpg"
                    alt="Place Image"
                  />
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
                        Trees Under White Clouds during Daytime
                      </Link>
                    </h4>
                    <p className="location">
                      <i className="far fa-map-marker-alt" />
                      Vaitāpē, French Polynesia
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
            </div>
            <div className="col-xl-4 col-md-6 col-sm-12 places-column">
              {/*=== Single Place Item ===*/}
              <div className="single-place-item mb-60 wow fadeInUp">
                <div className="place-img">
                  <img
                    src="assets/images/place/place-9.jpg"
                    alt="Place Image"
                  />
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
                        Body of Water Near Mountain
                      </Link>
                    </h4>
                    <p className="location">
                      <i className="far fa-map-marker-alt" />
                      Bali, Indonesia
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
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              {/*=== Gowilds Pagination ===*/}
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
      {/*====== End Places Section ======*/}
      {/*====== Start Gallery Section ======*/}
      <GallerySection />
      {/*====== End Gallery Section ======*/}
    </Layout>
  );
};
export default Tour;
