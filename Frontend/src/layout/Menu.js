import Link from "next/link";
import { Fragment, useState } from "react";
import SearchModal from "./SearchModal";

const Menu = () => {
  return (
    <Fragment>
      <DeskTopMenu />
      <MobileMenu />
    </Fragment>
  );
};
export default Menu;

const DeskTopMenu = () => {
  const [searchModal, setSearchModal] = useState(false);
  return (
    <Fragment>
      <SearchModal
        show={searchModal}
        handleClose={() => setSearchModal(false)}
      />
      <nav className="main-menu d-none d-xl-block">
        <ul>
          <li className="menu-item has-children">
            <a href="#">
              Home
              <span className="dd-trigger">
                <i className="far fa-angle-down" />
              </span>
            </a>
            <ul className="sub-menu">
              <li>
                <Link href="/">Home 01</Link>
              </li>

              <li>
                <Link href="index-3">Home 03</Link>
              </li>
              <li>
                <Link href="index-4">Home 04</Link>
              </li>
            </ul>
          </li>
          <li className="menu-item has-children">
            <a href="#">
              Tours
              <span className="dd-trigger">
                <i className="far fa-angle-down" />
              </span>
            </a>
            <ul className="sub-menu">
              <li>
                <Link href="tour">Tours</Link>
              </li>
              <li>
                <Link href="tour-details">Tours Details</Link>
              </li>
            </ul>
          </li>
          <li className="menu-item has-children">
            <a href="#">
              Destination
              <span className="dd-trigger">
                <i className="far fa-angle-down" />
              </span>
            </a>
            <ul className="sub-menu">
              <li>
                <Link href="destination">Destination</Link>
              </li>
              <li>
                <Link href="destination-details">Destination Details</Link>
              </li>
            </ul>
          </li>
          <li className="menu-item has-children">
            <a href="#">
              Blog
              <span className="dd-trigger">
                <i className="far fa-angle-down" />
              </span>
            </a>
            <ul className="sub-menu">
              <li>
                <Link href="blog-list">Blog List</Link>
              </li>
              <li>
                <Link href="blog-details">Blog Details</Link>
              </li>
            </ul>
          </li>
          <li className="menu-item has-children">
            <a href="#">
              Tools
              <span className="dd-trigger">
                <i className="far fa-angle-down" />
              </span>
            </a>
            <ul className="sub-menu">

                <li>
                    <Link href="bookings">Booking</Link>
                </li>
                <li>
                    <Link href="index-2">NLP Search</Link>
                </li>
              <li>
                <Link href="ai">AI Query</Link>
              </li>
              <li>
                <Link href="itineraires">Itinerary Planner</Link>
              </li>
              <li>
                <Link href="carbon-optimizer">Carbon Optimizer</Link>
              </li>
              <li>
                <Link href="activities-compare">Activity Compare</Link>
              </li>
                <li>
                    <Link href="feedback">Feedback</Link>
                </li>
                <li>
                    <Link href="sustainability">Sustainability</Link>
                </li>
                <li>
                    <Link href="location">Location</Link>
                </li>
                <li>
                    <Link href="transport">Transport</Link>
                </li>
                <li>
                    <Link href="analytics">Analytics</Link>
                </li>
            </ul>
          </li>
          <li className="menu-item has-children">
            <a href="#">
              Pages
              <span className="dd-trigger">
                <i className="far fa-angle-down" />
              </span>
            </a>
            <ul className="sub-menu">
              <li>
                <Link href="about">About Us</Link>
              </li>
              <li>
                <Link href="gallery">Our Gallery</Link>
              </li>
              <li>
                <Link href="events">Our Events</Link>
              </li>
              <li>
                <Link href="shop">Our Shop</Link>
              </li>
              <li>
                <Link href="product-details">Product Details</Link>
              </li>
              <li>
                <Link href="contact">Contact</Link>
              </li>
            </ul>
          </li>
          <li className="menu-item search-item">
            <div
              className="search-btn"
              data-bs-toggle="modal"
              data-bs-target="#search-modal"
              onClick={() => setSearchModal(true)}
            >
              <i className="far fa-search" />
            </div>
          </li>
        </ul>
      </nav>
    </Fragment>
  );
};

