import { studentsModel } from "./models/students.model";

export default class Students{
    constructor(){
        console.log('Working students with DB');
    }

    //NO Colocar logica de negocio 

    getAll = async () => {
        //MongoDB el formato de nuestros registros son formato BSON
        const students = await studentsModel.find();
        // Transformamos de BSON -> POJO (es un Plain Old Javasrypt Object)
        return students.map(student => student.toObject());
    }

    save = async () => {
        const result = await studentsModel.create(student);
        return result;
    }
}