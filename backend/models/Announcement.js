const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  bannerText: {
    type: String,
    default: ''
  },
  bannerActive: {
    type: Boolean,
    default: false
  },
  popupText: {
    type: String,
    default: ''
  },
  popupActive: {
    type: Boolean,
    default: false
  },
  discordAlertsActive: {
    type: Boolean,
    default: false
  },
  discordWebhookUrl: {
    type: String,
    default: ''
  }
});

// Since we only need one global document for announcements/settings
module.exports = mongoose.model('Announcement', announcementSchema);
