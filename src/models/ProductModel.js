class Product {
  constructor(
    userId,
    name,
    description,
    price,
    locationDesc,
    longitude,
    latitude,
    imageUrl,
    type,
    theme,
    category,
    height,
    width,
    rating,
    isBooked,
    startBooked,
    endBooked
  ) {
    this.userId = userId;
    this.name = name;
    this.description = description;
    this.price = price;
    this.locationDesc = locationDesc;
    this.longitude = longitude;
    this.latitude = latitude;
    this.imageUrl = imageUrl;
    this.type = type;
    this.theme = theme;
    this.category = category;
    this.height = height;
    this.width = width;
    this.rating = rating;
    this.isBooked = isBooked;
    this.startBooked = startBooked;
    this.endBooked = endBooked;
  }
}

module.exports = Product;
