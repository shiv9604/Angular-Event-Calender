import { Appointment } from "./appointment.interfaces";

export const defaultAppointments: Appointment[] = [
    {
        id : 1,
        date: '7/29/2024',
        title : 'Appointment 1',
        desc: 'Reason 1',
        startTime: '04:30',
        endTime : '05:30',
    },
    {
        id : 2,
        date: '7/29/2024',
        title : 'Appointment 2',
        desc: 'Reason 2',
        startTime: '00:00',
        endTime : '01:00',
    },
    {
        id : 3,
        date: '7/30/2024',
        title : 'Appointment 3',
        desc: 'Reason 3',
        startTime: '00:15',
        endTime : '01:15',
    },
    {
        id : 4,
        date: '7/30/2024',
        title : 'Appointment 4',
        desc: 'Reason 4',
        startTime: '12:30',
        endTime : '12:30',
    },
    {
        id : 5,
        date: '7/30/2024',
        title : 'Appointment 5',
        desc: 'Reason 5',
        startTime: '12:00',
        endTime : '12:45',
    },
]