import GallerySection from "@/src/components/GallerySection";
import PageBanner from "@/src/components/PageBanner";
import Layout from "@/src/layout/Layout";
const Events = () => {
  return (
    <Layout extraClass={"pt-160"}>
      <PageBanner pageTitle={"Events"} />
      {/*====== Start Booking Section ======*/}
      <section className="booking-form-section">
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
      {/*====== Start Events Section ======*/}
      <section className="events-section pt-100 pb-100">
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
                    <option value={1}>Best Event</option>
                    <option value={2}>New Events</option>
                    <option value={3}>Upcoming Event</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-xl-4 col-md-6 col-sm-12">
              <div className="single-event-item mb-30 wow fadeInUp">
                <div className="img-holder">
                  <img
                    src="assets/images/event/event-1.jpg"
                    alt="Event Image"
                  />
                </div>
                <div className="content">
                  <div className="meta">
                    <span>
                      <i className="far fa-calendar-alt" />
                      <a href="#">September 25, 2022</a>
                    </span>
                    <h3 className="title">
                      <a href="#">How To Enjoy Adventure Trip With Gowilds</a>
                    </h3>
                    <p className="location">
                      <i className="far fa-map-marker-alt" /> Gaafu Dhaalu
                      Atoll, Maldives
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6 col-sm-12">
              <div className="single-event-item mb-30 wow fadeInUp">
                <div className="img-holder">
                  <img
                    src="assets/images/event/event-2.jpg"
                    alt="Event Image"
                  />
                </div>
                <div className="content">
                  <div className="meta">
                    <span>
                      <i className="far fa-calendar-alt" />
                      <a href="#">September 25, 2022</a>
                    </span>
                    <h3 className="title">
                      <a href="#">Great Advice For Build Awesome Mintality</a>
                    </h3>
                    <p className="location">
                      <i className="far fa-map-marker-alt" /> Gaafu Dhaalu
                      Atoll, Maldives
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6 col-sm-12">
              <div className="single-event-item mb-30 wow fadeInUp">
                <div className="img-holder">
                  <img
                    src="assets/images/event/event-3.jpg"
                    alt="Event Image"
                  />
                </div>
                <div className="content">
                  <div className="meta">
                    <span>
                      <i className="far fa-calendar-alt" />
                      <a href="#">September 25, 2022</a>
                    </span>
                    <h3 className="title">
                      <a href="#">How To Enjoy Adventure Trip With Gowilds</a>
                    </h3>
                    <p className="location">
                      <i className="far fa-map-marker-alt" /> Gaafu Dhaalu
                      Atoll, Maldives
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6 col-sm-12">
              <div className="single-event-item mb-30 wow fadeInUp">
                <div className="img-holder">
                  <img
                    src="assets/images/event/event-4.jpg"
                    alt="Event Image"
                  />
                </div>
                <div className="content">
                  <div className="meta">
                    <span>
                      <i className="far fa-calendar-alt" />
                      <a href="#">September 25, 2022</a>
                    </span>
                    <h3 className="title">
                      <a href="#">How To Enjoy Adventure Trip With Gowilds</a>
                    </h3>
                    <p className="location">
                      <i className="far fa-map-marker-alt" /> Gaafu Dhaalu
                      Atoll, Maldives
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6 col-sm-12">
              <div className="single-event-item mb-30 wow fadeInUp">
                <div className="img-holder">
                  <img
                    src="assets/images/event/event-5.jpg"
                    alt="Event Image"
                  />
                </div>
                <div className="content">
                  <div className="meta">
                    <span>
                      <i className="far fa-calendar-alt" />
                      <a href="#">September 25, 2022</a>
                    </span>
                    <h3 className="title">
                      <a href="#">Grocery &amp; Specialty For Food West</a>
                    </h3>
                    <p className="location">
                      <i className="far fa-map-marker-alt" /> Gaafu Dhaalu
                      Atoll, Maldives
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6 col-sm-12">
              <div className="single-event-item mb-30 wow fadeInUp">
                <div className="img-holder">
                  <img
                    src="assets/images/event/event-6.jpg"
                    alt="Event Image"
                  />
                </div>
                <div className="content">
                  <div className="meta">
                    <span>
                      <i className="far fa-calendar-alt" />
                      <a href="#">September 25, 2022</a>
                    </span>
                    <h3 className="title">
                      <a href="#">Vancouver International Travel Expo</a>
                    </h3>
                    <p className="location">
                      <i className="far fa-map-marker-alt" /> Gaafu Dhaalu
                      Atoll, Maldives
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6 col-sm-12">
              <div className="single-event-item mb-30 wow fadeInUp">
                <div className="img-holder">
                  <img
                    src="assets/images/event/event-7.jpg"
                    alt="Event Image"
                  />
                </div>
                <div className="content">
                  <div className="meta">
                    <span>
                      <i className="far fa-calendar-alt" />
                      <a href="#">September 25, 2022</a>
                    </span>
                    <h3 className="title">
                      <a href="#">How To Enjoy Adventure Trip With Gowilds</a>
                    </h3>
                    <p className="location">
                      <i className="far fa-map-marker-alt" /> Gaafu Dhaalu
                      Atoll, Maldives
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6 col-sm-12">
              <div className="single-event-item mb-30 wow fadeInUp">
                <div className="img-holder">
                  <img
                    src="assets/images/event/event-8.jpg"
                    alt="Event Image"
                  />
                </div>
                <div className="content">
                  <div className="meta">
                    <span>
                      <i className="far fa-calendar-alt" />
                      <a href="#">September 25, 2022</a>
                    </span>
                    <h3 className="title">
                      <a href="#">How To Enjoy Adventure Trip With Gowilds</a>
                    </h3>
                    <p className="location">
                      <i className="far fa-map-marker-alt" /> Gaafu Dhaalu
                      Atoll, Maldives
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6 col-sm-12">
              <div className="single-event-item mb-30 wow fadeInUp">
                <div className="img-holder">
                  <img
                    src="assets/images/event/event-9.jpg"
                    alt="Event Image"
                  />
                </div>
                <div className="content">
                  <div className="meta">
                    <span>
                      <i className="far fa-calendar-alt" />
                      <a href="#">September 25, 2022</a>
                    </span>
                    <h3 className="title">
                      <a href="#">How To Enjoy Adventure Trip With Gowilds</a>
                    </h3>
                    <p className="location">
                      <i className="far fa-map-marker-alt" /> Gaafu Dhaalu
                      Atoll, Maldives
                    </p>
                  </div>
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
      {/*====== End Events Section ======*/}
      {/*====== Start Gallery Section ======*/}
      <GallerySection />
      {/*====== End Gallery Section ======*/}
    </Layout>
  );
};
export default Events;
