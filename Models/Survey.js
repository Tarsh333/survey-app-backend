import mongoose from 'mongoose';

const SurveySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    userName:{
        type:String
    },
    title:{
        type:String
    },
    description:{
        type:String
    },
    questions: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    link:{
        type:String
    }
});

const Survey = mongoose.model('survey', SurveySchema);

export default Survey;