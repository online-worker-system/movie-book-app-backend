const City = require("../models/City");

exports.addCity = async (req, res) => {
  try {
    // fetch data
    const { cityName } = req.body;

    // check city existance
    const findCity = await City.findOne({ cityName });
    if (findCity) {
      return res.status(401).json({
        success: false,
        message: "City Name already exist",
      });
    }

    // create city
    const changeCity = cityName.toLowerCase();
    const newCity = await City.create({
      cityName: changeCity,
    });
    console.log("newcity: ", newCity);

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
