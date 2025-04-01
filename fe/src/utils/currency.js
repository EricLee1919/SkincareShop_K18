const convertCurrency = (number) => {
    // Use the Intl.NumberFormat object to format the number as Vietnamese currency
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(number);
  };
  
  export default convertCurrency;
  