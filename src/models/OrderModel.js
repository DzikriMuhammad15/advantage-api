class Order {
  constructor(
    userId,
    productId,
    imageProduct,
    productName,
    categoryProduct,
    locationProduct,
    advertisingContentId,
    fullname,
    phone,
    email,
    paymentMethod,
    startBooked,
    endBooked,
    status,
    totalPayment
  ) {
    this.userId = userId;
    this.productId = productId;
    this.imageProduct = imageProduct;
    this.productName = productName;
    this.categoryProduct = categoryProduct;
    this.locationProduct = locationProduct;
    this.advertisingContentId = advertisingContentId;
    this.fullname = fullname;
    this.phone = phone;
    this.email = email;
    this.paymentMethod = paymentMethod;
    this.startBooked = startBooked;
    this.endBooked = endBooked;
    this.status = status;
    this.totalPayment = totalPayment;
  }
}

module.exports = Order;
