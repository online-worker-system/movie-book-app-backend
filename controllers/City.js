const City = require("../models/City");

exports.addCity = async (req, res) => {
  try {
    // fetch data
    const { cityName } = req.body;

    // check city existance
    const findCity = await City.findOne({ cityName });
    if (findCity) {
      return res.status(400).json({
        success: false,
        message: "City Name already exist",
      });
    }

    // create city
    const changeCity = cityName.toLowerCase();
    const newCity = await City.create({
      cityName: changeCity,
    });

    return res.status(200).json({
      success: true,
      message: "City Added Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Error while create a City",
    });
  }
};

exports.getCities = async (req, res) => {
  try {
    const cities = await City.find();
    if (!cities) {
      return res.status(400).json({
        success: false,
        message: "There are no cities",
      });
    }

    return res.status(200).json({
      success: true,
      data: cities,
      message: "Cities fetched Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Error while fetching cities",
    });
  }
};
