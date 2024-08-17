import { Appointment } from "./appointment.interfaces";

export const defaultAppointments: Appointment[] = [
    {
        id : 1,
        date: '8/04/2024',
        title : 'Appointment 1',
        desc: 'Reason 1',
        startTime: '04:30',
        endTime: '06:30',
        duration: 120,
        bgColor : '#5268e5'
    },
    {
        id : 2,
        date: '8/09/2024',
        title : 'Appointment 2',
        desc: 'Reason 2',
        startTime: '00:00',
        endTime: '01:00',
        duration: 60,
        bgColor : '#002F6C'
    },
    {
        id : 3,
        date: '8/05/2024',
        title : 'Appointment 3',
        desc: 'Reason 3',
        startTime: '00:45',
        endTime: '03:15',
        duration: 150,
        bgColor : '#3D0A4A'
    },
    {
        id : 4,
        date: '8/7/2024',
        title : 'Appointment 4',
        desc: 'Reason 4',
        startTime: '05:30',
        endTime : '08:30',
        duration: 180,
        bgColor : '#004d4d'
    },
    {
        id : 5,
        date: '8/9/2024',
        title : 'Appointment 5',
        desc: 'Reason 5',
        startTime: '04:00',
        endTime: '04:45',
        duration: 45,
        bgColor : '#333333'
    },
]