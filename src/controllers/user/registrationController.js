import Registration from '../../models/user/Registration.js';
import ProfileUser from '../../models/user/ProfileUser.js';
import Auction from '../../models/author/AuctionAuthor';

export const registerForAuction = async (req, res) => {
  try {
    const { userId, auctionId } = req.body;

    // Kiểm tra nếu người dùng và cuộc đấu giá có tồn tại
    const user = await ProfileUser.findByPk(userId);
    const auction = await Auction.findByPk(auctionId);

    if (!user || !auction) {
      return res.status(404).json({ error: 'User or Auction not found' });
    }

    // Tạo bản ghi đăng ký trong bảng Registration
    const [registration, created] = await Registration.findOrCreate({
      where: {
        userId: userId,
        auctionId: auctionId
      },
      defaults: {
        userId,
        auctionId
      }
    });

    if (!created) {
      return res.status(400).json({ error: 'User already registered for this auction' });
    }

    return res.status(201).json({ message: 'Registration successful', registration });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Lấy danh sách các cuộc đấu giá mà người dùng đã đăng ký
export const getRegisteredAuctions = async (req, res) => {
  try {
    const { userId } = req.params;

    // Kiểm tra nếu người dùng có tồn tại
    const user = await ProfileUser.findByPk(userId);
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
