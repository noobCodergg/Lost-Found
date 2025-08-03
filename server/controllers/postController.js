const postModel = require('../models/postModel')
const fs = require('fs');
const path = require('path');

exports.uploadPost = async (req, res) => {
  try {
    let {
      itemName,
      category,
      description,
      status,
      date,
      user
    } = req.body;

  
    const image = req.file;

    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    const newPost = await postModel.create({
       itemName,
      category,
      description,
      status,
      date,
      imageUrl: image.path,
      user
    });

    res.status(200).json({
      message: "Post uploaded successfully",
      data: newPost,
    });
  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};




exports.getItems = async (req, res) => {
  try {
    const { itemName, category, date, status } = req.query;

    const matchStage = {
      status: status || 'found', // default to 'found' if not provided
    };

    if (itemName) {
      matchStage.itemName = { $regex: itemName, $options: 'i' }; // case-insensitive search
    }

    if (category) {
      matchStage.category = category;
    }

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      matchStage.date = { $gte: start, $lt: end };
    }

    const pipeline = [
      { $match: matchStage },
      { $sort: { createdAt: -1 } },
    ];

    const results = await postModel.aggregate(pipeline);
    console.log(results);
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};





