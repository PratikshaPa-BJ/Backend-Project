const { isValidObjectId } = require("mongoose");
const bookModel = require("../models/bookModel");
const reviewModel = require("../models/reviewModel");
const valid = require("../validation/validator")


const createReview = async function(req, res){
    try{
        let bookid = req.params.bookId;
        let body = req.body;
        let { reviewedBy, rating, review } = req.body;

        if(!isValidObjectId(bookid)) {
          return res.status(400).send({ status: false, msg: "Please enter bookid in proper object id format."})
        } 
        let bookExist = await bookModel.findOne( {_id:bookid, isDeleted:false }) ;
        if(!bookExist) {
          return res.status(404).send({ status: false, msg: "Book not found or already deleted.. "})
        }


        if(!valid.isValidReqBody(req.body)){
            return res.status(400).send({ status: false, msg: "Please enter details in req body for adding review"})
        }     
        body.bookId = bookid
   

        if(body.hasOwnProperty('reviewedBy')){
          if(!valid.isValid(reviewedBy)){
            return res.status(400).send({ status: false, msg: "Please enter reviewer's name.."})
          }  
          if(!valid.validString(reviewedBy)){
            return res.status(400).send({ status: false, msg: "Please enter reviewer's name in string format using alphabets only.."})
          } 

        }
        if(!valid.isValid(rating)){
            return res.status(400).send({ status: false, msg: "Please give rating..it's mandatory.."})
        }
        if(!valid.IsNumeric(rating)){
            return res.status(400).send({ status: false, msg: "rating should be 1 to 5 and decimal also"})

        }
        if( rating > 5 || rating < 1 ){
            return res.status(400).send({ status: false, msg: "Please give rating between 1 to 5"})

        }
      let reviewDate = new Date();      
        body.reviewedAt = reviewDate;        
        
        let createReview = await reviewModel.create(body); 
        
        // if(body.hasOwnProperty('review') ){
        //   if(review !== ''){
        //      bookExist.reviews = bookExist.reviews + 1;
        // }}
        // await bookExist.save();
        // let updateBookData = bookExist.toObject();
        // updateBookData['reviewByPerson'] = createReview;        
        
         let updateBookData = await bookModel.findByIdAndUpdate( {_id: bookid }, { $inc:{ reviews : 1 }}, { new: true }).lean();
          updateBookData['reviewByPerson'] = createReview;
        
        return res.status(201).send({ status: true, msg: "Review added successfully.", data: updateBookData })
        
      }catch(err){
        return res.status(500).send({ status: false, msg: err.message })
    }
}

const updateReview = async function(req, res){
  try{
    let bookidFromReq = req.params.bookId;
    let reviewIdFromReq = req.params.reviewId;
    
    if(!isValidObjectId(bookidFromReq)) {
      return res.status(400).send({ status: false, msg: "Please enter bookid in proper object id format."})
    } 
      let bookExist = await bookModel.findOne( {_id:bookidFromReq, isDeleted:false }) ;
    if(!bookExist) {
        return res.status(404).send({ status: false, msg: "Book not found or already deleted.. "})
      }
    if(!isValidObjectId(reviewIdFromReq)) {
        return res.status(400).send({ status: false, msg: "Please enter review id in proper object id format."})
    } 
    let reviewExist = await reviewModel.findOne({_id: reviewIdFromReq, bookId: bookidFromReq, isDeleted: false });
    if(!reviewExist) {
        return res.status(404).send({ status: false, msg: "review not found or already deleted.. "})
    }
    let body = req.body;
    let { review, rating, reviewedBy } = body;

    if(!valid.isValidReqBody(req.body)){
            return res.status(400).send({ status: false, msg: "Please enter details in req body for updating review"})
    } 
    if(body.hasOwnProperty('reviewedBy')) {
      if(!valid.isValid(reviewedBy)){
            return res.status(400).send({ status: false, msg: "Please enter name of the reviewer.."})
       }
       if(!valid.validString(reviewedBy)){
            return res.status(400).send({ status: false, msg: "enter reviewer's name in string format.." })
       }  

    }
    if(body.hasOwnProperty('rating')){
      if(!valid.isValid(rating)){
            return res.status(400).send({ status: false, msg: "Please give rating..it's mandatory.."})
      }
        if(!valid.IsNumeric(rating)){
            return res.status(400).send({ status: false, msg: "rating should be 1 to 5 and decimal also"})

      }
        if( rating > 5 || rating < 1 ){
            return res.status(400).send({ status: false, msg: "Please give rating between 1 to 5"})

      }
    }
    if(body.hasOwnProperty('review')){
      if(!valid.isValid(review)){
        return res.status(400).send({ status: false, msg: "Please give review"})
      }
    }
    let updatedDetails = await reviewModel.findOneAndUpdate({ _id: reviewIdFromReq, bookId:bookidFromReq, isDeleted:false }, body, { new: true });
    let allBookDetails = bookExist.toObject();
    let reviewAll = await reviewModel.find({ bookId:bookidFromReq, isDeleted:false }).select({ __v:0, isDeleted:0 });
    allBookDetails['reviewsData']  = reviewAll
    
    return res.status(200).send({ status: true, message: "Review Updated successfully", data: allBookDetails })
    
  }catch(err){
    return res.status(500).send({ status: false, msg: err.message })
  }
}

const  deleteReview = async function(req, res){
 try{

    let bookidFromReq = req.params.bookId;
    let reviewIdFromReq = req.params.reviewId;
    if(!isValidObjectId(bookidFromReq)) {
          return res.status(400).send({ status: false, msg: "Please enter bookid in proper object id format."})
    } 
      let bookExist = await bookModel.findOne( {_id:bookidFromReq, isDeleted:false }) ;
      if(!bookExist) {
          return res.status(404).send({ status: false, msg: "Book not found or already deleted.. "})
      }
    if(!isValidObjectId(reviewIdFromReq)) {
          return res.status(400).send({ status: false, msg: "Please enter review id in proper object id format."})
    } 
    let reviewExist = await reviewModel.findOne({_id: reviewIdFromReq, bookId: bookidFromReq, isDeleted: false });
    if(!reviewExist) {
          return res.status(404).send({ status: false, msg: "review not found or already deleted.. "})
    }

     await reviewModel.updateOne({ _id:reviewIdFromReq, isDeleted:false }, { isDeleted: true, deletedAt: Date.now()})
    
    
  let updatedBookDetails = bookExist.reviews > 0 ? await bookModel.findOneAndUpdate({ _id: bookidFromReq }, { $inc: {reviews: -1 }}, {new: true}) : bookExist
    
  return res.status(200).send({ status: true, msg: "Review Deleted Successfully..", data: updatedBookDetails })

 }catch(err){
  return res.status(500).send({ status: false, msg: err.message})
 }
}

module.exports = { createReview, updateReview, deleteReview }