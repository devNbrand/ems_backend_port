import { Request, Response } from "express";
import prisma from "../DB/dbconfig.js";

// Create AvailabilityHours
export const createAvailabilityHours:any = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id; // Assume user is authenticated and ID is in req.user
    const { date, availableTimes, notes } = req.body;

    // Create availability hours with nested available times
    const availabilityHours = await prisma.availabilityHours.create({
      data: {
        userId,
        date: new Date(date),
        notes,
        availableTimes: {
          create: availableTimes.map((time: { startTime: string; endTime: string }) => ({
            startTime: new Date(time.startTime),
            endTime: new Date(time.endTime),
          })),
        },
      },
    });

    return res.status(201).json({
      success: true,
      availabilityHours,
      message: "Availability hours created successfully.",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get AvailabilityHours by ID
export const getAvailabilityHoursById:any = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const availabilityHours = await prisma.availabilityHours.findUnique({
      where: { id: parseInt(id) },
      include: { availableTimes: true },
    });

    if (!availabilityHours) {
      return res.status(404).json({
        success: false,
        message: "Availability hours not found.",
      });
    }

    return res.status(200).json({
      success: true,
      availabilityHours,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update AvailabilityHours
export const updateAvailabilityHours:any = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { date, availableTimes, notes } = req.body;

    // Update availability hours and associated available times
    const availabilityHours = await prisma.availabilityHours.update({
      where: { id: parseInt(id) },
      data: {
        date: new Date(date),
        notes,
        availableTimes: {
          deleteMany: {}, // Clear existing availableTimes before updating
          create: availableTimes.map((time: { startTime: string; endTime: string }) => ({
            startTime: new Date(time.startTime),
            endTime: new Date(time.endTime),
          })),
        },
      },
      include: { availableTimes: true },
    });

    return res.status(200).json({
      success: true,
      availabilityHours,
      message: "Availability hours updated successfully.",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete AvailabilityHours
export const deleteAvailabilityHours:any = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Delete availability hours by ID
    const availabilityHours = await prisma.availabilityHours.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({
      success: true,
      message: "Availability hours deleted successfully.",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};