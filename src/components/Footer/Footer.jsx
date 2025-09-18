import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear(); // 動態取得目前年份

  return (
    <footer className="footer">
      <p className="footer__text">
        Copyright © {currentYear} 臺灣中小企業銀行
      </p>
    </footer>
  );
};

export default Footer;
