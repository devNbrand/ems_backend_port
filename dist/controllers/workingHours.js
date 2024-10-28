import prisma from "../DB/dbconfig.js";
// Log work hours for a specific date
export const logWorkHours = async (req, res) => {
    try {
        const userId = req.user.id; // Get the user ID from the authenticated user
        const { date, workSessions } = req.body;
        // Validate required fields
        if (!date || !workSessions || !Array.isArray(workSessions) || workSessions.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Date and work sessions are required.",
            });
        }
        // Check for existing work hours for the user on the specified date
        let workingHours = await prisma.workingHours.findFirst({
            where: {
                userId,
                date: new Date(date),
            },
            include: {
                workSessions: true, // Include associated work sessions
            },
        });
        if (workingHours) {
            // If a record exists, append new sessions to existing workSessions
            const updatedSessions = await prisma.workSession.createMany({
                data: workSessions.map((session) => ({
                    startTime: new Date(session.startTime),
                    endTime: new Date(session.endTime),
                    workingHoursId: workingHours.id,
                })),
            });
            workingHours = await prisma.workingHours.findUnique({
                where: { id: workingHours.id },
                include: { workSessions: true },
            });
        }
        else {
            // If no record exists, create a new one with associated workSessions
            workingHours = await prisma.workingHours.create({
                data: {
                    userId,
                    date: new Date(date),
                    workSessions: {
                        create: workSessions.map((session) => ({
                            startTime: new Date(session.startTime),
                            endTime: new Date(session.endTime),
                        })),
                    },
                },
                include: { workSessions: true },
            });
        }
        return res.status(200).json({
            success: true,
            workingHours,
            message: "Work hours logged successfully.",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// Get work hours for a specific date
export const getWorkHours = async (req, res) => {
    try {
        const userId = req.user.id; // Get the user ID from the authenticated user
        const { date } = req.query; // Get date from query parameters
        // Validate required fields
        if (!date) {
            return res.status(400).json({
                success: false,
                message: "Date is required.",
            });
        }
        const workingHours = await prisma.workingHours.findFirst({
            where: {
                userId,
                date: new Date(date),
            },
            include: {
                workSessions: true, // Include associated work sessions
            },
        });
        if (!workingHours) {
            return res.status(404).json({
                success: false,
                message: "No work hours found for the specified date.",
            });
        }
        return res.status(200).json({
            success: true,
            workingHours,
            message: "Work hours retrieved successfully.",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
