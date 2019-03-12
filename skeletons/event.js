class EventSkeleton {
  constructor({ title, address = '', location, description = '', date, categoryId }) {
    this.title = title;
    this.address = address;
    this.location = location;
    this.description = description;
    this.date = date;
    this.categoryId = categoryId;
  }
}

class EventNotification {
  constructor(event) {
    this.fill(event);
  }

  fill(event) {
    Object.entries(event).forEach(item => this[item[0]] = item[1]);
    delete this.createdAt;
    delete this.updatedAt;
    delete this.location;
    delete this.visitors;
    delete this.user;
    delete this.category;
  }
}

module.exports = {
  EventSkeleton,
  EventNotification
};