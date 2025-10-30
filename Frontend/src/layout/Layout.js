import { Fragment, useEffect } from "react";
import niceSelect from "react-nice-select";
import ImageView from "../components/ImageView";
import VideoPopup from "../components/VideoPopup";
import { animation } from "../utils";
import Footer from "./Footer";
import Header from "./header/Index";
const Layout = ({ header, children, footerBG, noFooter, extraClass }) => {
  useEffect(() => {
    niceSelect();
  }, []);
  useEffect(() => {
    animation();
  }, []);
  return (
    <Fragment>
      <VideoPopup />
      <ImageView />
      <Header header={header} />
      {children}
      {!noFooter && <Footer bg={footerBG} extraClass={extraClass} />}
    </Fragment>
  );
};
export default Layout;
