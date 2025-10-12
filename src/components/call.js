import React, { useState, useEffect } from 'react';  // Import useState and useEffect 
import { Link } from 'react-router-dom';
import axios from 'axios';  // Import Axios
import { useLocation } from 'react-router-dom';

import '../styles/call/header.css';
import '../styles/call/call.css';

function Call() {
  const [name, setName] = useState('');       // State for name
  const [email, setEmail] = useState('');     // State for email
  const [phone, setPhone] = useState('');     // State for phone
  const [website, setWebsite] = useState(''); // State for website
  const [message, setMessage] = useState(''); // State for message
  const [submitted, setSubmitted] = useState(false);  // State to handle form submission
  const [loading, setLoading] = useState(false); // State to handle loading
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages

  const location = useLocation();

  useEffect(() => {
    const scrollPositioncall = sessionStorage.getItem('scrollPositioncall');
    if (scrollPositioncall) {
      window.scrollTo(0, parseInt(scrollPositioncall, 10));
    }
    const handleScroll = () => {
      sessionStorage.setItem('scrollPositioncall', window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location]);

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();  // Prevent default form submission behavior
    setLoading(true); // Start loading

    // Add "http://" to website if it doesn't start with "http://" or "https://"
    let formattedWebsite = website;
    if (!website.startsWith('http://') && !website.startsWith('https://')) {
      formattedWebsite = 'http://' + website;
    }

    const formData = {
      name,
      email,
      phone,
      website: formattedWebsite,
      message
    };

    console.log(formData);  // This will print formData in the browser console

    // Send POST request to Django backend
    axios.post('https://lohithreddy.pythonanywhere.com/api/call-request/', formData)  // Update with your API endpoint
      .then(response => {
        console.log('Form submitted successfully:', response.data);
        setSubmitted(true);  // Update state when form is successfully submitted
        setLoading(false); // Stop loading
        setErrorMessage(''); // Clear any previous error messages
      })
      .catch(error => {
        console.error('There was an error submitting the form!', error);
        setLoading(false); // Stop loading
        setErrorMessage('You have entered an invalid email or URL. Please check your input.'); // Set error message
      });
  };

  return (
    <div>


      <section className='call-section'>
        <div className='call-form'>
          <div className='form-heading'>
            <h1>contact us</h1>
          </div>
          <div className='form-text'>
            {/* Form inputs with onChange handlers */}
            <input
              type="text"
              placeholder='*Name'
              value={name}
              onChange={(e) => setName(e.target.value)}  // Update name state
            />
            <input
              type="email"
              placeholder='*Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}  // Update email state
            />
            <input
              type="text"
              placeholder='*Phone'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}  // Update phone state
            />
            <input
              type="text"
              placeholder='*Website URL'
              value={website}
              onChange={(e) => setWebsite(e.target.value)}  // Update website state
            />
            <textarea
              placeholder='Tell us about your goals'
              className='textmessage'
              value={message}
              onChange={(e) => setMessage(e.target.value)}  // Update message state
            />

            <button className='submit-button' onClick={handleSubmit} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
            {submitted && <p>Form submitted successfully!</p>}  {/* Confirmation message */}
            {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Error message */}
          </div>
        </div>

        <div className='call-text'>
          <div>
            <h1>What Happens Next?</h1>
          </div>
          <div>
            <h4>Meeting Scheduled</h4>
            <p><span className="arrow">➜</span> We'll contact you within 24 hours to book a call.</p>
          </div>

          <div>
            <h4>Project Discussion</h4>
            <p><span className="arrow">➜</span> We’ll explore your SEO needs and objectives.</p>
          </div>

          <div>
            <h4>Plan Selection</h4>
            <p><span className="arrow">➜</span> Choose the best plan to meet your goals.</p>
          </div>

          <div>
            <h4>Let’s Get Started!</h4>
            <p><span className="arrow">➜</span> Once confirmed, we’ll begin optimizing right away.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Call;
