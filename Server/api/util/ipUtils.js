const extractIPv4 = (clientIP) => {
    return clientIP.includes('::ffff:') ? clientIP.split('::ffff:')[1] : clientIP;
  };
  
  module.exports = {
    extractIPv4
  };
  