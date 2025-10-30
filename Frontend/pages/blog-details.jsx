import GallerySection from "@/src/components/GallerySection";
import PageBanner from "@/src/components/PageBanner";
import Layout from "@/src/layout/Layout";
import Link from "next/link";
const BlogDetails = () => {
  return (
    <Layout extraClass={"pt-160"}>
      <PageBanner pageTitle={"Blog Details"} />
      {/*====== Start Blog Details Section ======*/}
      <section className="blog-details-section pt-100 pb-70">
        <div className="container">
          <div className="row">
            <div className="col-xl-8">
              {/*=== Blog Details Wrapper ===*/}
              <div className="blog-details-wrapper pr-lg-50">
                <div className="blog-post mb-60 wow fadeInUp">
                  <div className="post-thumbnail">
                    <img
                      src="assets/images/blog/blog-single-1.jpg"
                      alt="Blog Image"
                    />
                  </div>
                  <div className="post-meta text-center pt-25 pb-15 mb-25">
                    <span>
                      <i className="far fa-user" />
                      <a href="#">Matthew N. Davis</a>
                    </span>
                    <span>
                      <i className="far fa-calendar-alt" />
                      <a href="#">November 23,2022</a>
                    </span>
                    <span>
                      <i className="far fa-comment" />
                      <a href="#">Comments (05)</a>
                    </span>
                  </div>
                  <div className="main-post">
                    <div className="entry-content">
                      <h3 className="title">
                        50 Resources And Tools To Turbocharge Amazon Product
                        Scraper Copywriting Skills
                      </h3>
                      <p>
                        Sit amet consectetur adipiscing elit. Phasellus viverra
                        justo, orci, interdum purus purus vitae vulputate nec
                        Vel nunc vivamus felis sit est, mus aliquam massa
                        volutpat. Consectetur scelerisque tincidunt vulputate
                        quis. Metus eu, nisi nibh et adipiscing natoque
                        tincidunt. Sed morbi arcu integer vestibulum scelerisque
                        tincidunt mauris. Lectus molestie vestibulum ac, nec.
                        Nisl rutrum cras dictum lectus molestie leoenim sapien
                        aenean lectus. Platea enim nunc feugiat mauris, ut in
                        volutpat nunc. Nulla sit rhoncus consequat malesuada
                        magna diam tempor mauris proin vulputate tortorpurus
                        nunc elementum quam pharetra mauris Habitant massa
                        turpis nunc eu. Aliquet at velit etiam turpis a arcu
                        consectetur sed.
                      </p>
                      <h4>Build Camping Easily</h4>
                      <p>
                        Metus eu, nisi nibh et adipiscing natoque tincidunt. Sed
                        morbi arcu integer vestibulum scelerisque tincidunt
                        mauris. Lectus molestie vestibulum ac, nec. Nisl rutrum
                        cras dictum lectus molestie leoenim sapien aenean
                        lectus. Platea enim nunc feugiat mauris, ut in volutpat
                        nunc. Nulla sit rhoncus consequat
                      </p>
                      <blockquote className="block-quote">
                        <img
                          src="assets/images/blog/quote.png"
                          alt="quote image"
                        />
                        <h3>
                          Handling Mounting And Unmounting Given Navigation
                          Routes In React Native
                        </h3>
                        <span>Johnny M. Martin</span>
                      </blockquote>
                    </div>
                  </div>
                  <div className="entry-footer wow fadeInUp">
                    <div className="tag-links">
                      <h6>Popular Tags</h6>
                      <a href="#">Camping</a>
                      <a href="#">Tent Camp</a>
                      <a href="#">Couple Cabin</a>
                    </div>
                    <div className="social-share">
                      <h6>Share News :</h6>
                      <a href="#">
                        <i className="fab fa-facebook-f" />
                      </a>
                      <a href="#">
                        <i className="fab fa-twitter" />
                      </a>
                      <a href="#">
                        <i className="fab fa-instagram" />
                      </a>
                      <a href="#">
                        <i className="fab fa-linkedin-in" />
                      </a>
                    </div>
                  </div>
                </div>
                {/*===  Post Author Box  ===*/}
                <div className="post-author-box d-flex pb-60 mb-60 wow fadeInUp">
                  <div className="author-thumb">
                    <img
                      src="assets/images/blog/author-1.jpg"
                      alt="post author"
                    />
                  </div>
                  <div className="author-content">
                    <h5>Bruno R. Bouchard</h5>
                    <span className="position">Author</span>
                    <p>
                      Donec duis enim ipsum odio at cursus. Fames semper enim
                      integer epsum ultricies faucibus augue enim semper
                    </p>
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
                {/*===  Post Navigation  ===*/}
                <div className="post-navigation-item pb-30 mb-55 wow fadeInUp">
                  <div className="prev-post post-nav-item d-flex mb-30">
                    <div className="thumb">
                      <img
                        src="assets/images/blog/prev-post.jpg"
                        alt="Post Thumb"
                      />
                    </div>
                    <div className="content">
                      <h6>
                        <Link legacyBehavior href="/blog-details">
                          <a>
                            Web Quality Assurance Requirements To Web Dev Risk
                            Manage
                          </a>
                        </Link>
                      </h6>
                      <span className="post-date">
                        <a href="#">
                          <i className="far fa-calendar-alt" />
                          November 23,2022
                        </a>
                      </span>
                    </div>
                  </div>
                  <div className="next-post post-nav-item d-flex mb-30">
                    <div className="thumb">
                      <img
                        src="assets/images/blog/next-post.jpg"
                        alt="Post Thumb"
                      />
                    </div>
                    <div className="content">
                      <h6>
                        <Link legacyBehavior href="/blog-details">
                          <a>
                            Deep Dive Into Wonder World Of Displaements
                            Filtering
                          </a>
                        </Link>
                      </h6>
                      <span className="post-date">
                        <a href="#">
                          <i className="far fa-calendar-alt" />
                          November 23,2022
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
                {/*===  Comments Area  ===*/}
                <div className="comments-area mb-60 wow fadeInUp">
                  <h5 className="comments-title mb-40">Popular Comments</h5>
                  <ul className="comments-list">
                    <li>
                      <div className="comment">
                        <div className="comment-avatar">
                          <img
                            src="assets/images/blog/comment-1.jpg"
                            alt="comment author"
                          />
                        </div>
                        <div className="comment-wrap">
                          <div className="comment-author-content">
                            <span className="author-name">
                              Jonathan M. Dickinson
                              <span className="date">September 25, 2022</span>
                            </span>
                            <p>
                              Nov ut perspiciatis unde omnis iste natus sit
                              voluptatem accusantium doloremque laudantium,
                              totam rem aperiam quae abillo inventore veritatis
                            </p>
                            <a href="#" className="btn-link">
                              Reply
                              <i className="far fa-angle-double-right" />
                            </a>
                          </div>
                        </div>
                      </div>
                      <ul className="comment-reply">
                        <li>
                          <div className="comment">
                            <div className="comment-avatar">
                              <img
                                src="assets/images/blog/comment-2.jpg"
                                alt="comment author"
                              />
                            </div>
                            <div className="comment-wrap">
                              <div className="comment-author-content">
                                <span className="author-name">
                                  Jonathan M. Dickinson
                                  <span className="date">
                                    September 25, 2022
                                  </span>
                                </span>
                                <p>
                                  Nov ut perspiciatis unde omnis iste natus sit
                                  voluptatem accusantium doloremque laudantium,
                                  totam rem aperiam quae abillo inventore
                                  veritatis
                                </p>
                                <a href="#" className="btn-link">
                                  Reply
                                  <i className="far fa-angle-double-right" />
                                </a>
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <div className="comment">
                        <div className="comment-avatar">
                          <img
                            src="assets/images/blog/comment-3.jpg"
                            alt="comment author"
                          />
                        </div>
                        <div className="comment-wrap">
                          <div className="comment-author-content">
                            <span className="author-name">
                              Michael C. Paille
                              <span className="date">September 25, 2022</span>
                            </span>
                            <p>
                              Nov ut perspiciatis unde omnis iste natus sit
                              voluptatem accusantium doloremque laudantium,
                              totam rem aperiam quae abillo inventore veritatis
                            </p>
                            <a href="#" className="btn-link">
                              Reply
                              <i className="far fa-angle-double-right" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                {/*===  Comments Form  ===*/}
                <div
                  className="comments-respond mb-30 wow fadeInUp"
                  id="comment-respond"
                >
                  <h3 className="comments-heading">Leave a Comments</h3>
                  <p>Send us your valuable feedback about our services</p>
                  <form className="comment-form">
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="form_group">
                          <input
                            type="email"
                            className="form_control"
                            placeholder="Email Address"
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
                            placeholder="Enter Name"
                            name="email"
                            required
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="form_group">
                          <textarea
                            name="message"
                            className="form_control"
                            rows={4}
                            placeholder="Write Comments"
                            defaultValue={""}
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="form_group">
                          <button className="main-btn primary-btn">
                            Send comments
                            <i className="fas fa-angle-double-right" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-xl-4">
              <div className="sidebar-widget-area">
                {/*=== Search Widget ===*/}
                <div className="sidebar-widget search-widget mb-30 wow fadeInUp">
                  <h4 className="widget-title">Search</h4>
                  <form>
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
      {/*====== End Blog Details Section ======*/}
      {/*====== Start Gallery Section ======*/}
      <GallerySection />
    </Layout>
  );
};
export default BlogDetails;
