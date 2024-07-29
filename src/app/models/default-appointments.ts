import { Appointment } from "./appointment.interfaces";

export const defaultAppointments: Appointment[] = [
    {
        id : 1,
        userName: "User 1",
        email: "one@test.com",
        date: '7/29/2024',
        title : 'Appointment 1',
        desc: 'Reason 1',
        time : '12:00'
    },
    {
        id : 2,
        userName: "User 2",
        email: "two@test.com",
        date: '7/29/2024',
        title : 'Appointment 2',
        desc: 'Reason 2',
        time : '01:00'
    },
    {
        id : 3,
        userName: "User 3",
        email: "three@test.com",
        date: '7/30/2024',
        title : 'Appointment 3',
        desc: 'Reason 3',
        time : '09:00'
    },
    {
        id : 4,
        userName: "User 4",
        email: "three@test.com",
        date: '7/30/2024',
        title : 'Appointment 4',
        desc: 'Reason 4',
        time : '10:00'
    },
    {
        id : 5,
        userName: "User 5",
        email: "three@test.com",
        date: '7/30/2024',
        title : 'Appointment 5',
        desc: 'Reason 5',
        time : '12:00'
    },
]