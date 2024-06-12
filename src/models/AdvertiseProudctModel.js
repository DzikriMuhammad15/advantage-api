class AdvertiseProduct {
    constructor(name, description, locationDesc, longitude, latitude, imageUrl, type, theme, category, height, width, price, rating, isBooked, startBooked, endBooked) {
        this.name = name;
        this.description = description;
        this.locationDesc = locationDesc;
        this.longitude = longitude;
        this.latitude = latitude;
        this.imageUrl = imageUrl;
        this.type = type;
        this.theme = theme;
        this.category = category;
        this.height = height;
        this.width = width;
        this.price = price;
        this.rating = rating;
        this.isBooked = isBooked;
        this.startBooked = startBooked;
        this.endBooked = endBooked;
    }
}

module.exports = AdvertiseProduct;