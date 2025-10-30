import Slider from "react-slick";
import { sliderActive5Item } from "../sliderProps";
const GallerySection = () => {
  return (
    <section className="gallery-section mbm-150">
      <div className="container-fluid">
        <Slider
          {...sliderActive5Item}
          className="slider-active-5-item wow fadeInUp"
        >
          {/*=== Single Gallery Item ===*/}
          <div className="single-gallery-item">
            <div className="gallery-img">
              <img src="assets/images/gallery/gl-1.jpg" alt="Gallery Image" />
              <div className="hover-overlay">
                <a
                  href="assets/images/gallery/gl-1.jpg"
                  className="icon-btn img-popup"
                >
                  <i className="far fa-plus" />
                </a>
              </div>
            </div>
          </div>
          {/*=== Single Gallery Item ===*/}
          <div className="single-gallery-item">
            <div className="gallery-img">
              <img src="assets/images/gallery/gl-2.jpg" alt="Gallery Image" />
              <div className="hover-overlay">
                <a
                  href="assets/images/gallery/gl-2.jpg"
                  className="icon-btn img-popup"
                >
                  <i className="far fa-plus" />
                </a>
              </div>
            </div>
          </div>
          {/*=== Single Gallery Item ===*/}
          <div className="single-gallery-item">
            <div className="gallery-img">
              <img src="assets/images/gallery/gl-3.jpg" alt="Gallery Image" />
              <div className="hover-overlay">
                <a
                  href="assets/images/gallery/gl-3.jpg"
                  className="icon-btn img-popup"
                >
                  <i className="far fa-plus" />
                </a>
              </div>
            </div>
          </div>
          {/*=== Single Gallery Item ===*/}
          <div className="single-gallery-item">
            <div className="gallery-img">
              <img src="assets/images/gallery/gl-4.jpg" alt="Gallery Image" />
              <div className="hover-overlay">
                <a
                  href="assets/images/gallery/gl-4.jpg"
                  className="icon-btn img-popup"
                >
                  <i className="far fa-plus" />
                </a>
              </div>
            </div>
          </div>
          {/*=== Single Gallery Item ===*/}
          <div className="single-gallery-item">
            <div className="gallery-img">
              <img src="assets/images/gallery/gl-5.jpg" alt="Gallery Image" />
              <div className="hover-overlay">
                <a
                  href="assets/images/gallery/gl-5.jpg"
                  className="icon-btn img-popup"
                >
                  <i className="far fa-plus" />
                </a>
              </div>
            </div>
          </div>
          {/*=== Single Gallery Item ===*/}
          <div className="single-gallery-item">
            <div className="gallery-img">
              <img src="assets/images/gallery/gl-3.jpg" alt="Gallery Image" />
              <div className="hover-overlay">
                <a
                  href="assets/images/gallery/gl-3.jpg"
                  className="icon-btn img-popup"
                >
                  <i className="far fa-plus" />
                </a>
              </div>
            </div>
          </div>
        </Slider>
      </div>
    </section>
  );
};
export default GallerySection;
