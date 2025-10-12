import React, { useState } from 'react';
import '../../styles/discover/discover.css';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What kind of flowers does Bharat Petals deliver daily?",
      answer: "We deliver fresh flowers sourced directly from farms, perfect for pooja and daily rituals, ensuring quality and freshness every day."
    },
    {
      question: "Can I choose the delivery time slot for my flowers?",
      answer: "Yes! You can select your preferred delivery slot—morning or evening—to receive your flowers at a convenient time."
    },
    {
      question: "Is it possible to customize my flower subscription plan?",
      answer: "Absolutely! We offer customizable plans tailored to your specific pooja needs and flower preferences."
    },
    {
      question: "Do you offer one-time or special occasion flower orders?",
      answer: "Yes, besides subscriptions, you can place one-time orders for festivals, events, or any special occasions."
    },
    {
      question: "Are there any discounts or offers available for subscribers?",
      answer: "We regularly provide exclusive offers and seasonal discounts to our subscribers to add more value."
    },
    {
      question: "How fresh are the flowers when delivered?",
      answer: "Our flowers are harvested fresh daily from farms and delivered promptly to ensure maximum freshness."
    },
    {
      question: "Can I pause or change my subscription plan?",
      answer: "Yes, you can pause, modify, or cancel your subscription plan anytime by contacting our support team."
    },
    {
      question: "Do you deliver to all locations?",
      answer: "We currently deliver to select locations; please check our delivery areas or contact us for more details."
    },
    {
      question: "What happens if I’m not home during the delivery time?",
      answer: "We’ll contact you to reschedule delivery or leave the flowers in a safe designated spot as per your instructions."
    },
    {
      question: "How do I contact customer support for my subscription?",
      answer: "You can reach us via phone at 906-314-3344 or email us through our website contact form anytime."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div id="faq-section">
      <h2>Frequently Asked Questions</h2>
      {faqs.map((faq, index) => (
        <div
          key={index}
          className={`faq-item ${openIndex === index ? 'active' : ''}`}
          onClick={() => toggleFAQ(index)}
        >
          <div className="faq-question">
            {faq.question}
            <span className="arrow">{openIndex === index ? '▲' : '▼'}</span>
          </div>
          {openIndex === index && <div className="faq-answer">{faq.answer}</div>}
        </div>
      ))}
    </div>
  );
};

export default FAQ;
