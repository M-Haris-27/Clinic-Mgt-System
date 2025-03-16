export const transformAppointment = (appointment) => ({
    id: appointment._id,
    title: appointment.title,
    start: appointment.start,
    end: appointment.end,
    extendedProps: {
      appointmentId: appointment._id,
      clientId: appointment.clientId,
      location: appointment.location,
      status: appointment.status,
    },
});