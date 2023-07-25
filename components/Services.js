import React from "react";
import { FaLaptop, FaMobileAlt } from "react-icons/fa";

function Services() {
  return (
    <div className="services">
      <h2>Our Services</h2>
      <div className="service">
        <FaLaptop className="icon" />
        <h3>Landing Pages</h3>
        <p>
          Create stunning landing pages that convert visitors into customers.
        </p>
      </div>
      <div className="service">
        <FaLaptop className="icon" />
        <h3>Web Apps</h3>
        <p>
          Develop powerful web applications tailored to your business needs.
        </p>
      </div>
      <div className="service">
        <FaMobileAlt className="icon" />
        <h3>Mobile Apps</h3>
        <p>Build user-friendly mobile apps for iOS and Android platforms.</p>
      </div>
    </div>
  );
}

export default Services;