const MobileMenu = () => {
  const [activeMenu, setActiveMenu] = useState("");
  const activeMenuSet = (value) =>
      setActiveMenu(activeMenu === value ? "" : value),
    activeLi = (value) =>
      value === activeMenu ? { display: "block" } : { display: "none" };
  return (
    <nav className="main-menu d-block d-xl-none">
      <ul>
        <li className="menu-item has-children">
          <a href="#">
            Home
            <span className="dd-trigger" onClick={() => activeMenuSet("home")}>
              <i className="far fa-angle-down" />
            </span>
          </a>
          <ul className="sub-menu" style={activeLi("home")}>
            <li>
              <Link href="/">Home 01</Link>
            </li>
            <li>
              <Link href="index-2">Home 02</Link>
            </li>
            <li>
              <Link href="index-3">Home 03</Link>
            </li>
            <li>
              <Link href="index-4">Home 04</Link>
            </li>
          </ul>
        </li>
        <li className="menu-item has-children">
          <a href="#">
            Tours
            <span className="dd-trigger" onClick={() => activeMenuSet("Tours")}>
              <i className="far fa-angle-down" />
            </span>
          </a>
          <ul className="sub-menu" style={activeLi("Tours")}>
            <li>
              <Link href="tour">Tours</Link>
            </li>
            <li>
              <Link href="tour-details">Tours Details</Link>
            </li>
          </ul>
        </li>
        <li className="menu-item has-children">
          <a href="#">
            Destination
            <span
              className="dd-trigger"
              onClick={() => activeMenuSet("Destination")}
            >
              <i className="far fa-angle-down" />
            </span>
          </a>
          <ul className="sub-menu" style={activeLi("Destination")}>
            <li>
              <Link href="destination">Destination</Link>
            </li>
            <li>
              <Link href="destination-details">Destination Details</Link>
            </li>
          </ul>
        </li>
        <li className="menu-item has-children">
          <a href="#">
            Blog
            <span className="dd-trigger" onClick={() => activeMenuSet("Blog")}>
              <i className="far fa-angle-down" />
            </span>
          </a>
          <ul className="sub-menu" style={activeLi("Blog")}>
            <li>
              <Link href="blog-list">Blog List</Link>
            </li>
            <li>
              <Link href="blog-details">Blog Details</Link>
            </li>
          </ul>
        </li>
        <li className="menu-item has-children">
          <a href="#">
            Tools
            <span className="dd-trigger" onClick={() => activeMenuSet("Tools")}>
              <i className="far fa-angle-down" />
            </span>
          </a>
          <ul className="sub-menu" style={activeLi("Tools")}>
            <li>
              <Link href="ai">AI Query</Link>
            </li>
            <li>
              <Link href="itineraires">Itinerary Planner</Link>
            </li>
            <li>
              <Link href="carbon-optimizer">Carbon Optimizer</Link>
            </li>
            <li>
              <Link href="activities-compare">Activity Compare</Link>
            </li>
          </ul>
        </li>
        <li className="menu-item has-children">
          <a href="#">
            Pages
            <span className="dd-trigger" onClick={() => activeMenuSet("Pages")}>
              <i className="far fa-angle-down" />
            </span>
          </a>
          <ul className="sub-menu" style={activeLi("Pages")}>
            <li>
              <Link href="about">About Us</Link>
            </li>
            <li>
              <Link href="gallery">Our Gallery</Link>
            </li>
            <li>
              <Link href="events">Our Events</Link>
            </li>
            <li>
              <Link href="shop">Our Shop</Link>
            </li>
            <li>
              <Link href="product-details">Product Details</Link>
            </li>
            <li>
              <Link href="contact">Contact</Link>
            </li>
          </ul>
        </li>
        <li className="menu-item search-item">
          <div
            className="search-btn"
            data-bs-toggle="modal"
            data-bs-target="#search-modal"
          >
            <i className="far fa-search" />
          </div>
        </li>
      </ul>
    </nav>
  );
};
