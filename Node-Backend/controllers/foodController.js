import foodModel from "../models/foodModel.js";
import fs from 'fs'


// add food item

const addFood=async (req,res)=>{
    // ensure file was uploaded
    if (!req.file) {
        return res.status(400).json({ success: false, message: "Image is required" });
    }

    const image_filename = `${req.file.filename}`;

    // basic validation
    const { name, description, category } = req.body;
    let { price } = req.body;
    if (!name || !description || !price || !category) {
    return res.status(400).json({ success: false, message: "All fields are required" });
    }
    // ensure price stored as number
    price = Number(price);
    if (isNaN(price)) {
        return res.status(400).json({ success: false, message: "Price must be a number" });
    }

        // const food = new foodModel({
        //     name:req.body.name,
        //     description:req.body.description,
        //     price:req.body.price,
        //     category:req.body.category,
        //     image:image_filename,
        // })
        const food = new foodModel({
        name: name,
        description: description,
        price: price,
        category: category,
        image: image_filename,
        })
        try {
            await food.save();
                res.json({success:true,message:"Food Added"})
        } catch (error) {
                console.error('addFood error:', error);
                res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
                
        }
}

// displaying all foodlist->
const listFood=async (req,res)=>{
    try {
        const foods=await foodModel.find({});
        res.json({success:true,data:foods})
    } catch (error) {
        console.log("error")
        res.json({success:false,message:"ERROR"})
        
    }
}

// Removing food items
const removeFood=async (req,res)=>{
    try {
        const food=await foodModel.findById(req.body.id)
        if (!food) return res.status(404).json({ success: false, message: 'Food not found' });
        const filePath = `uploads/${food.image}`;
        fs.unlink(filePath, (err) => {
            if (err) console.warn('Failed to delete image file:', filePath, err.message || err);
        });
        await foodModel.findByIdAndDelete(req.body.id)
        res.json({success:true,message:"Food Removed"})
    } catch (error) {
        console.log("error")
        console.error('removeFood error:', error && error.stack ? error.stack : error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }

}


export {addFood,listFood,removeFood}