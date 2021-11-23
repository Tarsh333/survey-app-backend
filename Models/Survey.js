import mongoose from 'mongoose';

const SurveySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
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
    },
    tags:{
        type: [mongoose.Schema.Types.Mixed]
    }
});

const Survey = mongoose.model('survey', SurveySchema);

export default Survey;