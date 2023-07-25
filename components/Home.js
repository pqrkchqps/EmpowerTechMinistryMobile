import React from "react";
import image from "../images/spacex.jpg";
import online from "../images/online-presence.jpg";
//import { FaRegLightbulb } from "react-icons/fa";
import CircleBorder from "./CircleBorder";

function Home() {
  return (
    <div className="home">
      <section className="hero" style={{ backgroundImage: `url(${image})` }}>
        <div className="hero-text">
          <h1>Legendary Software</h1>
          <div className="quote">
            <p className="indent-text">Launch Your Business!</p>
          </div>
        </div>
      </section>
      <section className="text-section">
        <h3>Our Vision:</h3>
        <p className="check">
          At Legendary Software, we believe in the potential of every small
          business. Our driving force is to witness your business take off and
          reach new heights of success. We understand the challenges you face in
          today's competitive digital landscape, and that's why we are committed
          to providing you with the tools and solutions you need to thrive.
        </p>
      </section>
      <section className="vc_row element-row row vc_custom_1427887179004 highend_vc_custom_1427887179004">
        <div className="wpb_column vc_column_container vc_col-sm-12 hb-animate-element hb-bottom-to-top hb-in-viewport">
          <div className="vc_column-inner">
            <div className="wpb_wrapper">
              <div className="wpb_text_column wpb_content_element ">
                <div className="wpb_wrapper">
                  <div className="hb-process-steps clearfix steps-4 ">
                    <ul className="hb-process">
                      <li>
                        <div className="feature-box aligncenter">
                          <CircleBorder
                            size="110px"
                            borderWidth="1px"
                            borderColor="black"
                          >
                            <div className="icon-lightbulb ic-holder-1"><p>test</p></div>
                          </CircleBorder>
                          <h4 className="bold">Idea</h4>
                          <div className="hb-small-break"></div>
                          <p>
                            Sed bibendum quam sem, sit amet interdum justo
                            fringilla id. Praesent adipiscing ac tortor.
                          </p>
                        </div>
                      </li>

                      <li>
                        <div className="feature-box aligncenter">
                          <i className="icon-star-half-full ic-holder-1"></i>
                          <h4 className="bold">Design</h4>
                          <div className="hb-small-break"></div>
                          <p>
                            Sed bibendum quam sem, sit amet interdum justo
                            fringilla id. Praesent adipiscing ac tortor.
                          </p>
                        </div>
                      </li>

                      <li>
                        <div className="feature-box aligncenter">
                          <i className="icon-wrench ic-holder-1"></i>
                          <h4 className="bold">Development</h4>
                          <div className="hb-small-break"></div>
                          <p>
                            Sed bibendum quam sem, sit amet interdum justo
                            fringilla id. Praesent adipiscing ac tortor.
                          </p>
                        </div>
                      </li>

                      <li>
                        <div className="feature-box aligncenter">
                          <i className="icon-rocket ic-holder-1"></i>
                          <h4 className="bold">Deployment</h4>
                          <div className="hb-small-break"></div>
                          <p>
                            Sed bibendum quam sem, sit amet interdum justo
                            fringilla id. Praesent adipiscing ac tortor.
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        className="hero"
        style={{ backgroundImage: `url(${online})` }}
      ></section>
      <section className="text-section">
        <h3>Our Mission:</h3>
        <p className="check">
          In this digital era, having a strong online presence is essential for
          business growth. Our primary mission is to give your business a robust
          online identity. Our expert team will work tirelessly to design a
          website that truly reflects your vision and values, leaving a lasting
          impression on your customers.
        </p>
      </section>
      <section>
        <h1 className="section-title">How We Help You Succeed</h1>
        <div className="side-by-side">
          <div className="card">
            <h3>Strategic Design</h3>
            <p>
              We don't just create websites; we craft digital experiences. Our
              websites are not only visually appealing but also strategically
              optimized to drive traffic and convert visitors into loyal
              customers. With our innovative solutions, you'll experience an
              upsurge in leads and revenue, propelling your business towards
              unparalleled success.
            </p>
          </div>
          <div className="card">
            <h3>Collaborative Approach</h3>
            <p>
              At Legendary Software, we believe in collaboration and
              transparency. We work closely with you, understanding your unique
              needs and goals, to deliver tailor-made solutions that suit your
              business like a glove. Your success is our success, and together,
              we'll build a long-lasting partnership to help your business
              flourish.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
