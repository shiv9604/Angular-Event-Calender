export interface Appointment {
    id: number,
    date: string,
    title: string,
    desc: string,
    startTime: string,
    endTime: string,
    duration?: number
}

export interface AppointmentDate {
    day: number,
    appointments: Appointment[]
}

export interface DayofWeek {
    name: string, date: Date
}