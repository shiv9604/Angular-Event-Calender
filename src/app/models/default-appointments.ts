import { Appointment } from "./appointment.interfaces";

export const defaultAppointments: Appointment[] = [
    {
        id : 1,
        date: '8/12/2024',
        title : 'Scrum Meeting',
        desc: 'Reason 1',
        startTime: '04:30',
        endTime: '06:30',
        duration: 120,
        bgColor : '#5268e5'
    },
    {
        id : 2,
        date: '8/13/2024',
        title : 'Technical Training',
        desc: 'Reason 2',
        startTime: '00:00',
        endTime: '01:00',
        duration: 60,
        bgColor : '#002F6C'
    },
    {
        id : 3,
        date: '8/11/2024',
        title : 'Client Meeting',
        desc: 'Reason 3',
        startTime: '00:45',
        endTime: '03:15',
        duration: 150,
        bgColor : '#3D0A4A'
    },
    {
        id : 4,
        date: '8/14/2024',
        title : 'Friday Indoor Games',
        desc: 'Reason 4',
        startTime: '05:30',
        endTime : '08:30',
        duration: 180,
        bgColor : '#004d4d'
    },
    {
        id : 5,
        date: '8/16/2024',
        title : 'Doctor Appointment',
        desc: 'Reason 5',
        startTime: '04:00',
        endTime: '04:45',
        duration: 45,
        bgColor : '#333333'
    },
]