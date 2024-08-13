const mongoose = require('mongoose');

const panelSchema = new mongoose.Schema({
  panel_name: {
    type: String,
    required: true
  },
  i_max: {
    type: Number, // Maximum current (Imax) in Amperes
    required: true
  },
  v_max: {
    type: Number, // Maximum voltage (Vmax) in Volts
    required: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

const Panel =  mongoose.model('Panel', panelSchema);

module.exports = Panel;