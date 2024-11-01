import Registration from '../../models/user/Registration.js';
import Info from '../../models/Login/Info.js';
import Auction from '../../models/author/AuctionAuthor';

export const registerUserForAuction = async (req, res) => {
  console.log("Function called"); // Kiểm tra xem hàm có được gọi không
  console.log(req.body); // Kiểm tra thông tin nhận được

  const { userId, auctionId } = req.body; // Lấy userId và auctionId từ yêu cầu
  console.log("UserId: ", userId);
  try {
      // Kiểm tra xem người dùng và đấu giá có tồn tại không
      const user = await Info.findByPk(userId);
      const auction = await Auction.findByPk(auctionId);

      if (!user || !auction) {
          return res.status(404).json({
              errorCode: 1,
              message: 'User or auction not found',
          });
      }

      // Tạo mới một bản ghi đăng ký
      const registration = await Registration.create({ userId, auctionId });

      res.status(201).json({
          errorCode: 0,
          message: 'User registered for auction successfully',
          data: registration,
      });
  } catch (error) {
      console.error("Server error:", error); // In chi tiết lỗi ra console
      console.error("Error details:", JSON.stringify(error, null, 2)); // In thông tin lỗi chi tiết
      res.status(500).json({
          message: "Đã xảy ra lỗi!",
          error: error.message || error, // Trả về thông điệp lỗi cụ thể
      });
  }
};


// Lấy danh sách các cuộc đấu giá mà người dùng đã đăng ký
export const getRegisteredAuctions = async (req, res) => {
  try {
    const { userId } = req.params;

    // Kiểm tra nếu người dùng có tồn tại
    const user = await Info.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Lấy danh sách auctionId mà người dùng đã đăng ký từ bảng Registration
    const registrations = await Registration.findAll({
      where: { userId },
      attributes: ['auctionId'], // Chỉ cần lấy auctionId
    });

    // Nếu người dùng chưa đăng ký cuộc đấu giá nào
    if (registrations.length === 0) {
      return res.status(404).json({ message: 'No auctions registered for this user' });
    }

    // Lấy danh sách auctionId từ kết quả đăng ký
    const auctionIds = registrations.map(reg => reg.auctionId);

    // Lấy thông tin chi tiết về các cuộc đấu giá từ bảng Auction
    const registeredAuctions = await Auction.findAll({
      where: {
        id: auctionIds,
      },
    });

    return res.status(200).json(registeredAuctions);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
