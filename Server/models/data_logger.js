const mongoose = require('mongoose');

const dataLoggerSchema = new mongoose.Schema({
  panel_name:{
    type:String,
    required:true,
  },
  current_a: {
    type: Number, // Measured current (I) in Amperes
    required: true
  },
  voltage_v: {
    type: Number, // Measured voltage (V) in Volts
    required: true
  },
  power_w: {
    type: Number, // Calculated power (P) in Watts
    required: true
  },
  luminosity_lux: {
    type: Number, // Measured luminosity (Lux)
    required: true
  },
  luxLimit: {
    type:Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now, // Automatically set the date and time when the entry is created
    required: true
  }
}, {
  timestamps: false // Disable automatic createdAt and updatedAt fields since we use a custom timestamp
});

const Data = mongoose.model('DataLogger', dataLoggerSchema);

module.exports = Data;
