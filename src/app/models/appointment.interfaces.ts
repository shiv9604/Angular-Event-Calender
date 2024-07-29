export interface Appointment{
    id : number,
    userName: string,
    email: string,
    date: string,
    title : string,
    desc: string,
    time : string
}

export interface AppointmentDate{
    day: number,
    appointments: Appointment[]
}