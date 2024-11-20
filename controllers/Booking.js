const QRCode = require("qrcode");
const User = require("../models/User");
const Booking = require("../models/Booking");


// Make sure to import the User model

exports.bookShow = async (req, res) => {
  try {
    const { showId, seatsForBook, totalAmount } = req.body;
    console.log("req.body: ", req.body);

    const userId = req.user.id;
    console.log("user Id:", userId);

    // Step 1: Create the booking
    const newBooking = await Booking.create({
      showId: showId,
      bookedSeats: seatsForBook,
      status: "BOOKED",
      totalAmount: totalAmount ,
      userId: userId,
    });

    if (!newBooking) {
      return res.status(401).json({
        success: false,
        message: "Error while Booking",
      });
    }

    // Step 2: Generate QR code with the booking ID
    const qrCodeData = `Booking ID: ${newBooking._id}`;
    const qrCodeSrc = await QRCode.toDataURL(qrCodeData);

    // Step 3: Update the booking entry with the QR code
    newBooking.qrImage = qrCodeSrc;
    await newBooking.save();

    // Step 4: Update the user's booking list
    const updateUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: { booking: newBooking._id },
      },
      { new: true }
    );

    if (!updateUser) {
      return res.status(401).json({
        success: false,
        message: "User Booking is Not updated",
      });
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Booking confirmed",
      bookingId: newBooking._id,
      qrCode: qrCodeSrc,
    });

  } catch (error) {
    console.log("Something went wrong while booking show");
    return res.status(500).json({
      success: false,
      message: "Something went wrong while booking show",
      error: error.message,
    });
  }
};




exports.fetchAllTickets = async (req,res) =>{
    try{
        const userId=req.user.id;
        const findUser = await User.findById(userId).populate({
            path: "booking",
            populate: [
              {
                path: "showId", // Populate showId
                select: "-showSeats", // Exclude showSeats
                populate: [
                  {
                    path: "cinemaId", // Populate cinemaId inside showId
                    populate: {
                      path: "cityId", // Populate cityId inside cinemaId
                    },
                  },
                  {
                    path: "movieId", // Populate movieId inside showId
                  },
                ],
              },
              {
                path: "bookedSeats", // Populate bookedSeats
                populate: {
                  path: "seatId", // Populate seatId inside bookedSeats
                },
              },
            ],
          });
          
          if (!findUser) {
            return res.status(404).json({
              success: false,
              message: "User not found",
            });
          }
          
          // Return the refined response
          return res.status(200).json({
            success: true,
            message: "Bookings fetched successfully",
            bookings: findUser.booking,
          });
          
      

    }
    catch(error)
    {
        return res.status(500)
        .json({
            success:false,
            message:"Error while Feching Tickets"
        })
    }
}