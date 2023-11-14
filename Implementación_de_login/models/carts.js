import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const cartsCollection = 'carts';

const cartsSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    gender: String,
    grade: Number,
    group: String
});

cartsSchema.plugin(mongoosePaginate);

const cartsModel = mongoose.model(cartsCollection, cartsSchema);
export default cartsModel;