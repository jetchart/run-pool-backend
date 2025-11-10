export enum MailTemplate {
  TRIP_CREATED = 'TRIP_CREATED',
  TRIP_CONFIRMED = 'TRIP_CONFIRMED',
  TRIP_JOIN = 'TRIP_JOIN',
  TRIP_REJECTED = 'TRIP_REJECTED',
  TRIP_LEAVED = 'TRIP_LEAVED',
}

export const MailTemplateConfig: Record<MailTemplate, { subject: string; html: (params: any) => string }> = {
  [MailTemplate.TRIP_CREATED]: {
    subject: 'Tu viaje fue creado 🚗📝',
    html: ({ name, raceName, tripDate, tripUrl }: any) => `
      <h2>¡Hola ${name}! 🏁</h2>
      <p>Tu viaje para la carrera <b>${raceName}</b> el <b>${tripDate}</b> fue creado. 🎉</p>
      <p>Ver detalles: <a href="${tripUrl}">${tripUrl}</a> 🔗</p>
    `,
  },
  [MailTemplate.TRIP_CONFIRMED]: {
    subject: '¡Viaje confirmado! ✅🚗',
    html: ({ name, raceName, tripDate, tripUrl }: any) => `
      <h2>¡Hola ${name}! 🎉</h2>
      <p>Tu viaje para la carrera <b>${raceName}</b> el <b>${tripDate}</b> fue confirmado. ✅</p>
      <p>Ver detalles: <a href="${tripUrl}">${tripUrl}</a> 🔗</p>
    `,
  },
  [MailTemplate.TRIP_JOIN]: {
    subject: '¡Nuevo pasajero! 🧑‍🤝‍🧑🚗',
    html: ({ name, raceName, passengerName, tripUrl }: any) => `
      <h2>¡Hola ${name}! 👋</h2>
      <p><b>${passengerName}</b> se sumó a tu viaje para la carrera <b>${raceName}</b>. 🙌</p>
      <p>Ver detalles: <a href="${tripUrl}">${tripUrl}</a> 🔗</p>
    `,
  },
  [MailTemplate.TRIP_REJECTED]: {
    subject: 'Postulación rechazada ❌😢',
    html: ({ name, raceName, tripDate, raceUrl }: any) => `
      <h2>¡Hola ${name}! 😔</h2>
      <p>Tu postulación para la carrera <b>${raceName}</b> el <b>${tripDate}</b> fue rechazada. ❌</p>
      <p>Ver otros viajes: <a href="${raceUrl}">${raceUrl}</a> 🔗</p>
    `,
  },
  [MailTemplate.TRIP_LEAVED]: {
    subject: 'Un pasajero abandonó tu viaje 😢🚗',
    html: ({ name, raceName, passengerName, tripUrl }: any) => `
      <h2>¡Hola ${name}! 👋</h2>
      <p><b>${passengerName}</b> abandonó tu viaje para la carrera <b>${raceName}</b>. 😢</p>
      <p>Ver detalles: <a href="${tripUrl}">${tripUrl}</a> 🔗</p>
    `,
  }
};
