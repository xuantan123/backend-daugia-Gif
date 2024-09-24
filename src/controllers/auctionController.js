
import Auction from '../models/auctions.js';

export const createAuction = async (req, res) => {
    const { gif_url, starting_price, auction_end_time } = req.body;

    try {
        const auction = await Auction.create({
            gif_url,
            starting_price,
            auction_end_time,
        });

        res.status(201).json(auction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllAuctions = async (req, res) => {
    try {
        const auctions = await Auction.findAll({
            where: {
                auction_end_time: {
                    [Op.gt]: new Date(), // Lọc các phiên đấu giá chưa kết thúc
                },
            },
        });
        res.json(auctions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAuctionById = async (req, res) => {
    try {
        const auction = await Auction.findOne({
            where: {
                id: req.params.id,
                auction_end_time: {
                    [Op.gt]: new Date(), // Lọc phiên đấu giá chưa kết thúc
                },
            },
        });

        if (auction) {
            res.json(auction);
        } else {
            res.status(404).json({ message: 'Auction not found or has ended' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const placeBid = async (req, res) => {
    const { bidAmount, bidder } = req.body;
    try {
        const auction = await Auction.findOne({
            where: {
                id: req.params.id,
                auction_end_time: {
                    [Op.gt]: new Date(), // Lọc phiên đấu giá chưa kết thúc
                },
            },
        });

        if (auction) {
            if (bidAmount > auction.highest_bid) {
                auction.highest_bid = bidAmount;
                auction.highest_bidder = bidder;
                await auction.save();
                res.json({ message: 'Bid placed successfully!' });
            } else {
                res.status(400).json({ message: 'Bid amount is not high enough.' });
            }
        } else {
            res.status(404).json({ message: 'Auction not found or has ended' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
