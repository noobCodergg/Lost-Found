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
      user,
      latitude,
      longitude
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
      user,
      latitude,
      longitude
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
      status: status || 'found', 
    };

    if (itemName) {
      matchStage.itemName = { $regex: itemName, $options: 'i' }; 
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
   
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};


exports.getItemById = async(req,res)=>{
  try{
    const {id} = req.params;
    console.log(id)
    const data = await postModel.findById({_id:id})
    res.status(200).json(data)
  }catch(error){
    console.log(error)
    res.status(500).json("Internal Server Error")
  }
}


const Report = require('../models/reportModel'); 

exports.submitReport = async (req, res) => {
  try {
    const { itemId, userId, message } = req.body;

   
    if (!itemId || !userId || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    
    const newReport = new Report({
      itemId,
      userId,
      message,
    });

    
    await newReport.save();

    res.status(201).json({ success: true, message: 'Report submitted successfully', data: newReport });
  } catch (error) {
    console.error('Error submitting report:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


exports.getReport = async (req, res) => {
  try {
    const reports = await Report.aggregate([
      {
        // Convert string IDs to ObjectId for the lookup
        $addFields: {
          itemObjId: { $toObjectId: "$itemId" },
          userObjId: { $toObjectId: "$userId" },
        },
      },
      {
        $lookup: {
          from: "items",
          localField: "itemObjId",
          foreignField: "_id",
          as: "itemDetails",
        },
      },
      { $unwind: { path: "$itemDetails", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "userObjId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          itemId: 1,
          userId: 1,
          message: 1,
          createdAt: 1,
          itemDetails: 1,           
          userName: "$userDetails.name", 
        },
      },
    ]);

    console.log(reports); 
    res.status(200).json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.deleteItem = async (req, res) => {
  try {
    const {  itemId } = req.params;
   
    if (!itemId) {
      return res.status(400).json({ success: false, message: "Item ID is required" });
    }

   
    const deletedItem = await postModel.findByIdAndDelete(itemId);

    if (!deletedItem) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

   
    await Report.deleteMany({ itemId });

    res.status(200).json({ success: true, message: "Item and related reports deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


const Verification = require('../models/verificationModel');

exports.postQuestion = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { userId, questions } = req.body;

    if (!reportId || !userId || !questions || !questions.length) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

   
    const formattedQuestions = questions.map(q => ({ question: q, answer: "" }));

    const newVerification = new Verification({
      reportId,
      userId,
      questions: formattedQuestions,
    });

    await newVerification.save();

    res.status(201).json({ success: true, message: 'Questions saved successfully', data: newVerification });
  } catch (error) {
    console.error('Error saving verification questions:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const mongoose = require('mongoose');

exports.getUserQuestions = async (req, res) => {
  try {
    const { userId } = req.params;
    const verifications = await Verification.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } }, // ✅ use 'new'

      {
        $lookup: {
          from: 'reports',
          localField: 'reportId',
          foreignField: '_id',
          as: 'reportDetails',
        },
      },
      { $unwind: '$reportDetails' },

      {
        $lookup: {
          from: 'items',
          localField: 'reportDetails.itemId',
          foreignField: '_id',
          as: 'itemDetails',
        },
      },
      { $unwind: { path: '$itemDetails', preserveNullAndEmptyArrays: true } },

      {
        $project: {
          _id: 1,
          questions: 1,
          reportId: '$reportDetails._id',
          itemName: '$itemDetails.itemName',
          imageUrl: '$itemDetails.imageUrl',
        },
      },
    ]);

    res.status(200).json({ success: true, data: verifications });
  } catch (error) {
    console.error('Error fetching user questions:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


exports.postAnswer = async (req, res) => {
  try {
    const { reportId } = req.params;
   

    // unwrap nested structure
    let answersArray = req.body.answers;
    if (answersArray && answersArray.answers) {
      answersArray = answersArray.answers;
    }

    console.log("Processed answersArray:", answersArray);

    if (!answersArray || !Array.isArray(answersArray) || answersArray.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid answers format" });
    }

    const verification = await Verification.findOne({ reportId });
    if (!verification) {
      return res.status(404).json({ success: false, message: "Verification not found" });
    }

    let updatedCount = 0;
    answersArray.forEach(({ questionId, answer }) => {
      const q = verification.questions.id(questionId);
      if (q) {
        q.answer = answer;
        updatedCount++;
      }
    });

    if (updatedCount === 0) {
      return res.status(400).json({ success: false, message: "No matching questions found" });
    }

    await verification.save();

    res.status(200).json({ success: true, message: "Answers submitted successfully" });
  } catch (error) {
    console.error("Error submitting answers:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getAnswers = async (req, res) => {
  try {
    const { reportId } = req.params;
   console.log(reportId)
    if (!reportId) {
      return res.status(400).json({ success: false, message: "reportId is required" });
    }

    
    const verification = await Verification.findOne(
      { reportId },
      { _id: 0, questions: 1 } 
    );

    if (!verification) {
      return res.status(404).json({ success: false, message: "Verification not found" });
    }

    res.status(200).json({ success: true, data: verification.questions });
  } catch (error) {
    console.error("Error fetching answers:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};