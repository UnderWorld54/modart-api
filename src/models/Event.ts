import mongoose, { Schema, Document } from 'mongoose';
import { IEvent, IEventDocument } from '../types';

const EventSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    start_date: {
      type: Date,
      required: [true, 'Start date is required']
    },
    end_date: {
      type: Date,
      required: [true, 'End date is required']
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Validation pour s'assurer que la date de fin est après la date de début
EventSchema.pre('save', function(this: IEventDocument, next) {
  if (this.start_date >= this.end_date) {
    next(new Error('End date must be after start date'));
  }
  next();
});

export default mongoose.model<IEventDocument & Document>('Event', EventSchema); 