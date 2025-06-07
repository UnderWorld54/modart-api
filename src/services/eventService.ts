import Event from '../models/Event';
import { IEvent, IEventDocument } from '../types';

export class EventService {
  async createEvent(eventData: IEvent): Promise<IEventDocument> {
    try {
      const event = new Event(eventData);
      return await event.save();
    } catch (error) {
      throw new Error(`Error creating event: ${error}`);
    }
  }

  async getAllEvents(): Promise<IEventDocument[]> {
    try {
      return await Event.find({})
        .populate('createdBy', 'name email')
        .populate('updatedBy', 'name email')
        .sort({ start_date: 1 });
    } catch (error) {
      throw new Error(`Error fetching events: ${error}`);
    }
  }

  async getEventById(id: string): Promise<IEventDocument | null> {
    try {
      return await Event.findById(id)
        .populate('createdBy', 'name email')
        .populate('updatedBy', 'name email');
    } catch (error) {
      throw new Error(`Error fetching event: ${error}`);
    }
  }

  async updateEvent(id: string, eventData: Partial<IEvent>): Promise<IEventDocument | null> {
    try {
      return await Event.findByIdAndUpdate(
        id,
        eventData,
        { new: true, runValidators: true }
      ).populate('createdBy', 'name email')
       .populate('updatedBy', 'name email');
    } catch (error) {
      throw new Error(`Error updating event: ${error}`);
    }
  }

  async deleteEvent(id: string): Promise<IEventDocument | null> {
    try {
      return await Event.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error deleting event: ${error}`);
    }
  }

  async getActiveEvents(): Promise<IEventDocument[]> {
    try {
      return await Event.find({ isActive: true })
        .populate('createdBy', 'name email')
        .populate('updatedBy', 'name email')
        .sort({ start_date: 1 });
    } catch (error) {
      throw new Error(`Error fetching active events: ${error}`);
    }
  }
} 