import React, { useEffect, useRef } from 'react';
import './index.css';

class EnquirySlider extends React.Component {
  constructor(props) {
    super(props);
    this.sliderRef = React.createRef();
  }

  componentDidMount() {
    this.currentIndex = 0;
    this.moveInterval = setInterval(this.moveSlider, 3000);
  }

  componentWillUnmount() {
    clearInterval(this.moveInterval);
  }

  moveSlider = () => {
    this.currentIndex = (this.currentIndex + 1) % Math.ceil(this.props.enquiries.length / 3);
    this.sliderRef.current.style.transform = `translateX(-${this.currentIndex * 100}%)`;
  };
  
  render() {
    const { enquiries } = this.props;
    const courseCounts = {};
    this.props.enquiries.forEach((enquiry) => {
      const { coursePreferred } = enquiry;
      courseCounts[coursePreferred] = (courseCounts[coursePreferred] || 0) + 1;
    });

    return (
      <div className="enquiry-slider-container">
        <div className="enquiry-slider" ref={this.sliderRef}>
          {enquiries.map((enquiry, index) => (
            <div className="enquiry-card" key={index}>
              <h3 className="enquiry-card-title">{enquiry.coursePreferred}</h3>
              <p className="enquiry-card-count">{`Count: ${courseCounts[enquiry.coursePreferred]}`}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default EnquirySlider;
