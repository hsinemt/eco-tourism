import PageBanner from "@/src/components/PageBanner";
import Layout from "@/src/layout/Layout";
const Gallery = () => {
  return (
    <Layout>
      <PageBanner pageTitle={"Gallery"} />
      {/*====== Start Gallery Section ======*/}
      <section className="gallery-area pt-100 pb-70">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-6 col-sm-12">
              {/*=== Single Gallery Item ===*/}
              <div className="single-gallery-item mb-30 wow fadeInUp">
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
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12">
              {/*=== Single Gallery Item ===*/}
              <div className="single-gallery-item mb-30 wow fadeInUp">
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
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12">
              {/*=== Single Gallery Item ===*/}
              <div className="single-gallery-item mb-30 wow fadeInUp">
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
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12">
              {/*=== Single Gallery Item ===*/}
              <div className="single-gallery-item mb-30 wow fadeInUp">
                <div className="gallery-img">
                  <img
                    src="assets/images/gallery/gallery-4.jpg"
                    alt="Gallery Image"
                  />
                  <div className="hover-overlay">
                    <a
                      href="assets/images/gallery/gallery-4.jpg"
                      className="icon-btn img-popup"
                    >
                      <i className="far fa-plus" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12">
              {/*=== Single Gallery Item ===*/}
              <div className="single-gallery-item mb-30 wow fadeInUp">
                <div className="gallery-img">
                  <img
                    src="assets/images/gallery/gallery-5.jpg"
                    alt="Gallery Image"
                  />
                  <div className="hover-overlay">
                    <a
                      href="assets/images/gallery/gallery-5.jpg"
                      className="icon-btn img-popup"
                    >
                      <i className="far fa-plus" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12">
              {/*=== Single Gallery Item ===*/}
              <div className="single-gallery-item mb-30 wow fadeInUp">
                <div className="gallery-img">
                  <img
                    src="assets/images/gallery/gallery-6.jpg"
                    alt="Gallery Image"
                  />
                  <div className="hover-overlay">
                    <a
                      href="assets/images/gallery/gallery-6.jpg"
                      className="icon-btn img-popup"
                    >
                      <i className="far fa-plus" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*====== End Gallery Section ======*/}
    </Layout>
  );
};
export default Gallery;
