import GallerySection from "@/src/components/GallerySection";
import PageBanner from "@/src/components/PageBanner";
import Layout from "@/src/layout/Layout";
import Link from "next/link";
const BlogList = () => {
  return (
    <Layout extraClass={"pt-160"}>
      <PageBanner pageTitle={"Blog List"} />
      {/*====== Start Blog Section ======*/}
      <section className="blog-list-section pt-100 pb-70">
        <div className="container">
          <div className="row">
            <div className="col-xl-8">
              {/*=== Blog List Wrapper ===*/}
              <div className="blog-list-wrapper">
                {/*=== Single Blog Post ===*/}
                <div className="single-blog-post-four mb-30 wow fadeInDown">
                  <div className="post-thumbnail">
                    <img
                      src="assets/images/blog/blog-13.jpg"
                      alt="Post Image"
                    />
                  </div>
                  <div className="entry-content">
                    <div className="post-meta">
                      <span>
                        <i className="far fa-calendar-alt" />
                        <a href="#">November 15, 2022</a>
                      </span>
                    </div>
                    <h3 className="title">
                      <Link legacyBehavior href="/blog-details">
                        <a>
                          Meet Skeleton Svelte Taile Sindey For Reactive UIs
                        </a>
                      </Link>
                    </h3>
                    <h6 className="author">
                      <i className="far fa-user" />
                      <a href="#">Matthew N. Davis</a>
                    </h6>
                    <Link legacyBehavior href="/blog-details">
                      <a className="main-btn filled-btn">
                        Read More
                        <i className="fas fa-paper-plane" />
                      </a>
                    </Link>
                  </div>
                </div>
                {/*=== Single Blog Post ===*/}
                <div className="single-blog-post-four mb-30 wow fadeInDown">
                  <div className="post-thumbnail">
                    <img
                      src="assets/images/blog/blog-14.jpg"
                      alt="Post Image"
                    />
                  </div>
                  <div className="entry-content">
                    <div className="post-meta">
                      <span>
                        <i className="far fa-calendar-alt" />
                        <a href="#">November 15, 2022</a>
                      </span>
                    </div>
                    <h3 className="title">
                      <Link legacyBehavior href="/blog-details">
                        <a>
                          Resolving Conflicts Between Designers And Engineers
                        </a>
                      </Link>
                    </h3>
                    <h6 className="author">
                      <i className="far fa-user" />
                      <a href="#">Matthew N. Davis</a>
                    </h6>
                    <Link legacyBehavior href="/blog-details">
                      <a className="main-btn filled-btn">
                        Read More
                        <i className="fas fa-paper-plane" />
                      </a>
                    </Link>
                  </div>
                </div>
                {/*=== Single Blog Post ===*/}
                <div className="single-blog-post-four mb-30 wow fadeInDown">
                  <div className="post-thumbnail">
                    <img
                      src="assets/images/blog/blog-15.jpg"
                      alt="Post Image"
                    />
                  </div>
                  <div className="entry-content">
                    <div className="post-meta">
                      <span>
                        <i className="far fa-calendar-alt" />
                        <a href="#">November 15, 2022</a>
                      </span>
                    </div>
                    <h3 className="title">
                      <Link legacyBehavior href="/blog-details">
                        <a>
                          Meet Skeleton Svelte Taile Sindey For Reactive UIs
                        </a>
                      </Link>
                    </h3>
                    <h6 className="author">
                      <i className="far fa-user" />
                      <a href="#">Matthew N. Davis</a>
                    </h6>
                    <Link legacyBehavior href="/blog-details">
                      <a className="main-btn filled-btn">
                        Read More
                        <i className="fas fa-paper-plane" />
                      </a>
                    </Link>
                  </div>
                </div>
                {/*=== Single Blog Post ===*/}
                <div className="single-blog-post-four mb-30 wow fadeInDown">
                  <div className="post-thumbnail">
                    <img
                      src="assets/images/blog/blog-16.jpg"
                      alt="Post Image"
                    />
                  </div>
                  <div className="entry-content">
                    <div className="post-meta">
                      <span>
                        <i className="far fa-calendar-alt" />
                        <a href="#">November 15, 2022</a>
                      </span>
                    </div>
                    <h3 className="title">
                      <Link legacyBehavior href="/blog-details">
                        Using Automated To Results Improve Accessibility
                      </Link>
                    </h3>
                    <h6 className="author">
                      <i className="far fa-user" />
                      <a href="#">Matthew N. Davis</a>
                    </h6>
                    <Link legacyBehavior href="/blog-details">
                      <a className="main-btn filled-btn">
                        Read More
                        <i className="fas fa-paper-plane" />
                      </a>
                    </Link>
                  </div>
                </div>
                {/*=== Single Blog Post ===*/}
                <div className="single-blog-post-four mb-30 wow fadeInDown">
                  <div className="post-thumbnail">
                    <img
                      src="assets/images/blog/blog-17.jpg"
                      alt="Post Image"
                    />
                  </div>
                  <div className="entry-content">
                    <div className="post-meta">
                      <span>
                        <i className="far fa-calendar-alt" />
                        <a href="#">November 15, 2022</a>
                      </span>
                    </div>
                    <h3 className="title">
                      <Link legacyBehavior href="/blog-details">
                        Usability Journey Of Drupal’s Primary Navigation
                      </Link>
                    </h3>
                    <h6 className="author">
                      <i className="far fa-user" />
                      <a href="#">Matthew N. Davis</a>
                    </h6>
                    <Link legacyBehavior href="/blog-details">
                      <a className="main-btn filled-btn">
                        Read More
                        <i className="fas fa-paper-plane" />
                      </a>
                    </Link>
                  </div>
                </div>
                {/*=== Single Blog Post ===*/}
                <div className="single-blog-post-four mb-30 wow fadeInDown">
                  <div className="post-thumbnail">
                    <img
                      src="assets/images/blog/blog-18.jpg"
                      alt="Post Image"
                    />
                  </div>
                  <div className="entry-content">
                    <div className="post-meta">
                      <span>
                        <i className="far fa-calendar-alt" />
                        <a href="#">November 15, 2022</a>
                      </span>
                    </div>
                    <h3 className="title">
                      <Link legacyBehavior href="/blog-details">
                        Voice Usability Consideration For Partially Visually
                      </Link>
                    </h3>
                    <h6 className="author">
                      <i className="far fa-user" />
                      <a href="#">Matthew N. Davis</a>
                    </h6>
                    <Link legacyBehavior href="/blog-details">
                      <a className="main-btn filled-btn">
                        Read More
                        <i className="fas fa-paper-plane" />
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
              {/*=== Pagination ===*/}
              <ul className="gowilds-pagination wow fadeInDown mt-60 mb-30">
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
            <div className="col-xl-4">
              <div className="sidebar-widget-area">
                {/*=== Search Widget ===*/}
                <div className="sidebar-widget search-widget mb-30 wow fadeInUp">
                  <h4 className="widget-title">Search</h4>
                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="form_group">
                      <label>
                        <i className="far fa-search" />
                      </label>
                      <input
                        type="text"
                        className="form_control"
                        placeholder="Keywords"
                        name="search"
                        required
                      />
                    </div>
                  </form>
                </div>
                {/*=== Category Widget ===*/}
                <div className="sidebar-widget category-widget mb-30 wow fadeInUp">
                  <h4 className="widget-title">Category</h4>
                  <ul className="category-nav">
                    <li>
                      <a href="#">
                        Tent Camping
                        <i className="far fa-arrow-right" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        Family Camping
                        <i className="far fa-arrow-right" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        Wild Camping
                        <i className="far fa-arrow-right" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        Campfire <i className="far fa-arrow-right" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        Luxury Cabin <i className="far fa-arrow-right" />
                      </a>
                    </li>
                  </ul>
                </div>
                {/*=== Recent Post Widget ===*/}
                <div className="sidebar-widget recent-post-widget mb-40 wow fadeInUp">
                  <h4 className="widget-title">Recent News</h4>
                  <ul className="recent-post-list">
                    <li className="post-thumbnail-content">
                      <img
                        src="assets/images/blog/post-thumb-1.jpg"
                        alt="post thumb"
                      />
                      <div className="post-title-date">
                        <h5>
                          <Link legacyBehavior href="/blog-details">
                            Quality Assurance Requirements Web Dev Risk Manage
                          </Link>
                        </h5>
                        <span className="posted-on">
                          <i className="far fa-calendar-alt" />
                          <a href="#">November 23,2022</a>
                        </span>
                      </div>
                    </li>
                    <li className="post-thumbnail-content">
                      <img
                        src="assets/images/blog/post-thumb-2.jpg"
                        alt="post thumb"
                      />
                      <div className="post-title-date">
                        <h5>
                          <Link legacyBehavior href="/blog-details">
                            Deep Div Wonder World Of Displaem Filtering
                          </Link>
                        </h5>
                        <span className="posted-on">
                          <i className="far fa-calendar-alt" />
                          <a href="#">November 23,2022</a>
                        </span>
                      </div>
                    </li>
                    <li className="post-thumbnail-content">
                      <img
                        src="assets/images/blog/post-thumb-3.jpg"
                        alt="post thumb"
                      />
                      <div className="post-title-date">
                        <h5>
                          <Link legacyBehavior href="/blog-details">
                            Handling Mountin mountin Naviation Routes In Native
                          </Link>
                        </h5>
                        <span className="posted-on">
                          <i className="far fa-calendar-alt" />
                          <a href="#">November 23,2022</a>
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
                {/*=== Banner Widget ===*/}
                <div className="sidebar-widget sidebar-banner-widget wow fadeInUp mb-40">
                  <div className="banner-widget-content">
                    <div className="banner-img">
                      <img
                        src="assets/images/blog/banner-1.jpg"
                        alt="Post Banner"
                      />
                      <div className="hover-overlay">
                        <div className="hover-content">
                          <h4 className="title">
                            <a href="#">Swimming Pool</a>
                          </h4>
                          <p>
                            <i className="fas fa-map-marker-alt" />
                            Marrakesh, Morocco
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/*=== Tag Widget ===*/}
                <div className="sidebar-widget tag-cloud-widget gray-bg mb-40 wow fadeInUp">
                  <h4 className="widget-title">Products Tags</h4>
                  <a href="#">Camping</a>
                  <a href="#">Tent Camp</a>
                  <a href="#">Campfire</a>
                  <a href="#">Luxury Cabin</a>
                  <a href="#">Safari Tent</a>
                  <a href="#">House Tree</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*====== End Blog Section ======*/}
      {/*====== Start Gallery Section ======*/}
      <GallerySection />
    </Layout>
  );
};
export default BlogList;
