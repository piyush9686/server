import Notification from "../models/notification.model.js";

class NotificationService {
  async createNotification(data) {
    return await Notification.create(data);
  }

  async createManyNotifications(notifications) {
    return await Notification.insertMany(notifications);
  }
}

export default new NotificationService();