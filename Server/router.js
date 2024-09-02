const mongoose = require("mongoose");
const Data = require("./models/data_logger");
const Panel = require("./models/panel_schema");
require('dotenv').config();

mongoose
  .connect(
    process.env.MONGO_URI
  )
  .then(() => console.log("connected to database"))
  .catch((error) => console.log(error));


const storeSensorValues = async (req, res) => {
    try {
        // Destructure the required values from the request query
        const { lux, i, v, panel_name, luxLimit } = req.query;

        // Check if all necessary values are provided
        if (!lux || !i || !v ) {
            return res.status(400).json({ message: "Missing required sensor values", key: 0 });
        }

        // Create a new DataLogger document with the received values
        const newValues = new Data({
            panel_name,
            current_a: i,
            voltage_v: v,
            power_w: i*v,
            luminosity_lux: lux,
            luxLimit,
        });

        // Save the document to the database
        const response = await newValues.save();

        // If successful, respond with a success message
        res.json({ message: "Successfully stored values", key: 1, data: response });
    } catch (error) {
        // Handle any errors that occur during the process
        console.error("Error storing sensor values:", error);
        res.status(500).json({ message: "Failed to store sensor values", key: 0, error: error.message });
    }
};


const getStatistics = async (req, res) => {
    try {
        const { panel_name } = req.query;
        console.log("panel name is", panel_name)
        const values = await Data.find({ panel_name });

        if (values && values.length > 0) {
            const updatedValues = values.map(value => ({
                luxValue: value.luminosity_lux,
                pValue: value.power_w,
                luxLimit: value.luxLimit,
            }));

            res.json({
                message: "Found values for the panel successfully",
                key: 1,
                values:updatedValues
            });
        } else {
            res.json({
                message: "No values found for the specified panel",
                key: 0
            });
        }
    } catch (error) {
        res.status(500).json({ message: "Error retrieving statistics", error });
    }
};


const getPanelDetails = async(req, res) => {
    const {i_max, v_max, panel_name} = req.body;

    const newPanel = new Panel({
        i_max,
        v_max,
        panel_name
    });

    const response = await newPanel.save();

    if(response) {
        res.json({message:"succesfully stored panel details", key:1});
    }
}


module.exports = {
    storeSensorValues,
    getStatistics,
    getPanelDetails,
}
